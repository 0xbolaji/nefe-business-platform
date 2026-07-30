import OpportunitiesWorkspace from "./opportunities-workspace";
import {requireWorkspaceContext} from "@/app/lib/auth/workspace-context";
import {can} from "@/app/lib/auth/permissions";
export default async function OpportunitiesPage(){const context=await requireWorkspaceContext();return <OpportunitiesWorkspace canCreate={can(context.membership.role,"opportunity.update")}/>}
