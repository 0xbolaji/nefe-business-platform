import Link from "next/link";
import {requireWorkspaceContext} from "@/app/lib/auth/workspace-context";
import {decisionRepository} from "@/app/lib/data/decision-repository";
import {AppCard,EmptyState,SectionHeader,StatusBadge} from "../_components/ui";

export default async function DashboardDecisionSummary(){
  const context=await requireWorkspaceContext(),repository=decisionRepository(context);
  const [pending,dueSoon,rows]=await Promise.all([repository.requiringMyAction(),repository.dueSoon(),repository.workspace()]);
  const active=rows.map(row=>row.decision).filter(item=>["pending_review","pending_approval","changes_requested"].includes(item.status));
  const attention=[...new Map([...pending,...dueSoon,...active].map(item=>[item.id,item])).values()].slice(0,5);
  return <AppCard className="ws-section-gap ws-dashboard-card ws-dashboard-attention"><SectionHeader title="Requires attention" description="Pending approvals, changes requested, and decisions approaching their deadline." action={<Link href="/workspace/decisions">Open Decision Center →</Link>}/>{attention.length?<div className="ws-dashboard-attention-list">{attention.map(item=><Link href={`/workspace/decisions/${item.id}`} key={item.id}><span aria-hidden="true">D</span><div><strong>{item.title}</strong><p>{item.requestedOutcome}</p><small>{item.dueAt?`Due ${item.dueAt.toLocaleDateString()}`:"No deadline"}</small></div><StatusBadge tone={item.status}>{item.status.replaceAll("_"," ")}</StatusBadge><i aria-hidden="true">→</i></Link>)}</div>:<EmptyState title="No executive decisions require attention" description="Pending approvals and changes requested will appear here with direct links."/>}</AppCard>
}
