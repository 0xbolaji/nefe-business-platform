"use client";

import Link from "next/link";
import { prioritizeRecommendation, scoreBusinessPair } from "../../_lib/commercial-intelligence";
import {formatAed} from "../../_lib/format";
import { useCollaboration } from "./collaboration-state";
import { AppCard, ProgressBar, SectionHeader, StatusBadge } from "./ui";

const groupOrder=["High Priority","Medium Priority","Future Opportunity"] as const;

export default function RecommendationPanel({opportunityId,limit}:{opportunityId?:string;limit?:number}){
  const {recommendationStates,setRecommendationState,data}=useCollaboration();
  const {businesses,recommendations}=data;const getBusiness=(id:string)=>businesses.find(item=>item.id===id);const anchor=businesses[0];
  const items=recommendations.filter(item=>!opportunityId||item.opportunityId===opportunityId).slice(0,limit).map(item=>{
    const recommended=item.recommendedBusinessId?getBusiness(item.recommendedBusinessId):undefined;
    const explanation=recommended&&anchor?scoreBusinessPair(anchor,recommended,data):null;
    const priority=prioritizeRecommendation(item.confidence,item.estimatedImpact,Boolean(explanation?.limitingFactors.some(factor=>factor.includes("journey"))));
    return {item,recommended,explanation,priority};
  });
  return <AppCard><SectionHeader title="Recommendations" description="Explainable next actions derived from the current collaboration model."/><div className="ws-recommendation-groups">{groupOrder.map(group=>{const grouped=items.filter(entry=>entry.priority.priority===group);return <section key={group}><h3>{group}</h3>{grouped.length?<div className="ws-recommendations">{grouped.map(({item,recommended,explanation,priority})=>{const state=recommendationStates[item.id];return <article key={item.id} className={state==="dismissed"?"dismissed":""}><div className="ws-recommendation-head"><div><StatusBadge tone={item.priority}>{priority.priority}</StatusBadge><h3>{item.title}</h3><small>{priority.reason}</small></div><strong>{item.confidence}%</strong></div><p>{item.description}</p>{recommended&&<Link href={`/workspace/businesses/${recommended.id}`} className="ws-rec-partner"><span className="ws-avatar">{recommended.initials}</span><div><small>Recommended partner</small><strong>{recommended.name}</strong></div></Link>}<div className="ws-detail-grid"><span className="ws-stat-badge"><small>Estimated impact</small><strong>{formatAed(item.estimatedImpact)}</strong></span><span className="ws-stat-badge"><small>Journey improvement</small><strong>{item.journeyImprovement}</strong></span></div><p className="ws-rationale"><b>Why recommended</b>{item.commercialRationale}</p>{explanation&&<div className="ws-factor-grid"><div><b>Positive factors</b>{explanation.positiveFactors.map(factor=><span key={factor}>+ {factor}</span>)}</div><div><b>Limiting factors</b>{explanation.limitingFactors.map(factor=><span key={factor}>− {factor}</span>)}</div></div>}<ProgressBar value={item.confidence} label={`${item.confidence}% recommendation confidence`}/><div className="ws-action-bar"><button className="ws-button" onClick={()=>setRecommendationState(item.id,"saved")}>{state==="saved"?"Saved":"Save"}</button><button className="ws-button" onClick={()=>setRecommendationState(item.id,"dismissed")}>Dismiss</button><button className="ws-button primary" onClick={()=>setRecommendationState(item.id,"reviewing")}>{state==="reviewing"?"In review":"Review"}</button></div></article>})}</div>:<p className="ws-recommendation-empty">No current recommendations in this group.</p>}</section>})}</div></AppCard>
}
