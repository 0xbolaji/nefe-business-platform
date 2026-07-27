import {timingSafeEqual} from "node:crypto";
import {z} from "zod";

export const INTERNAL_REGISTRATION_ROLE="VIEWER" as const;
export const GENERIC_REGISTRATION_ERROR="Registration could not be completed. Check your details and invitation and try again.";
export const registrationStages=["invitation_validation","password_hash","organization_lookup","duplicate_check","user_insert","membership_insert","audit_insert","transaction_commit","unexpected"] as const;
export const registrationReasons=["invalid_invitation","duplicate_email","database_error","configuration_error","unexpected_error"] as const;
export type RegistrationStage=(typeof registrationStages)[number];
export type RegistrationReason=(typeof registrationReasons)[number];
export type RegistrationDiagnostic={event:"internal_registration_failed";attemptId:string;stage:RegistrationStage;reason:RegistrationReason;postgresCode:string|null;constraint:string|null;timestamp:string};

const inputSchema=z.object({
  fullName:z.string().trim().min(2,"Enter your full name.").max(100,"Name must be 100 characters or fewer."),
  email:z.string().trim().toLowerCase().max(254).pipe(z.email("Enter a valid email address.")),
  password:z.string().min(12,"Use at least 12 characters.").max(128,"Password must be 128 characters or fewer."),
  confirmPassword:z.string().max(128),
  invitationCode:z.string().max(256),
  termsAccepted:z.boolean().refine(Boolean,"You must acknowledge the terms."),
}).strip().superRefine((value,context)=>{if(value.password!==value.confirmPassword)context.addIssue({code:"custom",path:["confirmPassword"],message:"Passwords do not match."})});

export type RegistrationInput=z.input<typeof inputSchema>;
export type RegistrationField="fullName"|"email"|"password"|"confirmPassword"|"termsAccepted";
export type RegistrationResult={ok:true}|{ok:false;error:string;fieldErrors?:Partial<Record<RegistrationField,string>>};
export type AtomicRegistration={name:string;email:string;passwordHash:string;organizationSlug:string;role:typeof INTERNAL_REGISTRATION_ROLE;registeredAt:Date};
export interface RegistrationDependencies{hashPassword(password:string):Promise<string>;createAccount(input:AtomicRegistration):Promise<void>;reportFailure(diagnostic:RegistrationDiagnostic):void}
export class RegistrationUnavailableError extends Error{}
export class RegistrationDiagnosticError extends Error{constructor(public readonly stage:RegistrationStage,public readonly reason:RegistrationReason,public readonly postgresCode:string|null=null,public readonly constraint:string|null=null){super(reason);this.name="RegistrationDiagnosticError"}}

function validCode(value:string,expected:string){const supplied=Buffer.from(value);const configured=Buffer.from(expected);return supplied.length===configured.length&&timingSafeEqual(supplied,configured)}
function diagnostic(attemptId:string,stage:RegistrationStage,reason:RegistrationReason,postgresCode:string|null=null,constraint:string|null=null):RegistrationDiagnostic{return {event:"internal_registration_failed",attemptId,stage,reason,postgresCode,constraint,timestamp:new Date().toISOString()}}
function genericFailure(attemptId:string):RegistrationResult{return {ok:false,error:`${GENERIC_REGISTRATION_ERROR} Reference: ${attemptId}`}}

export async function registerInternalAccount(raw:unknown,configuration:{invitationCode?:string;organizationSlug?:string},dependencies:RegistrationDependencies,attemptId:string):Promise<RegistrationResult>{
  const parsed=inputSchema.safeParse(raw);
  if(!parsed.success){const flattened=parsed.error.flatten().fieldErrors;const fieldErrors:Partial<Record<RegistrationField,string>>={};for(const key of ["fullName","email","password","confirmPassword","termsAccepted"] as const){if(flattened[key]?.[0])fieldErrors[key]=flattened[key][0]}return {ok:false,error:"Review the highlighted fields.",fieldErrors}}
  if(!configuration.invitationCode||!configuration.organizationSlug){dependencies.reportFailure(diagnostic(attemptId,"unexpected","configuration_error"));return {ok:false,error:"Registration is currently unavailable."}}
  if(!validCode(parsed.data.invitationCode,configuration.invitationCode)){dependencies.reportFailure(diagnostic(attemptId,"invitation_validation","invalid_invitation"));return genericFailure(attemptId)}
  let passwordHash:string;
  try{passwordHash=await dependencies.hashPassword(parsed.data.password)}catch{dependencies.reportFailure(diagnostic(attemptId,"password_hash","unexpected_error"));return genericFailure(attemptId)}
  try{await dependencies.createAccount({name:parsed.data.fullName,email:parsed.data.email,passwordHash,organizationSlug:configuration.organizationSlug,role:INTERNAL_REGISTRATION_ROLE,registeredAt:new Date()});return {ok:true}}catch(error){
    if(error instanceof RegistrationUnavailableError){dependencies.reportFailure(diagnostic(attemptId,"organization_lookup","configuration_error"));return {ok:false,error:"Registration is currently unavailable."}}
    if(error instanceof RegistrationDiagnosticError)dependencies.reportFailure(diagnostic(attemptId,error.stage,error.reason,error.postgresCode,error.constraint));
    else dependencies.reportFailure(diagnostic(attemptId,"unexpected","unexpected_error"));
    return genericFailure(attemptId);
  }
}
