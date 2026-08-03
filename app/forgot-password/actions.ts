"use server";
import {consumeAuthRateLimit} from "@/app/lib/auth/auth-rate-limit";
import {createPasswordReset} from "@/app/lib/auth/enterprise-onboarding";
import {applicationUrl,sendAuthenticationEmail} from "@/app/lib/email/delivery";
import {logServerFailure} from "@/app/lib/observability/server-log";
export type ForgotState={submitted:boolean;error?:string};
export async function requestPasswordReset(_:ForgotState,formData:FormData):Promise<ForgotState>{const email=String(formData.get("email")??"").trim().toLowerCase();if(!/^\S+@\S+\.\S+$/.test(email))return {submitted:false,error:"Enter a valid email address."};try{if(!(await consumeAuthRateLimit("password_reset_request",email,4,30))){const reset=await createPasswordReset(email);if(reset)await sendAuthenticationEmail({to:reset.email,subject:"Reset your NEFE password",heading:"Reset your password",body:"Use this secure link to choose a new password. The link expires in 60 minutes.",actionLabel:"Reset password",actionUrl:`${applicationUrl()}/reset-password?token=${encodeURIComponent(reset.token)}`})}}catch{logServerFailure({event:"password_reset.request_failed",category:"password_reset_service_failure"})}return {submitted:true}}
