"use server";
import {redirect} from "next/navigation";
import {auth,signOut} from "@/auth";
import {changePassword,OnboardingSecurityError} from "@/app/lib/auth/enterprise-onboarding";
import {requireWorkspaceContext} from "@/app/lib/auth/workspace-context";
import {revokeAuthenticationSession,revokeCurrentAuthenticationSession,revokeOtherAuthenticationSessions} from "@/app/lib/auth/session-registry";
import {invalidateAllUserSessions} from "@/app/lib/auth/account-security";
export type PasswordState={ok:boolean;error:string};
export async function changePasswordAction(_:PasswordState,formData:FormData):Promise<PasswordState>{const currentPassword=String(formData.get("currentPassword")??""),newPassword=String(formData.get("newPassword")??""),confirmPassword=String(formData.get("confirmPassword")??"");if(newPassword!==confirmPassword)return {ok:false,error:"New passwords do not match."};if(newPassword.length<12||newPassword.length>128)return {ok:false,error:"Use 12–128 characters for the new password."};try{const context=await requireWorkspaceContext(),session=await auth();await changePassword(context,{currentPassword,newPassword,currentSessionId:session?.authSessionId});return {ok:true,error:""}}catch(error){return {ok:false,error:error instanceof OnboardingSecurityError?"The current password was not accepted.":"Password could not be changed."}}}
export async function revokeSessionAction(formData:FormData){const context=await requireWorkspaceContext(),session=await auth();if(!session?.authSessionId)redirect("/sign-in");await revokeAuthenticationSession(context,String(formData.get("sessionId")??""),session.authSessionId);redirect("/workspace/settings/security/sessions")}
export async function revokeOtherSessionsAction(){const context=await requireWorkspaceContext(),session=await auth();if(!session?.authSessionId)redirect("/sign-in");await revokeOtherAuthenticationSessions(context,session.authSessionId);redirect("/workspace/settings/security/sessions")}
export async function signOutCurrentSessionAction(){const context=await requireWorkspaceContext(),session=await auth();if(session?.authSessionId)await revokeCurrentAuthenticationSession(context,session.authSessionId);await signOut({redirectTo:"/sign-in"})}
export async function signOutAllSessionsAction(){const context=await requireWorkspaceContext();await invalidateAllUserSessions(context);await signOut({redirectTo:"/sign-in"})}
