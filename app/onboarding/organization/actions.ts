"use server";
import {redirect} from "next/navigation";
import {z} from "zod";
import {auth} from "@/auth";
import {database} from "@/db/client";
import {organizationMembers,organizations} from "@/db/schema";
import {appendAuditLog} from "@/app/lib/data/audit";
const input=z.object({name:z.string().trim().min(2).max(120),workspaceName:z.string().trim().min(2).max(120),regionId:z.string().uuid(),industryId:z.string().uuid()});
export async function createOrganization(formData:FormData){const session=await auth();if(!session?.user?.id)redirect("/sign-in?returnTo=/onboarding/organization");if(process.env.NODE_ENV!=="production"&&process.env.NEFE_DEMO_AUTH_ENABLED==="true"&&!process.env.DATABASE_URL)redirect("/workspace/dashboard");const parsed=input.safeParse({name:formData.get("name"),workspaceName:formData.get("workspaceName"),regionId:formData.get("regionId"),industryId:formData.get("industryId")});if(!parsed.success)redirect("/onboarding/organization?error=validation");const db=database();const slug=`${parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}-${crypto.randomUUID().slice(0,8)}`;const [organization]=await db.insert(organizations).values({name:parsed.data.name,workspaceName:parsed.data.workspaceName,slug,regionId:parsed.data.regionId,primaryIndustryId:parsed.data.industryId}).returning({id:organizations.id});await db.insert(organizationMembers).values({organizationId:organization.id,userId:session.user.id,role:"OWNER",status:"ACTIVE"});await appendAuditLog({organizationId:organization.id,actorId:session.user.id,action:"organization.created",entityType:"organization",entityId:organization.id,metadata:{workspaceName:parsed.data.workspaceName}});redirect("/workspace/dashboard")}
