import OpportunitiesWorkspace from "./opportunities-workspace";
import {requireWorkspaceContext} from "@/app/lib/auth/workspace-context";
import {can} from "@/app/lib/auth/permissions";
import {getWorkspaceData} from "@/app/lib/data/workspace-repository";
export default async function OpportunitiesPage({searchParams}:{searchParams:Promise<{business?:string}>}){const [context,data,query]=await Promise.all([requireWorkspaceContext(),getWorkspaceData(),searchParams]),defaultBusinessId=data.businesses.some(item=>item.id===query.business)?query.business:undefined;return <OpportunitiesWorkspace canCreate={can(context.membership.role,"opportunity.update")} defaultBusinessId={defaultBusinessId}/>}
