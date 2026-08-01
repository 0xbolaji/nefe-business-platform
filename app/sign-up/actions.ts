"use server";
import {createHash,randomUUID} from "node:crypto";
import {hash} from "bcryptjs";
import {eq,sql} from "drizzle-orm";
import {redirect} from "next/navigation";
import {database} from "@/db/client";
import {auditLogs,organizationMembers,organizations,users} from "@/db/schema";
import {GENERIC_REGISTRATION_ERROR,registerInternalAccount,RegistrationConflictError,RegistrationUnavailableError,type RegistrationResult} from "@/app/lib/auth/internal-registration";
import {serverEnv} from "@/app/lib/server-env";

export type RegistrationState=RegistrationResult&{attempt:number};
const attempts=new Map<string,number[]>();
function rateLimited(email:string){const now=Date.now(),key=createHash("sha256").update(email.trim().toLowerCase()).digest("hex"),recent=(attempts.get(key)??[]).filter(value=>now-value<10*60_000);recent.push(now);attempts.set(key,recent);return recent.length>5}
function errorCause(error:unknown){return typeof error==="object"&&error!==null&&"cause" in error?error.cause:error}
function postgresCode(error:unknown){const cause=errorCause(error);return typeof cause==="object"&&cause!==null&&"code" in cause?String(cause.code):""}
function postgresConstraint(error:unknown){const cause=errorCause(error);return typeof cause==="object"&&cause!==null&&"constraint_name" in cause?String(cause.constraint_name):typeof cause==="object"&&cause!==null&&"constraint" in cause?String(cause.constraint):""}
const allowedPostgresCodes=new Set(["08000","08001","08003","08004","08006","23503","23505","23514","40001","42P01","42703","57P01"]);
const allowedConstraints=new Set(["users_email_uq","org_members_org_user_uq","organization_members_organization_id_organizations_id_fk","organization_members_user_id_users_id_fk","audit_logs_organization_id_organizations_id_fk","audit_logs_actor_id_users_id_fk"]);

export async function registerInternalUser(previous:RegistrationState,formData:FormData):Promise<RegistrationState>{
  const requestId=randomUUID();
  const diagnose=(stage:string,reason:string,error?:unknown)=>{const code=postgresCode(error),constraint=postgresConstraint(error);console.error(JSON.stringify({event:"registration.failure",requestId,stage,reason,postgresCode:allowedPostgresCodes.has(code)?code:undefined,constraint:allowedConstraints.has(constraint)?constraint:undefined,timestamp:new Date().toISOString()}))};
  const email=String(formData.get("email")??"");
  if(rateLimited(email)){diagnose("validation","rate_limited");return {ok:false,error:"Too many registration attempts. Wait a few minutes and try again.",attempt:previous.attempt+1};}
  let environment:ReturnType<typeof serverEnv>;
  try{environment=serverEnv()}catch(error){diagnose("validation","configuration_error",error);return {ok:false,error:GENERIC_REGISTRATION_ERROR,attempt:previous.attempt+1}}
  let stage="organization_lookup";
  const result=await registerInternalAccount({fullName:String(formData.get("fullName")??""),email,password:String(formData.get("password")??""),confirmPassword:String(formData.get("confirmPassword")??""),invitationCode:String(formData.get("invitationCode")??""),termsAccepted:formData.get("termsAccepted")==="on"},{invitationCode:environment.NEFE_INTERNAL_SIGNUP_CODE,organizationSlug:environment.NEFE_INTERNAL_ORGANIZATION_SLUG},{
    hashPassword:value=>hash(value,12),
    diagnose:event=>diagnose(event.stage,event.reason),
    async createAccount(input){
      try{await database().transaction(async tx=>{
        stage="organization_lookup";
        const [organization]=await tx.select({id:organizations.id}).from(organizations).where(eq(organizations.slug,input.organizationSlug)).limit(1);
        if(!organization){diagnose(stage,"organization_not_found");throw new RegistrationUnavailableError();}
        stage="existing_email_check";
        const existing=await tx.select({id:users.id}).from(users).where(sql`lower(${users.email}) = ${input.email}`).limit(1);
        if(existing[0]){diagnose(stage,"duplicate_email");throw new RegistrationConflictError();}
        stage="user_insert";
        const [user]=await tx.insert(users).values({name:input.name,email:input.email,passwordHash:input.passwordHash}).returning({id:users.id});
        stage="membership_insert";
        await tx.insert(organizationMembers).values({organizationId:organization.id,userId:user.id,role:input.role,status:"ACTIVE"});
        stage="audit_insert";
        await tx.insert(auditLogs).values({organizationId:organization.id,actorId:user.id,action:"internal_user.registered",entityType:"user",entityId:user.id,metadata:{userId:user.id,organizationId:organization.id,membershipRole:input.role,registrationTimestamp:input.registeredAt.toISOString()}});
        stage="transaction_commit";
      })}catch(error){if(error instanceof RegistrationUnavailableError||error instanceof RegistrationConflictError)throw error;const code=postgresCode(error);diagnose(stage,code==="23505"?"duplicate_email":"database_error",error);if(code==="23505")throw new RegistrationConflictError();throw error}
    },
  });
  if(result.ok)redirect("/sign-in?registered=1");
  return {...result,attempt:previous.attempt+1};
}
