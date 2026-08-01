import {timingSafeEqual} from "node:crypto";
import {z} from "zod";

export const INTERNAL_REGISTRATION_ROLE="VIEWER" as const;
export const GENERIC_REGISTRATION_ERROR="Registration could not be completed. Check your details and invitation and try again.";

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
export type RegistrationDiagnostic={stage:"validation"|"invitation_verification"|"password_hash"|"organization_lookup"|"existing_email_check"|"user_insert"|"membership_insert"|"audit_insert"|"transaction_commit";reason:string};
export interface RegistrationDependencies{hashPassword(password:string):Promise<string>;createAccount(input:AtomicRegistration):Promise<void>;diagnose?(event:RegistrationDiagnostic):void}
export class RegistrationUnavailableError extends Error{}
export class RegistrationConflictError extends Error{}

function validCode(value:string,expected:string){const supplied=Buffer.from(value);const configured=Buffer.from(expected);return supplied.length===configured.length&&timingSafeEqual(supplied,configured)}

export async function registerInternalAccount(raw:unknown,configuration:{invitationCode?:string;organizationSlug?:string},dependencies:RegistrationDependencies):Promise<RegistrationResult>{
  const parsed=inputSchema.safeParse(raw);
  if(!parsed.success){dependencies.diagnose?.({stage:"validation",reason:"invalid_input"});const flattened=parsed.error.flatten().fieldErrors;const fieldErrors:Partial<Record<RegistrationField,string>>={};for(const key of ["fullName","email","password","confirmPassword","termsAccepted"] as const){if(flattened[key]?.[0])fieldErrors[key]=flattened[key][0]}return {ok:false,error:"Review the highlighted fields.",fieldErrors}}
  if(!configuration.invitationCode||!configuration.organizationSlug){dependencies.diagnose?.({stage:"validation",reason:"configuration_error"});return {ok:false,error:"Registration is currently unavailable."};}
  if(!validCode(parsed.data.invitationCode,configuration.invitationCode)){dependencies.diagnose?.({stage:"invitation_verification",reason:"invalid_invitation"});return {ok:false,error:GENERIC_REGISTRATION_ERROR};}
  let passwordHash:string;
  try{passwordHash=await dependencies.hashPassword(parsed.data.password)}catch{dependencies.diagnose?.({stage:"password_hash",reason:"hash_failed"});return {ok:false,error:GENERIC_REGISTRATION_ERROR}}
  try{await dependencies.createAccount({name:parsed.data.fullName,email:parsed.data.email,passwordHash,organizationSlug:configuration.organizationSlug,role:INTERNAL_REGISTRATION_ROLE,registeredAt:new Date()});return {ok:true}}catch(error){if(error instanceof RegistrationUnavailableError)return {ok:false,error:"Registration is currently unavailable."};return {ok:false,error:GENERIC_REGISTRATION_ERROR}}
}
