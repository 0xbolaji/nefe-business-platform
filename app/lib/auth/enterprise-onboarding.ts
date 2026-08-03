import "server-only";
import {hash,compare} from "bcryptjs";
import {and,desc,eq,gt,isNull,ne,sql} from "drizzle-orm";
import {database} from "@/db/client";
import {auditLogs,authSessionRegistry,emailVerificationTokens,invitations,organizationMembers,passwordResetTokens,users} from "@/db/schema";
import type {AppRole,WorkspaceContext} from "./types";
import {can} from "./permissions";
import {createSecureToken,hashSecureToken,tokenExpiry} from "./secure-tokens";
import {invitationCanBeAccepted,invitationRoleAllowed,passwordMeetsPolicy} from "./onboarding-policy";

export const INVITATION_ROLES:AppRole[]=["ADMINISTRATOR","MANAGER","ANALYST","CONTRIBUTOR","VIEWER"];
export class OnboardingSecurityError extends Error{constructor(public code:"INVALID"|"FORBIDDEN"|"CONFLICT"|"EXPIRED"|"NOT_FOUND"|"STALE"){super(code)}}
const normalizeEmail=(value:string)=>value.trim().toLowerCase();
const safeAudit=(organizationId:string,actorId:string|null,action:string,entityId:string,metadata:Record<string,unknown>={})=>({organizationId,actorId,action,entityType:"authentication",entityId,metadata});

export async function createManagedInvitation(context:WorkspaceContext,input:{email:string;role:AppRole;expiresInDays:number}){
  if(!can(context.membership.role,"team.manage")||!invitationRoleAllowed(context.membership.role,input.role))throw new OnboardingSecurityError("FORBIDDEN");
  const email=normalizeEmail(input.email);if(!/^\S+@\S+\.\S+$/.test(email)||!INVITATION_ROLES.includes(input.role)||input.expiresInDays<1||input.expiresInDays>30)throw new OnboardingSecurityError("INVALID");
  const token=createSecureToken(),tokenHash=hashSecureToken(token),now=new Date(),expiresAt=tokenExpiry(input.expiresInDays*24*60,now);
  const invitation=await database().transaction(async tx=>{
    const existingMember=await tx.select({id:organizationMembers.id}).from(organizationMembers).innerJoin(users,eq(users.id,organizationMembers.userId)).where(and(eq(organizationMembers.organizationId,context.organization.id),sql`lower(${users.email}) = ${email}`)).limit(1);
    if(existingMember[0])throw new OnboardingSecurityError("CONFLICT");
    const activeInvite=await tx.select({id:invitations.id}).from(invitations).where(and(eq(invitations.organizationId,context.organization.id),sql`lower(${invitations.email}) = ${email}`,eq(invitations.status,"PENDING"),gt(invitations.expiresAt,now),isNull(invitations.revokedAt))).limit(1);
    if(activeInvite[0])throw new OnboardingSecurityError("CONFLICT");
    const [created]=await tx.insert(invitations).values({organizationId:context.organization.id,email,role:input.role,status:"PENDING",tokenHash,invitedById:context.user.id,expiresAt}).returning();
    await tx.insert(auditLogs).values(safeAudit(context.organization.id,context.user.id,"invitation.created",created.id,{role:input.role,expiresAt:expiresAt.toISOString()}));
    return created;
  });
  return {invitation,token};
}

export async function revokeManagedInvitation(context:WorkspaceContext,invitationId:string){
  if(!can(context.membership.role,"team.manage"))throw new OnboardingSecurityError("FORBIDDEN");
  const now=new Date();return database().transaction(async tx=>{
    const [updated]=await tx.update(invitations).set({status:"REVOKED",revokedAt:now,updatedAt:now}).where(and(eq(invitations.id,invitationId),eq(invitations.organizationId,context.organization.id),eq(invitations.status,"PENDING"))).returning({id:invitations.id});
    if(!updated)throw new OnboardingSecurityError("NOT_FOUND");
    await tx.insert(auditLogs).values(safeAudit(context.organization.id,context.user.id,"invitation.revoked",updated.id));return updated;
  });
}

