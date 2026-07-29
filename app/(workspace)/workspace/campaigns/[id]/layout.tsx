import type {ReactNode} from "react";
import EntityCollaboration from "../../_components/entity-collaboration";
export default async function CampaignCollaborationLayout({children,params}:{children:ReactNode;params:Promise<{id:string}>}){const {id}=await params;return <>{children}<EntityCollaboration entityType="campaign" entityId={id}/></>}
