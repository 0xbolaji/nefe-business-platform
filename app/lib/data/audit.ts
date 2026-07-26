import "server-only";
import {desc,eq} from "drizzle-orm";
import {database} from "@/db/client";
import {auditLogs} from "@/db/schema";
export type AuditInput={organizationId:string;actorId:string;action:string;entityType:string;entityId:string;metadata?:Record<string,unknown>};
export async function appendAuditLog(input:AuditInput){await database().insert(auditLogs).values({...input,metadata:sanitizeMetadata(input.metadata??{})})}
export async function listAuditLogs(organizationId:string,limit=100){return database().select().from(auditLogs).where(eq(auditLogs.organizationId,organizationId)).orderBy(desc(auditLogs.createdAt)).limit(Math.min(limit,100))}
function sanitizeMetadata(value:Record<string,unknown>){const blocked=/password|secret|token|cookie|authorization/i;return Object.fromEntries(Object.entries(value).filter(([key])=>!blocked.test(key)).map(([key,item])=>[key,typeof item==="string"?item.slice(0,500):item]))}
