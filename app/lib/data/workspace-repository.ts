import "server-only";

import {and,asc,desc,eq} from "drizzle-orm";
import {cache} from "react";
import {database} from "@/db/client";
import {
  activities,businessContacts,businessRelationships,businessServices,businessTags,businesses,
  campaignParticipants,campaigns,favorites,industries,journeyStages,journeys,notifications,
  opportunities,opportunityParticipants,opportunityStatusHistory,organizationMembers,
  pilotApprovals,pilotDecisions,pilotKpis,pilotMilestones,pilotParticipants,pilotRisks,pilotTasks,
  pilotUpdates,pilots,recentlyViewedItems,recommendations,regions,users,
} from "@/db/schema";
import {requireWorkspaceContext} from "@/app/lib/auth/workspace-context";
import type {
  Activity,AnalyticsSnapshot,Business,Campaign,Journey,Notification,Opportunity,Partner,Pilot,
  Recommendation,Region,Industry,Task,User,
} from "@/app/(workspace)/_lib/models";

const titleCase=(value:string)=>value.toLowerCase().replaceAll("_"," ").replace(/(^|\s)\S/g,letter=>letter.toUpperCase());
const status=(value:string)=>value.toLowerCase() as Business["status"];
const priority=(value:string)=>value.toLowerCase() as Opportunity["priority"];
const number=(value:string|null|undefined)=>Number(value??0);
const date=(value:Date|string|null|undefined)=>value?new Date(value).toISOString().slice(0,10):"";

export type WorkspaceData={
  regions:Region[];industries:Industry[];users:User[];businesses:Business[];partners:Partner[];
  opportunities:Opportunity[];campaigns:Campaign[];journeys:Journey[];recommendations:(Recommendation&{status:string})[];
  notifications:Notification[];activities:Activity[];tasks:Task[];pilots:Pilot[];analyticsSnapshots:AnalyticsSnapshot[];
  favorites:Record<"business"|"campaign"|"opportunity"|"journey",string[]>;
  recentlyViewed:{id:string;type:"business"|"campaign"|"opportunity"|"journey";title:string;href:string;viewedAt:string}[];
  unreadNotifications:number;
};

