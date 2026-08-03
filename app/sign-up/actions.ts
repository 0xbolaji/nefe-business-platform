"use server";
import {redirect} from "next/navigation";
import {z} from "zod";
import {consumeAuthRateLimit} from "@/app/lib/auth/auth-rate-limit";
import {OnboardingSecurityError,registerFromInvitation} from "@/app/lib/auth/enterprise-onboarding";
import {applicationUrl,sendAuthenticationEmail} from "@/app/lib/email/delivery";
import {logServerFailure} from "@/app/lib/observability/server-log";

export type RegistrationState={ok:false;error:string;fieldErrors?:Record<string,string>};
const schema=z.object({fullName:z.string().trim().min(2,"Enter your full name.").max(100),email:z.string().trim().toLowerCase().email("Enter a valid email address."),password:z.string().min(12,"Use at least 12 characters.").max(128),confirmPassword:z.string(),invitationToken:z.string().min(20,"Open the secure invitation link sent to you."),termsAccepted:z.literal("on",{error:"You must acknowledge the terms."})}).superRefine((value,ctx)=>{if(value.password!==value.confirmPassword)ctx.addIssue({code:"custom",path:["confirmPassword"],message:"Passwords do not match."})});
export async function registerInternalUser(_:RegistrationState,formData:FormData):Promise<RegistrationState>{
  const parsed=schema.safeParse(Object.fromEntries(formData));if(!parsed.success){const errors:Record<string,string>={};for(const issue of parsed.error.issues)errors[String(issue.path[0])]=issue.message;return {ok:false,error:"Review the highlighted fields.",fieldErrors:errors}}
  if(await consumeAuthRateLimit("registration",parsed.data.email))return {ok:false,error:"Too many attempts. Wait a few minutes and try again."};
  try{const result=await registerFromInvitation({token:parsed.data.invitationToken,name:parsed.data.fullName,email:parsed.data.email,password:parsed.data.password});await sendAuthenticationEmail({to:result.user.email,subject:"Verify your NEFE account",heading:"Verify your email address",body:"Confirm your email address to activate your workspace access. This link expires in 24 hours.",actionLabel:"Verify email",actionUrl:`${applicationUrl()}/verify-email?token=${encodeURIComponent(result.verificationToken)}`});}
  catch(error){logServerFailure({event:"registration.failed",category:error instanceof OnboardingSecurityError?`registration_${error.code.toLowerCase()}`:"registration_service_failure"});return {ok:false,error:"Registration could not be completed. Check your details and invitation and try again."}}
  redirect("/sign-in?verification=sent");
}