export async function listManagedInvitations(context:WorkspaceContext){
  if(!can(context.membership.role,"team.manage"))return [];
  const now=new Date();
  await database().update(invitations).set({status:"EXPIRED",updatedAt:now}).where(and(eq(invitations.organizationId,context.organization.id),eq(invitations.status,"PENDING"),sql`${invitations.expiresAt} <= ${now}`));
  return database().select({id:invitations.id,email:invitations.email,role:invitations.role,status:invitations.status,expiresAt:invitations.expiresAt,createdAt:invitations.createdAt,invitedBy:users.name}).from(invitations).leftJoin(users,eq(users.id,invitations.invitedById)).where(eq(invitations.organizationId,context.organization.id)).orderBy(desc(invitations.createdAt)).limit(100);
}

export async function registerFromInvitation(input:{token:string;name:string;email:string;password:string}){
  const email=normalizeEmail(input.email);if(input.name.trim().length<2||input.name.length>100||!/^\S+@\S+\.\S+$/.test(email)||!passwordMeetsPolicy(input.password)||input.token.length<20)throw new OnboardingSecurityError("INVALID");
  const passwordHash=await hash(input.password,12),invitationHash=hashSecureToken(input.token),verificationToken=createSecureToken(),verificationHash=hashSecureToken(verificationToken),now=new Date();
  const result=await database().transaction(async tx=>{
    const [candidate]=await tx.select().from(invitations).where(eq(invitations.tokenHash,invitationHash)).limit(1);
    if(candidate&&candidate.expiresAt&&candidate.expiresAt<=now){await tx.update(invitations).set({status:"EXPIRED",updatedAt:now}).where(and(eq(invitations.id,candidate.id),eq(invitations.status,"PENDING")));throw new OnboardingSecurityError("EXPIRED")}
    if(!invitationCanBeAccepted(candidate,email,now))throw new OnboardingSecurityError("INVALID");
    const [invitation]=await tx.update(invitations).set({status:"ACCEPTED",acceptedAt:now,tokenHash:null,updatedAt:now}).where(and(eq(invitations.id,candidate!.id),eq(invitations.status,"PENDING"),isNull(invitations.revokedAt),gt(invitations.expiresAt,now))).returning();
    if(!invitation)throw new OnboardingSecurityError("STALE");
    const existing=await tx.select({id:users.id}).from(users).where(sql`lower(${users.email}) = ${email}`).limit(1);if(existing[0])throw new OnboardingSecurityError("CONFLICT");
    const [user]=await tx.insert(users).values({name:input.name.trim(),email,passwordHash,emailVerified:null}).returning({id:users.id,email:users.email});
    await tx.insert(organizationMembers).values({organizationId:invitation.organizationId,userId:user.id,role:invitation.role,status:"INVITED"});
    await tx.insert(emailVerificationTokens).values({userId:user.id,organizationId:invitation.organizationId,tokenHash:verificationHash,expiresAt:tokenExpiry(24*60,now)});
    await tx.insert(auditLogs).values(safeAudit(invitation.organizationId,user.id,"account.registered",user.id,{invitationId:invitation.id,role:invitation.role,verificationPending:true}));
    return {user,organizationId:invitation.organizationId};
  });
  return {...result,verificationToken};
}

export async function verifyEmailAddress(token:string){
  const tokenHash=hashSecureToken(token),now=new Date();return database().transaction(async tx=>{
    const [record]=await tx.update(emailVerificationTokens).set({usedAt:now}).where(and(eq(emailVerificationTokens.tokenHash,tokenHash),isNull(emailVerificationTokens.usedAt),gt(emailVerificationTokens.expiresAt,now))).returning();if(!record)throw new OnboardingSecurityError("INVALID");
    const [user]=await tx.update(users).set({emailVerified:now,updatedAt:now}).where(and(eq(users.id,record.userId),isNull(users.emailVerified))).returning({id:users.id});
    if(!user){const existing=await tx.select({id:users.id}).from(users).where(eq(users.id,record.userId)).limit(1);if(!existing[0])throw new OnboardingSecurityError("NOT_FOUND")}
    await tx.update(organizationMembers).set({status:"ACTIVE",updatedAt:now}).where(and(eq(organizationMembers.organizationId,record.organizationId),eq(organizationMembers.userId,record.userId),eq(organizationMembers.status,"INVITED")));
    await tx.insert(auditLogs).values(safeAudit(record.organizationId,record.userId,"email.verified",record.userId));return {userId:record.userId};
  });
}

