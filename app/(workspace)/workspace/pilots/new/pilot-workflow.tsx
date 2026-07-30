"use client";

import Link from "next/link";
import {useRouter,useSearchParams} from "next/navigation";
import {useState,useTransition} from "react";
import {createPilotRecord} from "@/app/lib/actions/workspace-mutations";
import {analyzeEcosystem,scoreOpportunity} from "../../../_lib/commercial-intelligence";
import {formatAed} from "../../../_lib/format";
import type {PilotParticipant} from "../../../_lib/models";
import {useCollaboration} from "../../_components/collaboration-state";
import {AppCard,PageHeader,SectionHeader,StatusBadge} from "../../_components/ui";

const steps=["Select opportunity","Confirm participants","Define objectives","Timeline and milestones","Configure KPIs","Assign owners","Risks and dependencies","Review and create"];

export default function NewPilotWorkflow(){
 const {data}=useCollaboration();
 const eligible=data.opportunities.filter(item=>item.stage==="Approved"||item.stage==="Pilot");
 const params=useSearchParams();
 const router=useRouter();
 const initial=eligible.find(item=>item.id===params.get("opportunity"))??eligible[0];
 const [step,setStep]=useState(0);
 const [opportunityId,setOpportunityId]=useState(initial?.id??"");
 const opportunity=data.opportunities.find(item=>item.id===opportunityId);
 const [participantIds,setParticipantIds]=useState<string[]>(initial?.businessIds??[]);
 const [objective,setObjective]=useState(initial?`Validate ${initial.title.toLowerCase()} as a controlled real-world commercial pilot.`:"");
 const [startDate,setStartDate]=useState("2026-09-01");
 const [endDate,setEndDate]=useState("2026-11-30");
 const [ownerId,setOwnerId]=useState(initial?.ownerId??data.users[0]?.id??"");
 const [error,setError]=useState("");
 const [pending,startTransition]=useTransition();

 if(!opportunity)return <><PageHeader title="Create pilot" description="No approved opportunity is currently available."/><AppCard><p>Approve an opportunity before creating a pilot.</p><Link className="ws-button" href="/workspace/opportunities">Review opportunities</Link></AppCard></>;

 const intelligence=scoreOpportunity(opportunity,data);
 const ecosystem=analyzeEcosystem(participantIds,data);
 const participants:PilotParticipant[]=participantIds.map(id=>({businessId:id,role:"Experience Partner",status:"Pending"}));
 const stepValid=step===1?participantIds.length>0:step===2?objective.trim().length>=3:step===3?Boolean(startDate&&endDate&&endDate>=startDate):step===5?Boolean(ownerId):true;
 const create=()=>{
  setError("");
  const id=crypto.randomUUID();
  startTransition(async()=>{
   const result=await createPilotRecord({id,name:`${opportunity.title} Pilot`,opportunityId:opportunity.id,ownerId,objective,startDate,endDate,reviewDate:endDate,participants});
   if(!result.ok){setError(result.error);return}
   router.push(`/workspace/pilots/${id}`);
   router.refresh();
  });
 };

 return <>
  <PageHeader eyebrow="Create pilot" title="Convert an approved opportunity into an execution plan" description="The completed plan is persisted to the authenticated workspace."/>
  <nav className="ws-stepper" aria-label="Pilot creation steps">{steps.map((label,index)=><button type="button" key={label} className={index===step?"active":index<step?"complete":""} onClick={()=>index<=step&&setStep(index)} disabled={pending}><span>{index+1}</span>{label}</button>)}</nav>
  <AppCard>
   {step===0&&<><SectionHeader title="Select opportunity" description="Only approved or pilot-stage opportunities are eligible."/><div className="ws-selection-grid">{eligible.map(item=><button type="button" className={opportunityId===item.id?"active":""} key={item.id} onClick={()=>{setOpportunityId(item.id);setParticipantIds(item.businessIds);setOwnerId(item.ownerId??data.users[0]?.id??"");setObjective(`Validate ${item.title.toLowerCase()} as a controlled real-world commercial pilot.`)}}><StatusBadge tone={item.status}>{item.stage}</StatusBadge><strong>{item.title}</strong><small>{formatAed(item.estimatedValue)} · {scoreOpportunity(item,data).confidence}% confidence</small></button>)}</div></>}
   {step===1&&<><SectionHeader title="Confirm participants" description="Persisted opportunity participants are preselected."/><div className="ws-what-if-businesses">{data.businesses.map(item=><button type="button" key={item.id} aria-pressed={participantIds.includes(item.id)} className={participantIds.includes(item.id)?"active":""} onClick={()=>setParticipantIds(current=>current.includes(item.id)?current.filter(id=>id!==item.id):[...current,item.id])}><span className="ws-avatar">{item.initials}</span><b>{item.name}</b></button>)}</div>{!participantIds.length&&<p className="ws-form-error" role="alert">Select at least one participant.</p>}</>}
   {step===2&&<><SectionHeader title="Define objectives" description="Commercial rationale carries forward from the opportunity."/><label className="ws-field"><span>Pilot objective</span><textarea required value={objective} onChange={event=>setObjective(event.target.value)}/></label></>}
   {step===3&&<><SectionHeader title="Set timeline and milestones" description="Define the controlled execution period."/><div className="ws-form-grid"><label className="ws-field"><span>Start</span><input required type="date" value={startDate} onChange={event=>setStartDate(event.target.value)}/></label><label className="ws-field"><span>End</span><input required min={startDate} type="date" value={endDate} onChange={event=>setEndDate(event.target.value)}/></label></div>{endDate<startDate&&<p className="ws-form-error" role="alert">End date must be on or after the start date.</p>}</>}
   {step===4&&<><SectionHeader title="Configure KPIs" description="Deterministic planning measures remain independent of persistence."/><p>Modeled value: {formatAed(opportunity.estimatedValue)} · Journey coverage: {ecosystem.scores.journeyCoverage}%</p></>}
   {step===5&&<><SectionHeader title="Assign owners" description="One accountable pilot owner is required."/><label className="ws-field"><span>Pilot owner</span><select required value={ownerId} onChange={event=>setOwnerId(event.target.value)}>{data.users.map(item=><option value={item.id} key={item.id}>{item.name}</option>)}</select></label></>}
   {step===6&&<><SectionHeader title="Review risks and dependencies" description="Known limiting factors from deterministic opportunity analysis."/><div className="ws-list">{intelligence.limitingFactors.map(item=><p key={item}>{item}</p>)}</div></>}
   {step===7&&<><SectionHeader title="Review and create pilot" description="Confirm the persisted plan before creation."/><p><b>{opportunity.title}</b></p><p>{participantIds.length} participants · {startDate} to {endDate}</p></>}
   {error&&<p className="ws-form-error" role="alert">{error}</p>}
   <div className="ws-workflow-actions"><Link className="ws-button" href="/workspace/pilots">Cancel</Link><button type="button" className="ws-button" disabled={step===0||pending} onClick={()=>setStep(value=>value-1)}>Back</button>{step<7?<button type="button" className="ws-button primary" disabled={!stepValid||pending} onClick={()=>setStep(value=>value+1)}>Continue</button>:<button type="button" className="ws-button primary" disabled={pending||!participantIds.length||!objective.trim()||!ownerId||endDate<startDate} onClick={create}>{pending?"Creating pilot…":"Create pilot"}</button>}</div>
  </AppCard>
 </>;
}
