import type { Business, Campaign, Journey, Opportunity, OpportunityStage, Partner, Priority } from "./models";
export type IntelligenceData={businesses:Business[];campaigns:Campaign[];journeys:Journey[];partners:Partner[];opportunities:Opportunity[]};
const emptyData:IntelligenceData={businesses:[],campaigns:[],journeys:[],partners:[],opportunities:[]};

export type ScoreSet = { compatibility: number; journeyCoverage: number; commercialOpportunity: number; partnershipReadiness: number; confidence: number };
export type ExplainableScore = ScoreSet & { positiveFactors: string[]; limitingFactors: string[]; reasoning: string };
export type GapCategory = "Transport" | "Dining" | "Entertainment" | "Retail" | "Wellness" | "Tourism" | "Hospitality";
export type EcosystemGap = { category: GapCategory; present: boolean; impact: string; priority: Priority };
export type BusinessHealth = { label: string; score: number; strengths: string[]; improvements: string[] };

const stageWeight:Record<OpportunityStage,number>={Identified:45,Qualified:58,Negotiating:68,Approved:78,Pilot:88,Active:94,Completed:96};
const categoryMap:Record<string,GapCategory>={mobility:"Transport",dining:"Dining",hospitality:"Hospitality",retail:"Retail",wellness:"Wellness",development:"Tourism"};
const complementaryPairs=new Set(["development:hospitality","development:mobility","development:dining","development:retail","development:wellness","hospitality:mobility","dining:hospitality","hospitality:wellness","hospitality:retail","dining:mobility","dining:wellness"]);
const clamp=(value:number)=>Math.max(0,Math.min(100,Math.round(value)));
const pairKey=(a:string,b:string)=>[a,b].sort().join(":");
const unique=<T,>(items:T[])=>Array.from(new Set(items));

export function scoreBusinessPair(a:Business,b:Business,data:IntelligenceData=emptyData):ExplainableScore{
  const {partners,campaigns,journeys}=data;
  const sameRegion=a.regionId===b.regionId;
  const complement=complementaryPairs.has(pairKey(a.industryId,b.industryId));
  const verified=a.verification==="Verified"&&b.verification==="Verified";
  const related=partners.some(item=>item.businessId===a.id||item.businessId===b.id);
  const sharedCampaigns=campaigns.filter(item=>item.businessIds.includes(a.id)&&item.businessIds.includes(b.id)).length;
  const sharedJourneys=journeys.filter(item=>item.businessIds.includes(a.id)&&item.businessIds.includes(b.id));
  const compatibility=clamp(48+(complement?24:8)+(sameRegion?14:2)+(verified?9:3)+(related?5:0));
  const journeyCoverage=clamp(sharedJourneys.length?sharedJourneys.reduce((sum,item)=>sum+item.coverage,0)/sharedJourneys.length:35+(complement?24:8));
  const commercialOpportunity=clamp((a.opportunityScore+b.opportunityScore)/2+(complement?5:-3)+(sharedCampaigns?4:0));
  const partnershipReadiness=clamp((a.partnerScore+b.partnerScore)/2+(verified?5:-7)+(related?3:0));
  const confidence=clamp(compatibility*.28+journeyCoverage*.2+commercialOpportunity*.3+partnershipReadiness*.22);
  const positiveFactors=[complement&&"Complementary industries expand the customer journey",sameRegion&&"Shared RAK operating region reduces coordination friction",verified&&"Both businesses have verified participation",sharedCampaigns>0&&"Existing campaign participation provides operating evidence",related&&"A relationship signal already exists"].filter(Boolean) as string[];
  const limitingFactors=[!complement&&"Industry overlap offers limited journey expansion",!verified&&"Verification must be completed before activation",sharedJourneys.length===0&&"No shared journey has been validated",sharedCampaigns===0&&"No joint campaign evidence exists yet"].filter(Boolean) as string[];
  return {compatibility,journeyCoverage,commercialOpportunity,partnershipReadiness,confidence,positiveFactors,limitingFactors,reasoning:`${a.name} and ${b.name} score strongest where their services connect adjacent customer moments. The recommendation remains subject to verification, ownership and pilot evidence.`};
}

