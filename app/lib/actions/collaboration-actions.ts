"use server";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {requireWorkspaceContext} from "@/app/lib/auth/workspace-context";
import {requirePermission} from "@/app/lib/auth/permissions";
import {collaborationEntityTypes} from "@/app/lib/collaboration/domain-events";
import {collaborationRepository} from "@/app/lib/data/collaboration-repository";

export type CollaborationMutationResult={ok:true}|{ok:false;error:string};
const entity=z.object({entityType:z.enum(collaborationEntityTypes),entityId:z.string().uuid()});
const safe=async(operation:()=>Promise<void>):Promise<CollaborationMutationResult>=>{try{await operation();return {ok:true}}catch(error){if(error instanceof z.ZodError)return {ok:false,error:"Review the submitted values."};if(error instanceof Error&&error.name==="AuthorizationError")return {ok:false,error:error.message};return {ok:false,error:"The collaboration change could not be saved."}}};
async function authorizedRepository(){const context=await requireWorkspaceContext();requirePermission(context.membership.role,"collaboration.write");return collaborationRepository(context)}
const refresh=()=>revalidatePath("/workspace");

export async function addComment(input:unknown){return safe(async()=>{const data=entity.extend({body:z.string().trim().min(1).max(5000)}).parse(input);await (await authorizedRepository()).comments.create(data);refresh()})}
export async function editComment(input:unknown){return safe(async()=>{const data=z.object({commentId:z.string().uuid(),body:z.string().trim().min(1).max(5000)}).parse(input);await (await authorizedRepository()).comments.edit(data.commentId,data.body);refresh()})}
export async function deleteComment(input:unknown){return safe(async()=>{const data=z.object({commentId:z.string().uuid()}).parse(input);await (await authorizedRepository()).comments.delete(data.commentId);refresh()})}
export async function assignTeammate(input:unknown){return safe(async()=>{const data=entity.extend({assigneeId:z.string().uuid()}).parse(input);await (await authorizedRepository()).assignments.assign(data);refresh()})}
export async function removeAssignment(input:unknown){return safe(async()=>{const data=entity.parse(input);await (await authorizedRepository()).assignments.remove(data);refresh()})}
export async function followEntity(input:unknown){return safe(async()=>{const data=entity.parse(input);await (await authorizedRepository()).watchers.follow(data);refresh()})}
export async function unfollowEntity(input:unknown){return safe(async()=>{const data=entity.parse(input);await (await authorizedRepository()).watchers.unfollow(data);refresh()})}
export async function markMentionRead(input:unknown){return safe(async()=>{const data=z.object({mentionId:z.string().uuid()}).parse(input);await (await authorizedRepository()).mentions.markRead(data.mentionId);refresh()})}
export async function resolveMentionUsers(input:unknown){const data=z.object({query:z.string().trim().max(120).default("")}).safeParse(input);if(!data.success)return {ok:false as const,error:"Review the search value."};const context=await requireWorkspaceContext();const users=await collaborationRepository(context).mentions.resolveUsers(data.data.query);return {ok:true as const,users}}
export async function listUnreadMentions(){const context=await requireWorkspaceContext();const mentions=await collaborationRepository(context).mentions.unread();return {ok:true as const,mentions:mentions.map(item=>({...item,createdAt:item.createdAt.toISOString()}))}}
export async function loadEntityComments(input:unknown){const data=entity.extend({page:z.number().int().positive().default(1)}).safeParse(input);if(!data.success)return {ok:false as const,error:"Review the activity request."};const context=await requireWorkspaceContext();const comments=await collaborationRepository(context).comments.list(data.data,data.data.page);return {ok:true as const,comments:comments.map(item=>({...item,createdAt:item.createdAt.toISOString(),editedAt:item.editedAt?.toISOString()??null}))}}
export async function loadEntityActivity(input:unknown){const data=entity.extend({page:z.number().int().positive().default(1)}).safeParse(input);if(!data.success)return {ok:false as const,error:"Review the activity request."};const context=await requireWorkspaceContext();const activity=await collaborationRepository(context).activity.byEntity(data.data,data.data.page);return {ok:true as const,activity:activity.map(item=>({...item,createdAt:item.createdAt.toISOString()}))}}
export async function loadWorkspaceActivity(input:unknown){const data=z.object({page:z.number().int().positive().default(1)}).safeParse(input);if(!data.success)return {ok:false as const,error:"Review the activity request."};const context=await requireWorkspaceContext();const activity=await collaborationRepository(context).activity.workspaceFeed(data.data.page);return {ok:true as const,activity:activity.map(item=>({...item,createdAt:item.createdAt.toISOString()}))}}