export async function createEmailVerification(emailValue:string){const email=normalizeEmail(emailValue),now=new Date(),token=createSecureToken();return database().transaction(async tx=>{const [candidate]=await tx.select({userId:users.id,email:users.email,organizationId:organizationMembers.organizationId}).from(users).innerJoin(organizationMembers,eq(organizationMembers.userId,users.id)).where(and(sql`lower(${users.email}) = ${email}`,isNull(users.emailVerified),isNull(users.disabledAt),eq(organizationMembers.status,"INVITED"))).limit(1);if(!candidate)return null;await tx.update(emailVerificationTokens).set({usedAt:now}).where(and(eq(emailVerificationTokens.userId,candidate.userId),isNull(emailVerificationTokens.usedAt)));await tx.insert(emailVerificationTokens).values({userId:candidate.userId,organizationId:candidate.organizationId,tokenHash:hashSecureToken(token),expiresAt:tokenExpiry(24*60,now)});return {email:candidate.email,token}})}

export async function createPasswordReset(emailValue:string){
  const email=normalizeEmail(emailValue),now=new Date(),token=createSecureToken();
  const result=await database().transaction(async tx=>{
    const [user]=await tx.select({id:users.id,email:users.email,disabledAt:users.disabledAt}).from(users).where(sql`lower(${users.email}) = ${email}`).limit(1);if(!user||user.disabledAt)return null;
    await tx.update(passwordResetTokens).set({usedAt:now}).where(and(eq(passwordResetTokens.userId,user.id),isNull(passwordResetTokens.usedAt)));
    await tx.insert(passwordResetTokens).values({userId:user.id,tokenHash:hashSecureToken(token),expiresAt:tokenExpiry(60,now)});return {email:user.email,token};
  });return result;
}

export async function resetPassword(input:{token:string;password:string}){
  if(!passwordMeetsPolicy(input.password))throw new OnboardingSecurityError("INVALID");const passwordHash=await hash(input.password,12),tokenHash=hashSecureToken(input.token),now=new Date();
  return database().transaction(async tx=>{
    const [record]=await tx.update(passwordResetTokens).set({usedAt:now}).where(and(eq(passwordResetTokens.tokenHash,tokenHash),isNull(passwordResetTokens.usedAt),gt(passwordResetTokens.expiresAt,now))).returning();if(!record)throw new OnboardingSecurityError("INVALID");
    const [updated]=await tx.update(users).set({passwordHash,securityVersion:sql`${users.securityVersion} + 1`,updatedAt:now}).where(and(eq(users.id,record.userId),isNull(users.disabledAt))).returning({id:users.id});if(!updated)throw new OnboardingSecurityError("INVALID");
    await tx.update(authSessionRegistry).set({revokedAt:now}).where(and(eq(authSessionRegistry.userId,updated.id),isNull(authSessionRegistry.revokedAt)));
    const memberships=await tx.select({organizationId:organizationMembers.organizationId}).from(organizationMembers).where(eq(organizationMembers.userId,updated.id));
    for(const membership of memberships)await tx.insert(auditLogs).values(safeAudit(membership.organizationId,updated.id,"password.reset",updated.id,{sessionsInvalidated:true}));return updated;
  });
}

export async function changePassword(context:WorkspaceContext,input:{currentPassword:string;newPassword:string;currentSessionId?:string}){
  if(!passwordMeetsPolicy(input.newPassword))throw new OnboardingSecurityError("INVALID");const now=new Date();
  return database().transaction(async tx=>{
    const [user]=await tx.select({id:users.id,passwordHash:users.passwordHash}).from(users).where(eq(users.id,context.user.id)).limit(1);if(!user?.passwordHash||!(await compare(input.currentPassword,user.passwordHash)))throw new OnboardingSecurityError("INVALID");
    await tx.update(users).set({passwordHash:await hash(input.newPassword,12),updatedAt:now}).where(eq(users.id,user.id));
    const sessionCondition=input.currentSessionId?and(eq(authSessionRegistry.userId,user.id),ne(authSessionRegistry.id,input.currentSessionId),isNull(authSessionRegistry.revokedAt)):and(eq(authSessionRegistry.userId,user.id),isNull(authSessionRegistry.revokedAt));
    await tx.update(authSessionRegistry).set({revokedAt:now}).where(sessionCondition);
    await tx.insert(auditLogs).values(safeAudit(context.organization.id,user.id,"password.changed",user.id,{otherSessionsInvalidated:true}));return {id:user.id};
  });
}
