"use server";
import {AuthError} from "next-auth";
import {redirect} from "next/navigation";
import {signIn} from "@/auth";
import {safeReturnTo} from "@/app/lib/auth/safe-redirect";
export async function authenticate(formData:FormData){const returnTo=safeReturnTo(String(formData.get("returnTo")??""));try{await signIn("credentials",{email:String(formData.get("email")??""),password:String(formData.get("password")??""),redirectTo:returnTo})}catch(error){if(error instanceof AuthError)redirect(`/sign-in?error=credentials&returnTo=${encodeURIComponent(returnTo)}`);throw error}}