export function analyzeEcosystem(businessIds:string[],data:IntelligenceData=emptyData):{scores:ScoreSet;gaps:EcosystemGap[];diversity:number;categories:string[]}{
  const {businesses,campaigns,journeys}=data;const getBusiness=(id:string)=>businesses.find(item=>item.id===id);
  const selected=businessIds.map(getBusiness).filter((item):item is Business=>Boolean(item));
  const categories=unique(selected.map(item=>categoryMap[item.industryId]).filter(Boolean));
  const verifiedRatio=selected.length?selected.filter(item=>item.verification==="Verified").length/selected.length:0;
  const activeCampaigns=campaigns.filter(item=>item.businessIds.some(id=>businessIds.includes(id))).length;
  const relevantJourneys=journeys.filter(item=>item.businessIds.some(id=>businessIds.includes(id)));
  const journeyCoverage=relevantJourneys.length?relevantJourneys.reduce((sum,item)=>sum+item.coverage,0)/relevantJourneys.length:0;
  const diversity=clamp(categories.length/7*100);
  const averageOpportunity=selected.length?selected.reduce((sum,item)=>sum+item.opportunityScore,0)/selected.length:0;
  const compatibility=clamp(selected.length*8+diversity*.45+verifiedRatio*30);
  const commercialOpportunity=clamp(averageOpportunity*.65+diversity*.2+activeCampaigns*4);
  const partnershipReadiness=clamp(verifiedRatio*55+(selected.length>=4?24:selected.length*5)+activeCampaigns*5);
  const confidence=clamp(compatibility*.25+journeyCoverage*.2+commercialOpportunity*.32+partnershipReadiness*.23);
  const allCategories:GapCategory[]=["Transport","Dining","Entertainment","Retail","Wellness","Tourism","Hospitality"];
  const impact:Record<GapCategory,string>={Transport:"Limits arrival, transfer and destination movement coverage.",Dining:"Reduces evening dwell time and cross-sell potential.",Entertainment:"Leaves leisure time outside the connected journey.",Retail:"Removes accessible redemption and destination-shopping moments.",Wellness:"Limits recovery, retention and repeat-visit pathways.",Tourism:"Weakens destination discovery and coordinated itinerary value.",Hospitality:"Removes the anchor stay and guest-service context."};
  const gaps=allCategories.map(category=>({category,present:categories.includes(category),impact:categories.includes(category)?`${category} coverage is represented in the selected ecosystem.`:impact[category],priority:(["Transport","Hospitality","Dining"].includes(category)?"high":["Wellness","Tourism"].includes(category)?"medium":"low") as Priority}));
  return {scores:{compatibility,journeyCoverage:clamp(journeyCoverage),commercialOpportunity,partnershipReadiness,confidence},gaps,diversity,categories};
}

export function scoreOpportunity(opportunity:Opportunity,data:IntelligenceData=emptyData):ExplainableScore{
  const ecosystem=analyzeEcosystem(opportunity.businessIds,data);
  const getBusiness=(id:string)=>data.businesses.find(item=>item.id===id);
  const stage=stageWeight[opportunity.stage];
  const verified=opportunity.businessIds.map(getBusiness).filter((item):item is Business=>Boolean(item)).filter(item=>item.verification==="Verified").length;
  const partnershipReadiness=clamp(ecosystem.scores.partnershipReadiness*.7+stage*.3);
  const commercialOpportunity=clamp(ecosystem.scores.commercialOpportunity*.6+Math.min(100,opportunity.estimatedValue/12000)*.25+stage*.15);
  const confidence=clamp(opportunity.compatibility*.24+ecosystem.scores.journeyCoverage*.2+commercialOpportunity*.3+partnershipReadiness*.26);
  const positiveFactors=[ecosystem.diversity>=40&&"Partner diversity supports multiple customer moments",verified>=Math.ceil(opportunity.businessIds.length/2)&&"Most participants are verified",stage>=78&&"Opportunity has progressed beyond initial qualification",opportunity.estimatedValue>=400000&&"Modeled commercial value is material"].filter(Boolean) as string[];
  const limitingFactors=[ecosystem.gaps.some(item=>!item.present&&item.priority==="high")&&"A high-priority journey category remains missing",verified<opportunity.businessIds.length&&"Some participants still require verification",stage<78&&"Commercial alignment is not yet approved"].filter(Boolean) as string[];
  return {...ecosystem.scores,commercialOpportunity,partnershipReadiness,confidence,positiveFactors,limitingFactors,reasoning:opportunity.commercialReasoning};
}

