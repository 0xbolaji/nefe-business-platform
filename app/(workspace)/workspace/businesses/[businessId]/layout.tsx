import type {ReactNode} from "react";
import EntityCollaboration from "../../_components/entity-collaboration";
export default async function BusinessCollaborationLayout({children,params}:{children:ReactNode;params:Promise<{businessId:string}>}){const {businessId}=await params;return <>{children}<EntityCollaboration entityType="business" entityId={businessId}/></>}
