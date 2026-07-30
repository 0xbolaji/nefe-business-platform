"use client";
import {ErrorState} from "./_components/ui";
export default function WorkspaceError({reset}:{error:Error&{digest?:string};reset:()=>void}){return <div className="ws-route-error"><ErrorState title="This workspace page could not load" description="The workspace is still available. Retry this page without losing your current session."/><button className="ws-button primary" type="button" onClick={reset}>Retry page</button></div>}
