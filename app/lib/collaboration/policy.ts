import {collaborationEntityTypes,type CollaborationEntityType} from "./domain-events";
export type MentionCandidate={id:string;email:string;organizationId:string;status:"ACTIVE"|"INVITED"|"DISABLED"};
export function isSupportedEntity(value:string):value is CollaborationEntityType{return (collaborationEntityTypes as readonly string[]).includes(value)}
export function canChangeComment(actor:{id:string;role:string},authorId:string){return actor.id===authorId||actor.role==="OWNER"||actor.role==="ADMINISTRATOR"}
export function resolveMentionCandidates(emails:string[],members:MentionCandidate[],organizationId:string,actorId:string){const wanted=new Set(emails.map(item=>item.toLowerCase()));return members.filter(item=>item.organizationId===organizationId&&item.status==="ACTIVE"&&item.id!==actorId&&wanted.has(item.email.toLowerCase()))}
export function uniqueNotificationRecipients(mentioned:string[],watchers:string[],actorId:string){return [...new Set([...mentioned,...watchers])].filter(id=>id!==actorId)}
export function pageWindow(page:number,limit:number,max=50){const size=Math.min(Math.max(limit,1),max);return {limit:size,offset:(Math.max(page,1)-1)*size}}
