"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {formatAed} from "../../_lib/format";
import type {OpportunityStage} from "../../_lib/models";
import {FavoriteButton} from "../_components/entity-actions";
import {useCollaboration} from "../_components/collaboration-state";
import {FilterBar,PageHeader,StatusBadge} from "../_components/ui";
const stages:OpportunityStage[]=["Identified","Qualified","Negotiating","Approved","Pilot","Active","Completed"];
export default function OpportunitiesWorkspace(){
 const {opportunityStages,moveOpportunity,data}=useCollaboration();const {opportunities,businesses}=data;const [priority,setPriority]=useState("All");const [query,setQuery]=useState("");const getBusiness=(id:string)=>businesses.find(item=>item.id===id);
 const items=useMemo(()=>opportunities.filter(item=>(priority==="All"||item.priority===priority.toLowerCase())&&`${item.title} ${item.summary} ${item.stage}`.toLowerCase().includes(query.toLowerCase())),[opportunities,priority,query]);
 return <><PageHeader eyebrow="Commercial intelligence" title="Opportunity pipeline" description="Move opportunities through qualification, negotiation, approval and controlled execution. Stage changes are persisted to this workspace." action={<button className="ws-button primary">Create opportunity</button>}/><FilterBar><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search opportunities" aria-label="Search opportunities"/><select value={priority} onChange={event=>setPriority(event.target.value)} aria-label="Filter opportunity priority"><option>All</option><option>High</option><option>Medium</option><option>Low</option></select></FilterBar><div className="ws-kanban" aria-label="Opportunity pipeline">{stages.map(stage=>{const stageItems=items.filter(item=>opportunityStages[item.id]===stage);return <section className="ws-kanban-column" key={stage}><header><h2>{stage}</h2><span>{stageItems.length}</span></header><div>{stageItems.map(item=><article className="ws-kanban-card" key={item.id}><div className="ws-kanban-card-head"><StatusBadge tone={item.priority}>{item.priority}</StatusBadge><FavoriteButton type="opportunity" id={item.id}/></div><Link href={`/workspace/opportunities/${item.id}`}><h3>{item.title}</h3><p>{item.summary}</p></Link><div className="ws-tags">{item.businessIds.slice(0,3).map(id=><span key={id}>{getBusiness(id)?.initials}</span>)}</div><strong>{formatAed(item.estimatedValue)}</strong><label><span>Move to</span><select value={opportunityStages[item.id]} onChange={event=>moveOpportunity(item.id,event.target.value as OpportunityStage)}>{stages.map(option=><option key={option}>{option}</option>)}</select></label></article>)}</div></section>})}</div></>
}
