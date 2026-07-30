import {LoadingSkeleton} from "./_components/ui";
export default function WorkspaceLoading(){return <div className="ws-route-loading" role="status" aria-live="polite"><span>Loading workspace…</span><LoadingSkeleton rows={6}/></div>}
