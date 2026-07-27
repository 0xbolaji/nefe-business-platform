"use server";
import {createHash,randomUUID} from "node:crypto";
import {hash} from "bcryptjs";
import {eq,sql} from "drizzle-orm";
import {redirect} from "next/navigation";
import {database} from "@/db/client";
import {auditLogs,organizationMembers,organizations,users} from "@/db/schema";
import {GENERIC_REGISTRATION_ERROR,registerInternalAccount,RegistrationDiagnosticError,RegistrationUnavailableError,type RegistrationAvailabilityDiagnostic,type RegistrationDiagnostic,type RegistrationResult,type RegistrationStage} from "@/app/lib/auth/internal-registration";
import {serverEnv} from "@/app/lib/server-env";

export type RegistrationState=RegistrationResult&{attempt:number};
const attempts=new Map<string,number[]>();
const allowedPostgresCodes=new Set(["08000","08001","08003","08004","08006","23502","23503","23505","40001","42501","42P01","42703","57P01"]);
const allowedConstraints=new Set(["users_email_uq","users_pkey","organization_members_pkey","org_members_org_user_uq","audit_logs_pkey"]);
function rateLimited(email:string){const now=Date.now(),key=createHash("sha256").update(email.trim().toLowerCase()).digest("hex"),recent=(attempts.get(key)??[]).filter(value=>now-value<10*60_000);recent.push(now);attempts.set(key,recent);return recent.length>5}
function errorField(error:unknown,field:"code"|"constraint"){if(typeof error!=="object"||error===null||!(field in error))return null;return String((error as Record<string,unknown>)[field])}
function safePostgres(error:unknown){const code=errorField(error,"code"),constraint=errorField(error,"constraint");return {postgresCode:code&&allowedPostgresCodes.has(code)?code:null,constraint:constraint&&allowedConstraints.has(constraint)?constraint:null}}
function reportFailure(value:RegistrationDiagnostic){console.error(JSON.stringify(value))}
function reportAvailability(value:RegistrationAvailabilityDiagnostic){console.error(JSON.stringify(value))}
async function databaseStage<T>(stage:RegistrationStage,operation:()=>Promise<T>):Promise<T>{try{return await operation()}catch(error){if(error instanceof RegistrationUnavailableError||error instanceof RegistrationDiagnosticError)throw error;const safe=safePostgres(error);const duplicate=stage==="user_insert"&&safe.postgresCode==="23505";throw new RegistrationDiagnosticError(stage,duplicate?"duplicate_email":"database_error",safe.postgresCode,safe.constraint)}}

export async function registerInternalUser(previous:RegistrationState,formData:FormData):Promise<RegistrationState>{
  const attemptId=randomUUID();
  const email=String(formData.get("email")??"");
  if(rateLimited(email))return {ok:false,error:"Too many registration attempts. Wait a few minutes and try again.",attempt:previous.attempt+1};
  let environment:ReturnType<typeof serverEnv>;
  try{environment=serverEnv()}catch{reportFailure({event:"internal_registration_failed",attemptId,stage:"unexpected",reason:"configuration_error",postgresCode:null,constraint:null,timestamp:new Date().toISOString()});return {ok:false,error:`${GENERIC_REGISTRATION_ERROR} Reference: ${attemptId}`,attempt:previous.attempt+1}}
  const result=await registerInternalAccount({fullName:String(formData.get("fullName")??""),email,password:String(formData.get("password")??""),confirmPassword:String(formData.get("confirmPassword")??""),invitationCode:String(formData.get("invitationCode")??""),termsAccepted:formData.get("termsAccepted")==="on"},{invitationCode:environment.NEFE_INTERNAL_SIGNUP_CODE,organizationSlug:environment.NEFE_INTERNAL_ORGANIZATION_SLUG},{
    hashPassword:value=>hash(value,12),reportFailure,reportAvailability,
    async createAccount(input){
      try{await database().transaction(async tx=>{
        const [organization]=await databaseStage("organization_lookup",()=>tx.select({id:organizations.id}).from(organizations).where(eq(organizations.slug,input.organizationSlug)).limit(1));
        if(!organization)throw new RegistrationUnavailableError();
        const existing=await databaseStage("duplicate_check",()=>tx.select({id:users.id}).from(users).where(sql`lower(${users.email}) = ${input.email}`).limit(1));
        if(existing[0])throw new RegistrationDiagnosticError("duplicate_check","duplicate_email");
        const [user]=await databaseStage("user_insert",()=>tx.insert(users).values({name:input.name,email:input.email,passwordHash:input.passwordHash}).returning({id:users.id}));
        await databaseStage("membership_insert",()=>tx.insert(organizationMembers).values({organizationId:organization.id,userId:user.id,role:input.role,status:"ACTIVE"}));
        await databaseStage("audit_insert",()=>tx.insert(auditLogs).values({organizationId:organization.id,actorId:user.id,action:"internal_user.registered",entityType:"user",entityId:user.id,metadata:{userId:user.id,organizationId:organization.id,membershipRole:input.role,registrationTimestamp:input.registeredAt.toISOString()}}));
      })}catch(error){if(error instanceof RegistrationUnavailableError||error instanceof RegistrationDiagnosticError)throw error;const safe=safePostgres(error);throw new RegistrationDiagnosticError("transaction_commit","database_error",safe.postgresCode,safe.constraint)}
    },
  },attemptId);
  if(result.ok)redirect("/sign-in?registered=1");
  return {...result,attempt:previous.attempt+1};
}
