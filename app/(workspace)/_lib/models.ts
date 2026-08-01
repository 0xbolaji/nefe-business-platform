export type EntityStatus = "active" | "pending" | "paused" | "draft" | "completed";
export type Priority = "high" | "medium" | "low";

export interface Region { id: string; name: string; country: string; code: string }
export interface Industry { id: string; name: string; category: string }
export interface Organization { id: string; name: string; regionId: string; plan: "Pilot" | "Enterprise"; status: EntityStatus }
export interface User { id: string; name: string; email: string; role: string; initials: string; organizationId: string }
export interface Partner { id: string; businessId: string; relationship: string; status: EntityStatus; since: string }
export interface Contact { name: string; role: string; email: string }
export interface Business { id: string; name: string; initials: string; industryId: string; regionId: string; location: string; category: string; description: string; services: string[]; products: string[]; status: EntityStatus; verification: "Verified" | "In review" | "Invited"; partnerCount: number; partnerScore: number; opportunityScore: number; tags: string[]; contacts: Contact[] }
export type OpportunityStage = "Identified" | "Qualified" | "Negotiating" | "Approved" | "Pilot" | "Active" | "Completed";
export interface StatusHistory { label: string; date: string; detail: string }
export interface Opportunity { id: string; title: string; status: EntityStatus; priority: Priority; businessIds: string[]; estimatedValue: number; stage: OpportunityStage; ownerId: string; createdAt: string; summary: string; commercialReasoning: string; compatibility: number; journeyImpact: string; notes: string[]; statusHistory: StatusHistory[] }
export interface CampaignMilestone { title: string; date: string; status: "complete" | "current" | "upcoming" }
export interface Campaign { id: string; title: string; objective: string; status: EntityStatus; businessIds: string[]; budget: number; startDate: string; endDate: string; modeledValue: number; conversion: number; progress: number; milestones: CampaignMilestone[]; kpis: { label: string; value: string }[] }
export interface JourneyStage { id: string; title: string; businessId: string; touchpoint: string; status: "covered" | "gap" }
export interface Journey { id: string; name: string; businessIds: string[]; coverage: number; completion: number; touchpoints: number; stages: JourneyStage[] }
export interface AnalyticsSnapshot { id: string; period: string; modeledValue: number; referrals: number; conversion: number; partnerGrowth: number; journeyCoverage: number; series: number[] }
export interface Invitation { id: string; email: string; role: string; status: "accepted" | "pending"; sentAt: string }
export interface Recommendation { id: string; title: string; description: string; priority: Priority; recommendedBusinessId?: string; opportunityId?: string; estimatedImpact: number; journeyImprovement: string; commercialRationale: string; confidence: number }
export interface Notification { id: string; title: string; detail: string; type: "partner" | "opportunity" | "campaign" | "journey" | "pilot"; read: boolean; createdAt: string; href?:string }
export interface Activity { id: string; title: string; detail: string; actorId: string; createdAt: string; type: string }
export interface Task { id: string; title: string; due: string; ownerId: string; status: "open" | "done" }
export interface Decision { id: string; action: string; detail: string; createdAt: string; type: "recommendation" | "partner" | "opportunity" | "priority" | "pilot" }
export type PilotStatus = "Draft" | "Planning" | "Awaiting Approval" | "Approved" | "Ready to Launch" | "Active" | "Paused" | "Review" | "Completed" | "Cancelled";
export type PilotReadiness = "Not Ready" | "Needs Attention" | "Nearly Ready" | "Ready to Launch" | "Active";
export type PilotOutcome = "Scale" | "Continue" | "Revise" | "Pause" | "Close";
export interface PilotParticipant { businessId:string; role:"Anchor Partner"|"Mobility Partner"|"Hospitality Partner"|"Dining Partner"|"Experience Partner"|"Retail Partner"|"Wellness Partner"|"Measurement Partner"; status:"Pending"|"Confirmed"|"Declined" }
export interface PilotTask { id:string; title:string; description:string; assigneeId:string; dueDate:string; priority:Priority; status:"Not Started"|"In Progress"|"Blocked"|"Complete"; milestoneId:string; businessId?:string; blocked:boolean }
export interface PilotMilestone { id:string; title:string; ownerId:string; dueDate:string; status:"Not Started"|"In Progress"|"Blocked"|"Complete"; dependencies:string[]; completion:number }
export interface PilotKPI { id:string; name:string; category:string; baseline:number; target:number; current:number; unit:string; ownerId:string; status:"On Track"|"At Risk"|"Achieved"; frequency:string }
export interface PilotApproval { id:string; area:string; approverId:string; role:string; status:"Not Requested"|"Pending"|"Approved"|"Changes Requested"|"Declined"; requestedDate?:string; decisionDate?:string; notes:string }
export interface PilotRisk { id:string; title:string; description:string; category:"Commercial"|"Operational"|"Partner"|"Financial"|"Legal"|"Data"|"Customer Experience"|"Timeline"; likelihood:"Low"|"Medium"|"High"; impact:"Low"|"Medium"|"High"; severity:"Low"|"Medium"|"High"; ownerId:string; mitigation:string; status:"Open"|"Mitigating"|"Accepted"|"Closed" }
export interface PilotUpdate { id:string; type:string; detail:string; authorId:string; createdAt:string }
export interface PilotDecision { id:string; decision:string; reason:string; ownerId:string; date:string; evidence:string; businessId?:string; impact:string; nextAction:string }
export interface Pilot { id:string; name:string; opportunityId:string; campaignId?:string; journeyId?:string; recommendationId?:string; regionId:string; ownerId:string; status:PilotStatus; objective:string; commercialRationale:string; journeyImpact:string; participantIds:string[]; participants:PilotParticipant[]; modeledValue:number; startDate:string; endDate:string; reviewDate:string; milestones:PilotMilestone[]; tasks:PilotTask[]; kpis:PilotKPI[]; approvals:PilotApproval[]; risks:PilotRisk[]; updates:PilotUpdate[]; decisions:PilotDecision[]; outcome?:PilotOutcome }
