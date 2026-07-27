"use server";
import {createHash} from "node:crypto";
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
function postgresCode(error:unknown){return typeof error==="object"&&error!==null&&"code" in error?String(error.code):""}

export async function registerInternalUser(previous:RegistrationState,formData:FormData):Promise<RegistrationState>{
  const email=String(formData.get("email")??"");
  if(rateLimited(email))return {ok:false,error:"Too many registration attempts. Wait a few minutes and try again.",attempt:previous.attempt+1};
  let environment:ReturnType<typeof serverEnv>;
  try{environment=serverEnv()}catch{return {ok:false,error:GENERIC_REGISTRATION_ERROR,attempt:previous.attempt+1}}
  const result=await registerInternalAccount({fullName:String(formData.get("fullName")??""),email,password:String(formData.get("password")??""),confirmPassword:String(formData.get("confirmPassword")??""),invitationCode:String(formData.get("invitationCode")??""),termsAccepted:formData.get("termsAccepted")==="on"},{invitationCode:environment.NEFE_INTERNAL_SIGNUP_CODE,organizationSlug:environment.NEFE_INTERNAL_ORGANIZATION_SLUG},{
    hashPassword:value=>hash(value,12),
    async createAccount(input){
      try{await database().transaction(async tx=>{
        const [organization]=await tx.select({id:organizations.id}).from(organizations).where(eq(organizations.slug,input.organizationSlug)).limit(1);
        if(!organization)throw new RegistrationUnavailableError();
        const existing=await tx.select({id:users.id}).from(users).where(sql`lower(${users.email}) = ${input.email}`).limit(1);
        if(existing[0])throw new RegistrationConflictError();
        const [user]=await tx.insert(users).values({name:input.name,email:input.email,passwordHash:input.passwordHash}).returning({id:users.id});
        await tx.insert(organizationMembers).values({organizationId:organization.id,userId:user.id,role:input.role,status:"ACTIVE"});
        await tx.insert(auditLogs).values({organizationId:organization.id,actorId:user.id,action:"internal_user.registered",entityType:"user",entityId:user.id,metadata:{userId:user.id,organizationId:organization.id,membershipRole:input.role,registrationTimestamp:input.registeredAt.toISOString()}});
      })}catch(error){if(error instanceof RegistrationUnavailableError||error instanceof RegistrationConflictError)throw error;if(postgresCode(error)==="23505")throw new RegistrationConflictError();throw error}
    },
  });
  if(result.ok)redirect("/sign-in?registered=1");
  return {...result,attempt:previous.attempt+1};
}
