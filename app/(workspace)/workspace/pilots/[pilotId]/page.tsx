import {getWorkspaceData} from "@/app/lib/data/workspace-repository";
import WorkspaceBreadcrumbs from "../../_components/workspace-breadcrumbs";
import PilotDetail from "./pilot-detail";
export default async function PilotDetailPage({params}:{params:Promise<{pilotId:string}>}){const [{pilotId},data]=await Promise.all([params,getWorkspaceData()]),pilot=data.pilots.find(item=>item.id===pilotId);return <><WorkspaceBreadcrumbs section="Pilots" href="/workspace/pilots" current={pilot?.name??"Pilot workspace"}/><PilotDetail pilotId={pilotId}/></>}
