import "server-only";
import {and,asc,desc,eq,inArray,isNull,or} from "drizzle-orm";
import {database} from "@/db/client";
import {businessRelationships,businesses,campaignParticipants,campaigns,collaborationActivityEvents,executiveDecisions,journeyParticipants,journeys,opportunities,opportunityParticipants,opportunityStatusHistory,organizationMembers,pilots,recommendations,users} from "@/db/schema";
import type {WorkspaceContext} from "@/app/lib/auth/types";
import {scoreOpportunity,type IntelligenceData} from "@/app/(workspace)/_lib/commercial-intelligence";
import type {Business,Campaign,Journey,Opportunity,Partner} from "@/app/(workspace)/_lib/models";
import {deriveOpportunityHealth,opportunityStageLabel} from "@/app/lib/opportunity/opportunity-policy";

type OpportunityRow=typeof opportunities.$inferSelect;
type ParticipantBusiness={id:string;name:string;initials:string;industryId:string|null;regionId:string|null;location:string;category:string;description:string;status:string;verification:string;partnerScore:number;opportunityScore:number};
type CampaignLink={id:string;title:string;objective:string;status:string;budget:string|null;modeledValue:string|null;startDate:string|null;endDate:string|null;businessId:string};
type JourneyLink={id:string;name:string;coverage:number;completion:number;businessId:string};

const number=(value:string|null|undefined)=>Number(value??0);
const lower=<T extends string>(value:string)=>value.toLowerCase() as T;

function intelligenceFor(row:OpportunityRow,participantIds:string[],businessRows:ParticipantBusiness[],campaignLinks:CampaignLink[],journeyLinks:JourneyLink[],relationshipRows:Array<{id:string;toBusinessId:string;relationship:string;status:string;since:string|null}>){
  const workspaceBusinesses:Business[]=businessRows.map(item=>({id:item.id,name:item.name,initials:item.initials,industryId:item.industryId??"",regionId:item.regionId??"",location:item.location,category:item.category,description:item.description,services:[],products:[],status:lower<Business["status"]>(item.status),verification:item.verification as Business["verification"],partnerCount:0,partnerScore:item.partnerScore,opportunityScore:item.opportunityScore,tags:[],contacts:[]}));
  const campaignGroups=[...new Set(campaignLinks.map(item=>item.id))].map(id=>{const item=campaignLinks.find(row=>row.id===id)!;return {id:item.id,title:item.title,objective:item.objective,status:lower<Campaign["status"]>(item.status),businessIds:campaignLinks.filter(row=>row.id===id).map(row=>row.businessId),budget:number(item.budget),startDate:item.startDate??"",endDate:item.endDate??"",modeledValue:number(item.modeledValue),conversion:0,progress:0,milestones:[],kpis:[]} satisfies Campaign});
  const journeyGroups=[...new Set(journeyLinks.map(item=>item.id))].map(id=>{const item=journeyLinks.find(row=>row.id===id)!;return {id:item.id,name:item.name,businessIds:journeyLinks.filter(row=>row.id===id).map(row=>row.businessId),coverage:item.coverage,completion:item.completion,touchpoints:0,stages:[]} satisfies Journey});
  const model:Opportunity={id:row.id,title:row.title,status:lower<Opportunity["status"]>(row.status),priority:lower<Opportunity["priority"]>(row.priority),businessIds:participantIds,estimatedValue:number(row.modeledValue),stage:opportunityStageLabel(row.stage) as Opportunity["stage"],ownerId:row.ownerId??"",createdAt:row.createdAt.toISOString().slice(0,10),summary:row.summary,commercialReasoning:row.commercialReasoning,compatibility:Math.min(99,Math.round(70+participantIds.length*6+row.modeledValue.length%5)),journeyImpact:row.journeyImpact,notes:[],statusHistory:[]};
  const partners:Partner[]=relationshipRows.map(item=>({id:item.id,businessId:item.toBusinessId,relationship:item.relationship,status:lower<Partner["status"]>(item.status),since:item.since??""}));
  const data:IntelligenceData={businesses:workspaceBusinesses,campaigns:campaignGroups,journeys:journeyGroups,partners,opportunities:[model]};
  return scoreOpportunity(model,data);
}