export const getWorkspaceData=cache(async():Promise<WorkspaceData>=>{
  const context=await requireWorkspaceContext();
  const organizationId=context.organization.id;
  const userId=context.user.id;
  const db=database();
  const [
    regionRows,industryRows,userRows,businessRows,contactRows,tagRows,serviceRows,relationshipRows,
    opportunityRows,opportunityParticipantRows,historyRows,campaignRows,campaignParticipantRows,
    journeyRows,journeyStageRows,recommendationRows,notificationRows,activityRows,pilotRows,
    participantRows,milestoneRows,taskRows,kpiRows,approvalRows,riskRows,updateRows,decisionRows,
    favoriteRows,recentRows,
  ]=await Promise.all([
    db.select().from(regions),db.select().from(industries),
    db.select({id:users.id,name:users.name,email:users.email,role:organizationMembers.role}).from(organizationMembers).innerJoin(users,eq(users.id,organizationMembers.userId)).where(and(eq(organizationMembers.organizationId,organizationId),eq(organizationMembers.status,"ACTIVE"))),
    db.select().from(businesses).where(eq(businesses.organizationId,organizationId)).orderBy(asc(businesses.name)),
    db.select().from(businessContacts).where(eq(businessContacts.organizationId,organizationId)),
    db.select({businessId:businessTags.businessId,tag:businessTags.tag}).from(businessTags).innerJoin(businesses,eq(businesses.id,businessTags.businessId)).where(eq(businesses.organizationId,organizationId)),
    db.select({id:businessServices.id,businessId:businessServices.businessId,kind:businessServices.kind,name:businessServices.name}).from(businessServices).innerJoin(businesses,eq(businesses.id,businessServices.businessId)).where(eq(businesses.organizationId,organizationId)),
    db.select().from(businessRelationships).where(eq(businessRelationships.organizationId,organizationId)),
    db.select().from(opportunities).where(eq(opportunities.organizationId,organizationId)).orderBy(desc(opportunities.updatedAt)),
    db.select().from(opportunityParticipants).where(eq(opportunityParticipants.organizationId,organizationId)),
    db.select().from(opportunityStatusHistory).where(eq(opportunityStatusHistory.organizationId,organizationId)).orderBy(desc(opportunityStatusHistory.occurredAt)),
    db.select().from(campaigns).where(eq(campaigns.organizationId,organizationId)).orderBy(desc(campaigns.updatedAt)),
    db.select().from(campaignParticipants).where(eq(campaignParticipants.organizationId,organizationId)),
    db.select().from(journeys).where(eq(journeys.organizationId,organizationId)).orderBy(desc(journeys.updatedAt)),
    db.select().from(journeyStages).where(eq(journeyStages.organizationId,organizationId)).orderBy(asc(journeyStages.position)),
    db.select().from(recommendations).where(eq(recommendations.organizationId,organizationId)).orderBy(desc(recommendations.updatedAt)),
    db.select().from(notifications).where(and(eq(notifications.organizationId,organizationId),eq(notifications.userId,userId))).orderBy(desc(notifications.createdAt)),
    db.select().from(activities).where(eq(activities.organizationId,organizationId)).orderBy(desc(activities.createdAt)),
    db.select().from(pilots).where(eq(pilots.organizationId,organizationId)).orderBy(desc(pilots.updatedAt)),
    db.select().from(pilotParticipants).where(eq(pilotParticipants.organizationId,organizationId)),
    db.select().from(pilotMilestones).where(eq(pilotMilestones.organizationId,organizationId)),
    db.select().from(pilotTasks).where(eq(pilotTasks.organizationId,organizationId)),
    db.select().from(pilotKpis).where(eq(pilotKpis.organizationId,organizationId)),
    db.select().from(pilotApprovals).where(eq(pilotApprovals.organizationId,organizationId)),
    db.select().from(pilotRisks).where(eq(pilotRisks.organizationId,organizationId)),
    db.select().from(pilotUpdates).where(eq(pilotUpdates.organizationId,organizationId)).orderBy(desc(pilotUpdates.createdAt)),
    db.select().from(pilotDecisions).where(eq(pilotDecisions.organizationId,organizationId)).orderBy(desc(pilotDecisions.createdAt)),
    db.select().from(favorites).where(and(eq(favorites.organizationId,organizationId),eq(favorites.userId,userId))),
    db.select().from(recentlyViewedItems).where(and(eq(recentlyViewedItems.organizationId,organizationId),eq(recentlyViewedItems.userId,userId))).orderBy(desc(recentlyViewedItems.viewedAt)).limit(8),
  ]);
  const workspaceUsers:User[]=userRows.map(row=>({id:row.id,name:row.name??row.email,email:row.email,role:titleCase(row.role),initials:(row.name??row.email).split(" ").map(part=>part[0]).join("").slice(0,2).toUpperCase(),organizationId}));
  const workspaceBusinesses:Business[]=businessRows.map(row=>({id:row.id,name:row.name,initials:row.initials,industryId:row.industryId??"",regionId:row.regionId??"",location:row.location,category:row.category,description:row.description,services:serviceRows.filter(item=>item.businessId===row.id&&item.kind==="SERVICE").map(item=>item.name),products:serviceRows.filter(item=>item.businessId===row.id&&item.kind==="PRODUCT").map(item=>item.name),status:status(row.status),verification:row.verification as Business["verification"],partnerCount:relationshipRows.filter(item=>item.fromBusinessId===row.id||item.toBusinessId===row.id).length,partnerScore:row.partnerScore,opportunityScore:row.opportunityScore,tags:tagRows.filter(item=>item.businessId===row.id).map(item=>item.tag),contacts:contactRows.filter(item=>item.businessId===row.id).map(item=>({name:item.name,role:item.role,email:item.email}))}));
  const workspaceOpportunities:Opportunity[]=opportunityRows.map(row=>({id:row.id,title:row.title,status:status(row.status),priority:priority(row.priority),businessIds:opportunityParticipantRows.filter(item=>item.opportunityId===row.id).map(item=>item.businessId),estimatedValue:number(row.modeledValue),stage:titleCase(row.stage) as Opportunity["stage"],ownerId:row.ownerId??"",createdAt:date(row.createdAt),summary:row.summary,commercialReasoning:row.commercialReasoning,compatibility:Math.min(99,Math.round(70+opportunityParticipantRows.filter(item=>item.opportunityId===row.id).length*6+row.modeledValue.length%5)),journeyImpact:row.journeyImpact,notes:[],statusHistory:historyRows.filter(item=>item.opportunityId===row.id).map(item=>({label:titleCase(item.label),date:date(item.occurredAt),detail:item.detail}))}));
  const workspaceCampaigns:Campaign[]=campaignRows.map(row=>{const businessIds=campaignParticipantRows.filter(item=>item.campaignId===row.id).map(item=>item.businessId);const progress=row.status==="COMPLETED"?100:row.status==="ACTIVE"?68:row.status==="PENDING"?42:24;return {id:row.id,title:row.title,objective:row.objective,status:status(row.status),businessIds,budget:number(row.budget),startDate:row.startDate??"",endDate:row.endDate??"",modeledValue:number(row.modeledValue),conversion:Math.round((8+businessIds.length*2.1)*10)/10,progress,milestones:[],kpis:[{label:"Participants",value:String(businessIds.length)},{label:"Progress",value:`${progress}%`}]}});
  const workspaceJourneys:Journey[]=journeyRows.map(row=>{const stages=journeyStageRows.filter(item=>item.journeyId===row.id).map(item=>({id:item.id,title:item.title,businessId:item.businessId??"",touchpoint:item.touchpoint,status:item.status.toLowerCase()==="covered"?"covered" as const:"gap" as const}));return {id:row.id,name:row.name,businessIds:[...new Set(stages.map(item=>item.businessId).filter(Boolean))],coverage:row.coverage,completion:row.completion,touchpoints:stages.length,stages}});
  const workspaceRecommendations=(recommendationRows.map(row=>({id:row.id,title:row.title,description:row.description,priority:priority(row.priority),recommendedBusinessId:row.recommendedBusinessId??undefined,opportunityId:row.opportunityId??undefined,estimatedImpact:number(row.modeledImpact),journeyImprovement:row.description,commercialRationale:row.description,confidence:row.confidence,status:row.status})));
  const workspacePilots:Pilot[]=pilotRows.map(row=>({id:row.id,name:row.name,opportunityId:row.opportunityId,campaignId:row.campaignId??undefined,journeyId:row.journeyId??undefined,regionId:businessRows[0]?.regionId??"",ownerId:row.ownerId??"",status:titleCase(row.status) as Pilot["status"],objective:row.objective,commercialRationale:row.commercialRationale,journeyImpact:row.journeyImpact,participantIds:participantRows.filter(item=>item.pilotId===row.id).map(item=>item.businessId),participants:participantRows.filter(item=>item.pilotId===row.id).map(item=>({businessId:item.businessId,role:item.role as Pilot["participants"][number]["role"],status:titleCase(item.status) as Pilot["participants"][number]["status"]})),modeledValue:number(row.modeledValue),startDate:row.startDate??"",endDate:row.endDate??"",reviewDate:row.reviewDate??"",milestones:milestoneRows.filter(item=>item.pilotId===row.id).map(item=>({id:item.id,title:item.title,ownerId:item.ownerId??"",dueDate:item.dueDate??"",status:titleCase(item.status) as Pilot["milestones"][number]["status"],dependencies:item.dependencies,completion:item.completion})),tasks:taskRows.filter(item=>item.pilotId===row.id).map(item=>({id:item.id,title:item.title,description:item.description,assigneeId:item.assigneeId??"",dueDate:item.dueDate??"",priority:priority(item.priority),status:titleCase(item.status) as Pilot["tasks"][number]["status"],milestoneId:item.milestoneId??"",businessId:item.businessId??undefined,blocked:item.blocked})),kpis:kpiRows.filter(item=>item.pilotId===row.id).map(item=>({id:item.id,name:item.name,category:item.category,baseline:number(item.baseline),target:number(item.target),current:number(item.currentModeledValue),unit:item.unit,ownerId:item.ownerId??"",status:titleCase(item.status) as Pilot["kpis"][number]["status"],frequency:item.frequency})),approvals:approvalRows.filter(item=>item.pilotId===row.id).map(item=>({id:item.id,area:item.area,approverId:item.approverId??"",role:item.role,status:titleCase(item.status) as Pilot["approvals"][number]["status"],requestedDate:item.requestedDate??undefined,decisionDate:item.decisionDate??undefined,notes:item.notes})),risks:riskRows.filter(item=>item.pilotId===row.id).map(item=>({id:item.id,title:item.title,description:item.description,category:item.category as Pilot["risks"][number]["category"],likelihood:titleCase(item.likelihood) as Pilot["risks"][number]["likelihood"],impact:titleCase(item.impact) as Pilot["risks"][number]["impact"],severity:titleCase(item.severity) as Pilot["risks"][number]["severity"],ownerId:item.ownerId??"",mitigation:item.mitigation,status:titleCase(item.status) as Pilot["risks"][number]["status"]})),updates:updateRows.filter(item=>item.pilotId===row.id).map(item=>({id:item.id,type:item.type,detail:item.detail,authorId:item.authorId??"",createdAt:date(item.createdAt)})),decisions:decisionRows.filter(item=>item.pilotId===row.id).map(item=>({id:item.id,decision:item.decision,reason:item.reason,ownerId:item.ownerId??"",date:date(item.createdAt),evidence:item.evidence,businessId:item.businessId??undefined,impact:item.impact,nextAction:item.nextAction})),outcome:row.outcome as Pilot["outcome"]||undefined}));
  const modeledValue=workspaceCampaigns.reduce((sum,item)=>sum+item.modeledValue,0);
  const analyticsSnapshots:AnalyticsSnapshot[]=[{id:`${organizationId}-current`,period:"Current workspace",modeledValue,referrals:workspaceCampaigns.length*340,conversion:workspaceCampaigns.length?Math.round(workspaceCampaigns.reduce((sum,item)=>sum+item.conversion,0)/workspaceCampaigns.length*10)/10:0,partnerGrowth:workspaceBusinesses.length,journeyCoverage:workspaceJourneys.length?Math.round(workspaceJourneys.reduce((sum,item)=>sum+item.coverage,0)/workspaceJourneys.length):0,series:Array.from({length:12},(_,index)=>Math.round(modeledValue*(0.35+index*0.055)))}];
  const favoriteState={business:[],campaign:[],opportunity:[],journey:[]} as WorkspaceData["favorites"];
  for(const item of favoriteRows)if(item.entityType in favoriteState)favoriteState[item.entityType as keyof typeof favoriteState].push(item.entityId);
  return {regions:regionRows.map(row=>({id:row.id,name:row.name,country:row.country,code:row.code})),industries:industryRows.map(row=>({id:row.id,name:row.name,category:row.category})),users:workspaceUsers,businesses:workspaceBusinesses,partners:relationshipRows.map(row=>({id:row.id,businessId:row.toBusinessId,relationship:row.relationship,status:status(row.status),since:row.since??""})),opportunities:workspaceOpportunities,campaigns:workspaceCampaigns,journeys:workspaceJourneys,recommendations:workspaceRecommendations,notifications:notificationRows.map(row=>({id:row.id,title:row.title,detail:row.detail,type:row.type as Notification["type"],read:Boolean(row.readAt),createdAt:date(row.createdAt)})),activities:activityRows.map(row=>({id:row.id,title:row.title,detail:row.detail,actorId:row.actorId??"",createdAt:date(row.createdAt),type:row.type})),tasks:taskRows.map(row=>({id:row.id,title:row.title,due:row.dueDate??"",ownerId:row.assigneeId??"",status:row.status==="COMPLETE"?"done":"open"})),pilots:workspacePilots,analyticsSnapshots,favorites:favoriteState,recentlyViewed:recentRows.map(row=>({id:row.entityId,type:row.entityType as WorkspaceData["recentlyViewed"][number]["type"],title:row.title,href:row.href,viewedAt:date(row.viewedAt)})),unreadNotifications:notificationRows.filter(row=>!row.readAt).length};
});
