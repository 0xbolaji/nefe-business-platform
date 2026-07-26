"use client";
import { useCollaboration } from "./collaboration-state";
import { AppCard, EmptyState, SectionHeader, StatusBadge } from "./ui";
export default function DecisionLog(){const {decisions}=useCollaboration();return <AppCard><SectionHeader title="Decision log" description="Session-only history of recommendation, partner and opportunity decisions."/><div className="ws-timeline">{decisions.length?decisions.map(item=><div className="ws-timeline-item" key={item.id}><StatusBadge tone="draft">{item.type}</StatusBadge><h3>{item.action}</h3><p>{item.detail}</p><small>{item.createdAt}</small></div>):<EmptyState title="No session decisions" description="Scenario changes, recommendation actions and pipeline moves will appear here."/>}</div></AppCard>}