export function getBusinessHealth(business:Business,data:IntelligenceData=emptyData):BusinessHealth{
  const {campaigns,journeys}=data;const getBusiness=(id:string)=>data.businesses.find(item=>item.id===id);
  const businessCampaigns=campaigns.filter(item=>item.businessIds.includes(business.id));
  const businessJourneys=journeys.filter(item=>item.businessIds.includes(business.id));
  const coverage=businessJourneys.length?businessJourneys.reduce((sum,item)=>sum+item.coverage,0)/businessJourneys.length:0;
  const score=clamp(business.partnerScore*.35+business.opportunityScore*.35+coverage*.2+Math.min(10,businessCampaigns.length*5));
  const strengths=[business.partnerScore>=90&&"Strong ecosystem fit",businessCampaigns.length>=1&&"Active campaign participation",coverage>=80&&"High journey coverage",business.verification==="Verified"&&"Verified for governed collaboration"].filter(Boolean) as string[];
  const improvements=[!businessJourneys.some(item=>item.businessIds.some(id=>getBusiness(id)?.industryId==="mobility"))&&"Needs more mobility coverage",coverage<80&&"Limited journey coverage",business.regionId==="rak"&&"Regional diversity remains limited",businessCampaigns.length===0&&"No campaign participation evidence"].filter(Boolean) as string[];
  return {label:score>=88?"Strong ecosystem fit":score>=72?"Commercially promising":"Needs collaboration development",score,strengths,improvements};
}

export function prioritizeRecommendation(confidence:number,estimatedImpact:number,hasHighGap:boolean):{priority:"High Priority"|"Medium Priority"|"Future Opportunity";reason:string}{
  if(confidence>=88&&(estimatedImpact>=180000||hasHighGap))return {priority:"High Priority",reason:"High confidence with material modeled impact or a critical journey gap."};
  if(confidence>=75)return {priority:"Medium Priority",reason:"Credible commercial fit that still requires validation or participant readiness."};
  return {priority:"Future Opportunity",reason:"Potential value exists, but confidence or current operating evidence is limited."};
}

export function compareOpportunities(items:Opportunity[],data:IntelligenceData=emptyData){return items.map(item=>{const scores=scoreOpportunity(item,data);const categories=unique(item.businessIds.map(id=>data.businesses.find(business=>business.id===id)?.industryId).filter(Boolean));return {id:item.id,title:item.title,estimatedValue:item.estimatedValue,partnerDiversity:categories.length,journeyContribution:item.journeyImpact,...scores}})}

export function getExecutiveIntelligence(data:IntelligenceData){return {topOpportunities:[...data.opportunities].sort((a,b)=>scoreOpportunity(b,data).confidence-scoreOpportunity(a,data).confidence).slice(0,3),highestValue:[...data.opportunities].sort((a,b)=>b.estimatedValue-a.estimatedValue).slice(0,3),businessesNeedingAttention:data.businesses.filter(item=>getBusinessHealth(item,data).score<82),ecosystem:analyzeEcosystem(data.businesses.map(item=>item.id),data)}}
