import type {ReactNode} from "react";
import EntityCollaboration from "../../_components/entity-collaboration";
export default async function PilotCollaborationLayout({children,params}:{children:ReactNode;params:Promise<{pilotId:string}>}){const {pilotId}=await params;return <>{children}<EntityCollaboration entityType="pilot" entityId={pilotId}/></>}
