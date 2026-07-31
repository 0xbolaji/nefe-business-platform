import "server-only";

import {and,count,eq,ne,sql} from "drizzle-orm";
import {database} from "../../../db/client";
import {auditLogs,organizationMembers,users} from "../../../db/schema";
import {requirePermission} from "./permissions";
import type {WorkspaceContext} from "./types";
import {administrativeAccountActionAllowed} from "./session-security-policy";

export class AccountSecurityError extends Error{
  constructor(public code:"NOT_FOUND"|"FORBIDDEN"|"LAST_OWNER"|"CROSS_ORGANIZATION_SCOPE"){super("The account security change is not permitted.");this.name="AccountSecurityError"}
}

type Tx=Parameters<Parameters<ReturnType<typeof database>["transaction"]>[0]>[0];

async function targetMembership(tx:Tx,context:WorkspaceContext,targetUserId:string){
  const [target]=await tx.select({id:organizationMembers.id,userId:organizationMembers.userId,role:organizationMembers.role,status:organizationMembers.status}).from(organizationMembers).where(and(eq(organizationMembers.organizationId,context.organization.id),eq(organizationMembers.userId,targetUserId))).limit(1);
  if(!target)throw new AccountSecurityError("NOT_FOUND");
  return target;
}

async function assertAdministrativeTarget(tx:Tx,context:WorkspaceContext,targetUserId:string,{global}:{global:boolean}){
  requirePermission(context.membership.role,"team.manage");
  const target=await targetMembership(tx,context,targetUserId);
  const [owners]=await tx.select({value:count()}).from(organizationMembers).where(and(eq(organizationMembers.organizationId,context.organization.id),eq(organizationMembers.role,"OWNER"),eq(organizationMembers.status,"ACTIVE")));
  let outsideActiveMemberships=0;
  if(global){
    const [outside]=await tx.select({value:count()}).from(organizationMembers).where(and(eq(organizationMembers.userId,targetUserId),eq(organizationMembers.status,"ACTIVE"),ne(organizationMembers.organizationId,context.organization.id)));
    outsideActiveMemberships=outside.value;
  }
  if(!administrativeAccountActionAllowed({actorRole:context.membership.role,targetRole:target.role,isSelf:targetUserId===context.user.id,activeOwnerCount:owners.value,outsideActiveMemberships,global})){
    if(target.role==="OWNER"&&target.status==="ACTIVE"&&owners.value<=1)throw new AccountSecurityError("LAST_OWNER");
    if(global&&outsideActiveMemberships>0)throw new AccountSecurityError("CROSS_ORGANIZATION_SCOPE");
    throw new AccountSecurityError("FORBIDDEN");
  }
  return target;
}

function audit(tx:Tx,context:WorkspaceContext,action:string,targetUserId:string,metadata:Record<string,unknown>={},entityType="user",entityId=targetUserId){
  return tx.insert(auditLogs).values({organizationId:context.organization.id,actorId:context.user.id,action,entityType,entityId,metadata:{targetUserId,...metadata}});
}

export async function invalidateAllUserSessions(context:WorkspaceContext,targetUserId=context.user.id){
  return database().transaction(async tx=>{
    if(targetUserId!==context.user.id)await assertAdministrativeTarget(tx,context,targetUserId,{global:true});
    const [updated]=await tx.update(users).set({securityVersion:sql`${users.securityVersion} + 1`,updatedAt:new Date()}).where(eq(users.id,targetUserId)).returning({id:users.id,securityVersion:users.securityVersion});
    if(!updated)throw new AccountSecurityError("NOT_FOUND");
    await audit(tx,context,"session.all_invalidated",targetUserId,{securityVersion:updated.securityVersion});
    return updated;
  });
}

export async function globallyDisableUser(context:WorkspaceContext,targetUserId:string){
  return database().transaction(async tx=>{
    await assertAdministrativeTarget(tx,context,targetUserId,{global:true});
    const [existing]=await tx.select({id:users.id,disabledAt:users.disabledAt}).from(users).where(eq(users.id,targetUserId)).limit(1);
    if(!existing)throw new AccountSecurityError("NOT_FOUND");
    if(existing.disabledAt)return existing;
    const now=new Date();
    const [updated]=await tx.update(users).set({disabledAt:now,securityVersion:sql`${users.securityVersion} + 1`,updatedAt:now}).where(and(eq(users.id,targetUserId),sql`${users.disabledAt} is null`)).returning({id:users.id,disabledAt:users.disabledAt,securityVersion:users.securityVersion});
    if(!updated){const [concurrent]=await tx.select({id:users.id,disabledAt:users.disabledAt,securityVersion:users.securityVersion}).from(users).where(eq(users.id,targetUserId)).limit(1);if(concurrent?.disabledAt)return concurrent;throw new AccountSecurityError("NOT_FOUND")}
    await audit(tx,context,"user.globally_disabled",targetUserId,{disabledAt:now.toISOString()});
    await audit(tx,context,"session.all_invalidated",targetUserId,{reason:"global_disablement",securityVersion:updated.securityVersion});
    return updated;
  });
}

export async function disableOrganizationMembership(context:WorkspaceContext,targetUserId:string){
  return database().transaction(async tx=>{
    const target=await assertAdministrativeTarget(tx,context,targetUserId,{global:false});
    if(target.status==="DISABLED")return target;
    const [updated]=await tx.update(organizationMembers).set({status:"DISABLED",updatedAt:new Date()}).where(and(eq(organizationMembers.id,target.id),eq(organizationMembers.organizationId,context.organization.id))).returning();
    await audit(tx,context,"membership.disabled",targetUserId,{membershipId:target.id},"organization_member",target.id);
    return updated;
  });
}

export async function removeOrganizationMembership(context:WorkspaceContext,targetUserId:string){
  return database().transaction(async tx=>{
    const target=await assertAdministrativeTarget(tx,context,targetUserId,{global:false});
    await tx.delete(organizationMembers).where(and(eq(organizationMembers.id,target.id),eq(organizationMembers.organizationId,context.organization.id)));
    await audit(tx,context,"membership.removed",targetUserId,{membershipId:target.id},"organization_member",target.id);
  });
}