async function intelligenceRows(organizationId:string,businessIds:string[]){
  if(!businessIds.length)return {businessRows:[],campaignLinks:[],journeyLinks:[],relationshipRows:[]};
  const db=database();
  const [businessRows,campaignLinks,journeyLinks,relationshipRows]=await Promise.all([
    db.select({id:businesses.id,name:businesses.name,initials:businesses.initials,industryId:businesses.industryId,regionId:businesses.regionId,location:businesses.location,category:businesses.category,description:businesses.description,status:businesses.status,verification:businesses.verification,partnerScore:businesses.partnerScore,opportunityScore:businesses.opportunityScore}).from(businesses).where(and(eq(businesses.organizationId,organizationId),inArray(businesses.id,businessIds),isNull(businesses.deletedAt))),
    db.select({id:campaigns.id,title:campaigns.title,objective:campaigns.objective,status:campaigns.status,budget:campaigns.budget,modeledValue:campaigns.modeledValue,startDate:campaigns.startDate,endDate:campaigns.endDate,businessId:campaignParticipants.businessId}).from(campaignParticipants).innerJoin(campaigns,eq(campaigns.id,campaignParticipants.campaignId)).where(and(eq(campaignParticipants.organizationId,organizationId),inArray(campaignParticipants.businessId,businessIds))).limit(250),
    db.select({id:journeys.id,name:journeys.name,coverage:journeys.coverage,completion:journeys.completion,businessId:journeyParticipants.businessId}).from(journeyParticipants).innerJoin(journeys,eq(journeys.id,journeyParticipants.journeyId)).where(and(eq(journeyParticipants.organizationId,organizationId),inArray(journeyParticipants.businessId,businessIds))).limit(250),
    db.select({id:businessRelationships.id,toBusinessId:businessRelationships.toBusinessId,relationship:businessRelationships.relationship,status:businessRelationships.status,since:businessRelationships.since}).from(businessRelationships).where(and(eq(businessRelationships.organizationId,organizationId),or(inArray(businessRelationships.fromBusinessId,businessIds),inArray(businessRelationships.toBusinessId,businessIds)))).limit(250),
  ]);
  return {businessRows,campaignLinks,journeyLinks,relationshipRows};
}

export type OpportunitySummary={id:string;title:string;summary:string;status:string;stage:string;priority:string;modeledValue:number;owner:string|null;participants:Array<{id:string;name:string}>;recommendationSummary:string|null;recommendationConfidence:number|null;commercialHealth:"Strong"|"Developing"|"Needs attention";confidence:number;lastActivity:Date|null;updatedAt:Date};

export async function listOpportunitySummaries(context:WorkspaceContext):Promise<OpportunitySummary[]>{
  const organizationId=context.organization.id,db=database();
  const rows=await db.select({opportunity:opportunities,owner:users.name}).from(opportunities).leftJoin(users,eq(users.id,opportunities.ownerId)).where(eq(opportunities.organizationId,organizationId)).orderBy(desc(opportunities.updatedAt));
  if(!rows.length)return [];
  const ids=rows.map(item=>item.opportunity.id);
  const [participantRows,recommendationRows,activityRows]=await Promise.all([
    db.select({opportunityId:opportunityParticipants.opportunityId,id:businesses.id,name:businesses.name}).from(opportunityParticipants).innerJoin(businesses,eq(businesses.id,opportunityParticipants.businessId)).where(and(eq(opportunityParticipants.organizationId,organizationId),inArray(opportunityParticipants.opportunityId,ids),isNull(businesses.deletedAt))).orderBy(asc(businesses.name)),
    db.select({opportunityId:recommendations.opportunityId,title:recommendations.title,confidence:recommendations.confidence,updatedAt:recommendations.updatedAt}).from(recommendations).where(and(eq(recommendations.organizationId,organizationId),inArray(recommendations.opportunityId,ids))).orderBy(desc(recommendations.updatedAt)).limit(500),
    db.select({opportunityId:collaborationActivityEvents.entityId,createdAt:collaborationActivityEvents.createdAt}).from(collaborationActivityEvents).where(and(eq(collaborationActivityEvents.organizationId,organizationId),eq(collaborationActivityEvents.entityType,"opportunity"),inArray(collaborationActivityEvents.entityId,ids))).orderBy(desc(collaborationActivityEvents.createdAt)).limit(Math.min(ids.length*10,500)),
  ]);
  const businessIds=[...new Set(participantRows.map(item=>item.id))],intel=await intelligenceRows(organizationId,businessIds);
  return rows.map(({opportunity,owner})=>{const participants=participantRows.filter(item=>item.opportunityId===opportunity.id).map(({id,name})=>({id,name})),recommendation=recommendationRows.find(item=>item.opportunityId===opportunity.id),scores=intelligenceFor(opportunity,participants.map(item=>item.id),intel.businessRows.filter(item=>participants.some(participant=>participant.id===item.id)),intel.campaignLinks,intel.journeyLinks,intel.relationshipRows);return {id:opportunity.id,title:opportunity.title,summary:opportunity.summary,status:opportunity.status,stage:opportunity.stage,priority:opportunity.priority,modeledValue:number(opportunity.modeledValue),owner,participants,recommendationSummary:recommendation?.title??null,recommendationConfidence:recommendation?.confidence??null,commercialHealth:deriveOpportunityHealth({confidence:scores.confidence,stage:opportunity.stage,recommendationCount:recommendationRows.filter(item=>item.opportunityId===opportunity.id).length}),confidence:scores.confidence,lastActivity:activityRows.find(item=>item.opportunityId===opportunity.id)?.createdAt??null,updatedAt:opportunity.updatedAt}});
}

