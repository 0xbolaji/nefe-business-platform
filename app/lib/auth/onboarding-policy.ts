import type {AppRole} from "./types";
export type InvitationState={status:string;email:string;organizationId:string;expiresAt:Date|null;revokedAt:Date|null};
export function invitationCanBeAccepted(invitation:InvitationState|undefined,email:string,now=new Date()){return Boolean(invitation&&invitation.status==="PENDING"&&!invitation.revokedAt&&invitation.expiresAt&&invitation.expiresAt>now&&invitation.email.trim().toLowerCase()===email.trim().toLowerCase())}
export function invitationRoleAllowed(actorRole:AppRole,invitedRole:AppRole){if(actorRole!=="OWNER"&&actorRole!=="ADMINISTRATOR")return false;if(invitedRole==="OWNER")return false;return true}
export function passwordMeetsPolicy(password:string){return password.length>=12&&password.length<=128}
