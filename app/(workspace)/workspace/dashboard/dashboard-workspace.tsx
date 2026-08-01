"use client";

import Link from "next/link";
import {useCollaboration} from "../_components/collaboration-state";
import {AppCard,EmptyState,MetricCard,PageHeader,SectionHeader,StatusBadge} from "../_components/ui";

const stages=["Identified","Qualified","Negotiating","Approved","Pilot","Active","Completed"] as const;

export default function DashboardWorkspace(){
  const {data,favorites,recentlyViewed,recentSearches,opportunityStages,recommendationStates}=useCollaboration();
  const {activities,businesses,campaigns,journeys,opportunities,recommendations,tasks,users}=data;
  const currentUser=users[0];
  const getUser=(id:string)=>users.find(item=>item.id===id);
  const activeCampaigns=campaigns.filter(item=>item.status==="active").length;
  const journeyCoverage=journeys.length?Math.round(journeys.reduce((sum,item)=>sum+item.coverage,0)/journeys.length):0;
  const favoriteBusinesses=businesses.filter(item=>favorites.business.includes(item.id));
  const openTasks=tasks.filter(item=>item.status==="open");

  return <div className="ws-dashboard">
    <PageHeader className="ws-dashboard-hero" eyebrow="Workspace overview" title={`Welcome back, ${currentUser?.name.split(" ")[0]??"there"}.`} description="Your commercial network, priorities, and execution signals in one operating view." action={<Link className="ws-button primary" href="/workspace/opportunities">Review pipeline <span aria-hidden="true">→</span></Link>}/>

    <section className="ws-dashboard-metrics" aria-label="Workspace performance summary">
      <div className="ws-metric-grid">
        <MetricCard icon="B" label="Participating businesses" value={String(businesses.length)} detail={`${businesses.filter(item=>item.verification==="Verified").length} verified`}/>
        <MetricCard icon="O" label="Pipeline opportunities" value={String(opportunities.length)} detail={`${Object.values(opportunityStages).filter(stage=>stage==="Pilot"||stage==="Active").length} in execution`} tone="gold"/>
        <MetricCard icon="C" label="Active campaigns" value={String(activeCampaigns)} detail="Commercial activity underway" tone="green"/>
        <MetricCard icon="J" label="Journey coverage" value={`${journeyCoverage}%`} detail="Across persisted journeys" progress={journeyCoverage} tone="blue"/>
      </div>
    </section>

    <section className="ws-dashboard-grid ws-dashboard-grid-primary" aria-label="Pipeline and recommendation summaries">
      <AppCard className="ws-dashboard-card ws-dashboard-pipeline">
        <SectionHeader title="Pipeline summary" description="Current opportunity distribution by collaboration stage." action={<Link href="/workspace/opportunities">Open board →</Link>}/>
        <div className="ws-pipeline-summary" role="list" aria-label="Opportunities by stage">{stages.map(stage=><div key={stage} role="listitem"><span>{Object.values(opportunityStages).filter(value=>value===stage).length}</span><p>{stage}</p></div>)}</div>
      </AppCard>
      <AppCard className="ws-dashboard-card ws-dashboard-recommendation-summary">
        <SectionHeader title="Recommendation summary" description="Decision state across explainable recommendations." action={<Link href="/workspace/recommendations">Review all →</Link>}/>
        <div className="ws-dashboard-status-grid">
          <div><StatusBadge tone="pending">Open</StatusBadge><strong>{recommendations.filter(item=>!recommendationStates[item.id]).length}</strong><small>Awaiting action</small></div>
          <div><StatusBadge tone="planning">Saved</StatusBadge><strong>{Object.values(recommendationStates).filter(item=>item==="saved").length}</strong><small>For later review</small></div>
          <div><StatusBadge tone="progress">In review</StatusBadge><strong>{Object.values(recommendationStates).filter(item=>item==="reviewing").length}</strong><small>Being assessed</small></div>
          <div><StatusBadge tone="neutral">Dismissed</StatusBadge><strong>{Object.values(recommendationStates).filter(item=>item==="dismissed").length}</strong><small>Closed signals</small></div>
        </div>
      </AppCard>
    </section>

    <section className="ws-dashboard-grid" aria-label="Personal workspace shortcuts">
      <AppCard className="ws-dashboard-card">
        <SectionHeader title="Recently viewed" description="Your latest persisted workspace history."/>
        {recentlyViewed.length?<div className="ws-list">{recentlyViewed.slice(0,5).map(item=><Link className="ws-list-item" href={item.href} key={`${item.type}-${item.id}`}><span>{item.type[0].toUpperCase()}</span><div><strong>{item.title}</strong><p>{item.type}</p><small>{item.viewedAt}</small></div><i className="ws-list-arrow" aria-hidden="true">→</i></Link>)}</div>:<EmptyState title="No recently viewed items" description="Open an entity workspace and it will appear here for quick access."/>}
      </AppCard>
      <AppCard className="ws-dashboard-card">
        <SectionHeader title="Favorite businesses" description="Starred participants for quick access."/>
        {favoriteBusinesses.length?<div className="ws-list">{favoriteBusinesses.map(item=><Link className="ws-list-item" href={`/workspace/businesses/${item.id}`} key={item.id}><span>{item.initials}</span><div><strong>{item.name}</strong><p>{item.category}</p></div><StatusBadge tone={item.status}>{item.status}</StatusBadge></Link>)}</div>:<EmptyState title="No favorite businesses" description="Star a business from its workspace to keep it within easy reach."/>}
      </AppCard>
    </section>

    <section className="ws-dashboard-grid ws-dashboard-operations" aria-label="Workspace activity and actions">
      <AppCard className="ws-dashboard-card">
        <SectionHeader title="Recent activity" description="Latest persisted collaboration changes."/>
        {activities.length?<div className="ws-dashboard-timeline">{activities.map(item=><article key={item.id}><span aria-hidden="true">{item.type[0]?.toUpperCase()}</span><div><strong>{item.title}</strong><p>{item.detail}</p><small><b>{getUser(item.actorId)?.name??"Workspace member"}</b><time>{item.createdAt}</time></small></div></article>)}</div>:<EmptyState title="No recent activity" description="Collaboration, decisions, and workspace updates will appear here."/>}
      </AppCard>
      <AppCard className="ws-dashboard-card ws-dashboard-actions-card">
        <SectionHeader title="Upcoming tasks" description="Persisted pilot work requiring an owner."/>
        {openTasks.length?<div className="ws-dashboard-action-list">{openTasks.map(item=><article key={item.id}><span aria-hidden="true">✓</span><div><strong>{item.title}</strong><p>{getUser(item.ownerId)?.name??"Unassigned"}</p></div><time>Due {item.due}</time></article>)}</div>:<EmptyState title="No upcoming tasks" description="Open pilot tasks will appear here with their owner and due date."/>}
        {recentSearches.length>0&&<div className="ws-dashboard-recent-searches"><small>Recent searches</small><div className="ws-tags">{recentSearches.map(item=><span key={item}>{item}</span>)}</div></div>}
      </AppCard>
    </section>
  </div>;
}
