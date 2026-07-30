import Link from "next/link";
import {getWorkspaceData} from "@/app/lib/data/workspace-repository";
import RecommendationPanel from "../_components/recommendation-panel";
import EntityDecisions from "../_components/entity-decisions";
import {AppCard,PageHeader,SectionHeader} from "../_components/ui";

export default async function RecommendationsPage({searchParams}:{searchParams:Promise<{decisionFor?:string}>}){const [{decisionFor},data]=await Promise.all([searchParams,getWorkspaceData()]),selected=data.recommendations.find(item=>item.id===decisionFor);return <><PageHeader eyebrow="Commercial intelligence" title="Recommendations" description="Review suggested partners and actions, their modeled impact, commercial rationale and confidence."/><RecommendationPanel/><AppCard className="ws-section-gap"><SectionHeader title="Recommendation decisions" description="Open the formal executive decision record attached to a recommendation."/><div className="ws-tags">{data.recommendations.map(item=><Link key={item.id} href={`/workspace/recommendations?decisionFor=${item.id}`}>{item.title}</Link>)}</div></AppCard>{selected&&<EntityDecisions entityType="recommendation" entityId={selected.id}/>}</>}
