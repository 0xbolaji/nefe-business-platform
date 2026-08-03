import OpportunitiesWorkspace from "./opportunities-workspace";
import {requireWorkspaceContext} from "@/app/lib/auth/workspace-context";
import {can} from "@/app/lib/auth/permissions";
import {getOpportunityDirectoryReferences,listOpportunitySummaries} from "@/app/lib/data/opportunity-repository";

export default async function OpportunitiesPage({searchParams}:{searchParams:Promise<{business?:string}>}){
  const context=await requireWorkspaceContext();
  const [opportunities,references,query]=await Promise.all([listOpportunitySummaries(context),getOpportunityDirectoryReferences(context),searchParams]);
  const defaultBusinessId=references.businesses.some(item=>item.id===query.business)?query.business:undefined;
  return <OpportunitiesWorkspace opportunities={opportunities} businesses={references.businesses} members={references.members} canCreate={can(context.membership.role,"opportunity.update")} defaultBusinessId={defaultBusinessId}/>;
}
