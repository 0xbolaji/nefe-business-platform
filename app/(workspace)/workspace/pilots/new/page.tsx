import { Suspense } from "react";
import NewPilotWorkflow from "./pilot-workflow";
export default function NewPilotPage(){return <Suspense fallback={<div className="ws-loading-page">Preparing pilot workflow…</div>}><NewPilotWorkflow/></Suspense>}
