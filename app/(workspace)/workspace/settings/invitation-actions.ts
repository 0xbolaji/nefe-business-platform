"use server";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {requireWorkspaceContext} from "@/app/lib/auth/workspace-context";
import {createManagedInvitation,INVITATION_ROLES,OnboardingSecurityError,revokeManagedInvitation} from "@/app/lib/auth/enterprise-onboarding";
import type {AppRole} from "@/app/lib/auth/types";
import {applicationUrl,sendAuthenticationEmail} from "@/app/lib/email/delivery";
export type InviteState={ok:boolean;error:string};
const schema=z.object({email:z.string().trim().toLowerCase().email(),role:z.enum(INVITATION_ROLES as [AppRole,...AppRole[]]),expiresInDays:z.coerce.number().int().min(1).max(30)});
export async function createInvitationAction(_:InviteState,formData:FormData):Promise<InviteState>{const parsed=schema.safeParse(Object.fromEntries(formData));if(!parsed.success)return {ok:false,error:"Enter a valid email, role, and expiry."};const context=await requireWorkspaceContext();let invitationId:string|undefined;try{const created=await createManagedInvitation(context,parsed.data);invitationId=created.invitation.id;await sendAuthenticationEmail({to:created.invitation.email,subject:`You are invited to ${context.organization.workspaceName}`,heading:"Join your NEFE workspace",body:`${context.user.name} invited you to join ${context.organization.workspaceName} as ${created.invitation.role.toLowerCase()}. This invitation expires ${created.invitation.expiresAt?.toLocaleDateString()}.`,actionLabel:"Accept invitation",actionUrl:`${applicationUrl()}/sign-up?token=${encodeURIComponent(created.token)}`});revalidatePath("/workspace/settings");return {ok:true,error:""}}catch(error){if(invitationId)await revokeManagedInvitation(context,invitationId).catch(()=>undefined);return {ok:false,error:error instanceof OnboardingSecurityError&&error.code==="CONFLICT"?"That person is already a member or has a pending invitation.":"The invitation could not be created or delivered."}}}
export async function revokeInvitationAction(formData:FormData){const context=await requireWorkspaceContext();await revokeManagedInvitation(context,String(formData.get("invitationId")??""));revalidatePath("/workspace/settings")}
