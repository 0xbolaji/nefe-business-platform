"use client";
import { ErrorState } from "./_components/ui";
export default function WorkspaceError({reset}:{reset:()=>void}){return <div className="ws-loading-page"><ErrorState description="The workspace view encountered an unexpected problem."/><button type="button" className="ws-button primary" onClick={reset}>Try again</button></div>}
