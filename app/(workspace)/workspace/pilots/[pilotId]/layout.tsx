import type {ReactNode} from "react";
import EntityCollaboration from "../../_components/entity-collaboration";
import EntityDecisions from "../../_components/entity-decisions";
export default async function PilotCollaborationLayout({children,params}:{children:ReactNode;params:Promise<{pilotId:string}>}){const {pilotId}=await params;return <>{children}<EntityDecisions entityType="pilot" entityId={pilotId}/><EntityCollaboration entityType="pilot" entityId={pilotId}/></>}