export async function getOpportunityDirectoryReferences(context:WorkspaceContext){const organizationId=context.organization.id,db=database();const [businessRows,memberRows]=await Promise.all([db.select({id:businesses.id,name:businesses.name}).from(businesses).where(and(eq(businesses.organizationId,organizationId),isNull(businesses.deletedAt))).orderBy(asc(businesses.name)),db.select({id:users.id,name:users.name,email:users.email}).from(organizationMembers).innerJoin(users,eq(users.id,organizationMembers.userId)).where(and(eq(organizationMembers.organizationId,organizationId),eq(organizationMembers.status,"ACTIVE"),isNull(users.disabledAt))).orderBy(asc(users.name))]);return {businesses:businessRows,members:memberRows.map(item=>({id:item.id,name:item.name??item.email}))}}

export async function getOpportunityDetail(context:WorkspaceContext,id:string){
  const organizationId=context.organization.id,db=database();
  const [opportunity]=await db.select({opportunity:opportunities,owner:users.name}).from(opportunities).leftJoin(users,eq(users.id,opportunities.ownerId)).where(and(eq(opportunities.id,id),eq(opportunities.organizationId,organizationId))).limit(1);if(!opportunity)return null;
  const [participants,recommendationRows,pilotRows,decisionRows,activityRows,history,references]=await Promise.all([
    db.select({id:businesses.id,name:businesses.name,initials:businesses.initials,category:businesses.category,location:businesses.location,status:businesses.status}).from(opportunityParticipants).innerJoin(businesses,eq(businesses.id,opportunityParticipants.businessId)).where(and(eq(opportunityParticipants.organizationId,organizationId),eq(opportunityParticipants.opportunityId,id),isNull(businesses.deletedAt))).orderBy(asc(businesses.name)),
    db.select().from(recommendations).where(and(eq(recommendations.organizationId,organizationId),eq(recommendations.opportunityId,id))).orderBy(desc(recommendations.updatedAt)).limit(50),
    db.select({id:pilots.id,name:pilots.name,status:pilots.status,modeledValue:pilots.modeledValue,campaignId:pilots.campaignId,journeyId:pilots.journeyId}).from(pilots).where(and(eq(pilots.organizationId,organizationId),eq(pilots.opportunityId,id))).orderBy(desc(pilots.updatedAt)).limit(50),
    db.select({id:executiveDecisions.id,title:executiveDecisions.title,status:executiveDecisions.status,priority:executiveDecisions.priority}).from(executiveDecisions).where(and(eq(executiveDecisions.organizationId,organizationId),eq(executiveDecisions.entityType,"opportunity"),eq(executiveDecisions.entityId,id),isNull(executiveDecisions.deletedAt))).orderBy(desc(executiveDecisions.updatedAt)).limit(50),
    db.select({id:collaborationActivityEvents.id,eventType:collaborationActivityEvents.eventType,summary:collaborationActivityEvents.summary,createdAt:collaborationActivityEvents.createdAt,actorName:users.name}).from(collaborationActivityEvents).leftJoin(users,eq(users.id,collaborationActivityEvents.actorId)).where(and(eq(collaborationActivityEvents.organizationId,organizationId),eq(collaborationActivityEvents.entityType,"opportunity"),eq(collaborationActivityEvents.entityId,id))).orderBy(desc(collaborationActivityEvents.createdAt)).limit(100),
    db.select().from(opportunityStatusHistory).where(and(eq(opportunityStatusHistory.organizationId,organizationId),eq(opportunityStatusHistory.opportunityId,id))).orderBy(desc(opportunityStatusHistory.occurredAt)).limit(100),
    getOpportunityDirectoryReferences(context),
  ]);
  const campaignIds=[...new Set(pilotRows.map(item=>item.campaignId).filter((value):value is string=>Boolean(value)))],journeyIds=[...new Set(pilotRows.map(item=>item.journeyId).filter((value):value is string=>Boolean(value)))];
  const [relatedCampaigns,relatedJourneys,intel]=await Promise.all([
    campaignIds.length?db.select({id:campaigns.id,title:campaigns.title,status:campaigns.status,objective:campaigns.objective}).from(campaigns).where(and(eq(campaigns.organizationId,organizationId),inArray(campaigns.id,campaignIds))).limit(50):[],
    journeyIds.length?db.select({id:journeys.id,name:journeys.name,coverage:journeys.coverage,completion:journeys.completion}).from(journeys).where(and(eq(journeys.organizationId,organizationId),inArray(journeys.id,journeyIds))).limit(50):[],
    intelligenceRows(organizationId,participants.map(item=>item.id)),
  ]);
  const scores=intelligenceFor(opportunity.opportunity,participants.map(item=>item.id),intel.businessRows,intel.campaignLinks,intel.journeyLinks,intel.relationshipRows);
  return {opportunity:{...opportunity.opportunity,owner:opportunity.owner,modeledValue:number(opportunity.opportunity.modeledValue)},participants,recommendations:recommendationRows.map(item=>({...item,modeledImpact:number(item.modeledImpact)})),pilots:pilotRows.map(item=>({...item,modeledValue:number(item.modeledValue)})),decisions:decisionRows,activity:activityRows,history,relatedCampaigns,relatedJourneys,intelligence:scores,references};
}
