import {Children,type ReactNode} from "react";

export function AppCard({ children, className = "" }: { children: ReactNode; className?: string }) { return <section className={`ws-card ${className}`}>{children}</section>; }
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) { return <div className={`ws-panel ${className}`}>{children}</div>; }

export function PageHeader({ eyebrow, title, description, action, className="" }: { eyebrow?: string; title: string; description: string; action?: ReactNode; className?:string }) {
  return <header className={`ws-page-header ${className}`}><div>{eyebrow&&<span>{eyebrow}</span>}<h1>{title}</h1><p>{description}</p></div>{action&&<div className="ws-page-action">{action}</div>}</header>;
}
export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <header className="ws-section-header"><div><h2>{title}</h2>{description&&<p>{description}</p>}</div>{action}</header>;
}
type StatusVisualTone="success"|"warning"|"info"|"planning"|"progress"|"neutral"|"danger";
type ProgressTone="purple"|"gold"|"green"|"blue"|"teal"|"red";
const statusToneGroups:Record<Exclude<StatusVisualTone,"neutral">,Set<string>>={
  success:new Set(["active","approved","complete","completed","achieved","verified","covered","confirmed","ready","ready to launch","low"]),
  warning:new Set(["negotiating","medium","nearly ready","not requested","upcoming"]),
  info:new Set(["pending","pending approval","pending review","qualified","identified"]),
  planning:new Set(["planning","pilot","draft","invited","saved"]),
  progress:new Set(["in progress","in review","reviewing","current","mitigating"]),
  danger:new Set(["high","critical","declined","rejected","blocked","at risk","changes requested"]),
};
const normalizeTone=(value?:string)=>value?.trim().toLowerCase().replaceAll("_"," ").replaceAll("-"," ")??"";
const matchStatusTone=(value?:string):StatusVisualTone|null=>{const normalized=normalizeTone(value);for(const [tone,values] of Object.entries(statusToneGroups) as [Exclude<StatusVisualTone,"neutral">,Set<string>][])if(values.has(normalized))return tone;if(["on hold","paused","cancelled","expired","abstained","dismissed","not started","inactive"].includes(normalized))return "neutral";return null};
export const getStatusVisualTone=(value?:string):StatusVisualTone=>matchStatusTone(value)??"neutral";
export function MetricCard({ label, value, detail, progress, tone = "purple", icon, trend }: { label: string; value: ReactNode; detail?: string; progress?: number; tone?: "purple" | "gold" | "green" | "blue"; icon?:ReactNode; trend?:{label:string;tone?:"positive"|"neutral"|"negative"} }) {
  return <AppCard className={`ws-metric ${icon?"has-icon":""}`}><div className="ws-metric-top"><div className={`ws-metric-mark ${tone}`} />{icon&&<span className={`ws-metric-icon ${tone}`} aria-hidden="true">{icon}</span>}</div><p>{label}</p><strong>{value}</strong>{(detail||trend)&&<div className="ws-metric-footer">{detail&&<small>{detail}</small>}{trend&&<span className={`ws-metric-trend ${trend.tone??"neutral"}`}>{trend.label}</span>}</div>}{progress!==undefined&&<ProgressBar value={progress} label={`${label}: ${progress}%`} tone={tone}/>}</AppCard>;
}
export function StatusBadge({ children, tone }: { children: ReactNode; tone?: string }) { const displayedTone=typeof children==="string"?matchStatusTone(children):null;return <span className={`ws-status ${displayedTone??getStatusVisualTone(tone)}`}>{children}</span>; }
export function StatBadge({ label, value }: { label: string; value: string }) { return <span className="ws-stat-badge"><small>{label}</small><strong>{value}</strong></span>; }
export function InsightCard({ type, title, description, value }: { type:"risk"|"strength"|"gap"|"opportunity"|"growth"|"readiness"|"coverage"; title:string; description:string; value?:string }) { return <article className={`ws-insight ${type}`}><div><span>{type}</span>{value&&<strong>{value}</strong>}</div><h3>{title}</h3><p>{description}</p></article>; }
export function ProgressBar({ value, label, tone="purple" }: { value: number; label?: string; tone?: ProgressTone }) { const safeValue=Math.max(0,Math.min(100,value));return <div className={`ws-progress ${tone}`} role="progressbar" aria-label={label ?? `${safeValue}% complete`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeValue}><span className="ws-progress-track" aria-hidden="true"><i style={{width:`${safeValue}%`}} /></span><strong aria-hidden="true">{safeValue}%</strong></div>; }

export function EmptyState({ title = "Nothing here yet", description = "New items will appear here when they are available." }: { title?: string; description?: string }) {
  return <div className="ws-empty"><span aria-hidden="true">◇</span><h3>{title}</h3><p>{description}</p></div>;
}
export function ErrorState({ title = "This panel could not load", description = "Refresh the page or try again shortly." }: { title?: string; description?: string }) {
  return <div className="ws-error" role="alert"><span aria-hidden="true">!</span><div><h3>{title}</h3><p>{description}</p></div></div>;
}
export function LoadingSkeleton({ rows = 4 }: { rows?: number }) { return <div className="ws-skeleton" role="status" aria-live="polite"><span className="sr-only">Loading content</span>{Array.from({length:rows},(_,index)=><i aria-hidden="true" key={index} />)}</div>; }
export function ActionBar({ children }: { children: ReactNode }) { return <div className="ws-action-bar">{children}</div>; }
export function FilterBar({ children }: { children: ReactNode }) { return <div className="ws-filter-bar">{children}</div>; }

export function DataTable({ headers, children, label }: { headers: string[]; children: ReactNode; label: string }) {
  const empty=Children.count(children)===0;return <div className="ws-table-wrap"><table className="ws-table"><caption className="sr-only">{label}</caption><thead><tr>{headers.map(header=><th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{empty?<tr><td colSpan={headers.length}><EmptyState title={`No ${label.toLowerCase()}`} description="Records will appear here when they are available."/></td></tr>:children}</tbody></table></div>;
}
