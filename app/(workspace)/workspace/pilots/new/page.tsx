import { Suspense } from "react";
import NewPilotWorkflow from "./pilot-workflow";
import {requireWorkspaceContext} from "@/app/lib/auth/workspace-context";
import {can} from "@/app/lib/auth/permissions";
import {AppCard,EmptyState,PageHeader} from "../../_components/ui";
export default async function NewPilotPage(){const context=await requireWorkspaceContext();if(!can(context.membership.role,"pilot.create"))return <><PageHeader title="Create pilot" description="Your workspace role has read-only access to pilot planning."/><AppCard><EmptyState title="Pilot creation is unavailable" description="Ask a workspace administrator or manager to create the pilot foundation."/></AppCard></>;return <Suspense fallback={<div className="ws-loading-page">Preparing pilot workflow…</div>}><NewPilotWorkflow/></Suspense>}
