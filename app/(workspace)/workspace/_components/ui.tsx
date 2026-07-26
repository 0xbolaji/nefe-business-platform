import type { ReactNode } from "react";

export function AppCard({ children, className = "" }: { children: ReactNode; className?: string }) { return <section className={`ws-card ${className}`}>{children}</section>; }
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) { return <div className={`ws-panel ${className}`}>{children}</div>; }

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <header className="ws-page-header"><div>{eyebrow&&<span>{eyebrow}</span>}<h1>{title}</h1><p>{description}</p></div>{action&&<div className="ws-page-action">{action}</div>}</header>;
}
export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <header className="ws-section-header"><div><h2>{title}</h2>{description&&<p>{description}</p>}</div>{action}</header>;
}
export function MetricCard({ label, value, detail, tone = "purple" }: { label: string; value: string; detail: string; tone?: "purple" | "gold" | "green" | "blue" }) {
  return <AppCard className="ws-metric"><div className={`ws-metric-mark ${tone}`} /><p>{label}</p><strong>{value}</strong><small>{detail}</small></AppCard>;
}
export function StatusBadge({ children, tone }: { children: ReactNode; tone?: string }) { return <span className={`ws-status ${tone ?? "neutral"}`}>{children}</span>; }
export function StatBadge({ label, value }: { label: string; value: string }) { return <span className="ws-stat-badge"><small>{label}</small><strong>{value}</strong></span>; }
export function InsightCard({ type, title, description, value }: { type:"risk"|"strength"|"gap"|"opportunity"|"growth"|"readiness"|"coverage"; title:string; description:string; value?:string }) { return <article className={`ws-insight ${type}`}><div><span>{type}</span>{value&&<strong>{value}</strong>}</div><h3>{title}</h3><p>{description}</p></article>; }
export function ProgressBar({ value, label }: { value: number; label?: string }) { return <div className="ws-progress" aria-label={label ?? `${value}% complete`}><i style={{width:`${value}%`}} /><span>{value}%</span></div>; }

export function EmptyState({ title = "Nothing here yet", description = "New items will appear here when they are available." }: { title?: string; description?: string }) {
  return <div className="ws-empty"><span aria-hidden="true">◇</span><h3>{title}</h3><p>{description}</p></div>;
}
export function ErrorState({ title = "This panel could not load", description = "Refresh the page or try again shortly." }: { title?: string; description?: string }) {
  return <div className="ws-error" role="alert"><span aria-hidden="true">!</span><div><h3>{title}</h3><p>{description}</p></div></div>;
}
export function LoadingSkeleton({ rows = 4 }: { rows?: number }) { return <div className="ws-skeleton" aria-label="Loading content">{Array.from({length:rows},(_,index)=><i key={index} />)}</div>; }
export function ActionBar({ children }: { children: ReactNode }) { return <div className="ws-action-bar">{children}</div>; }
export function FilterBar({ children }: { children: ReactNode }) { return <div className="ws-filter-bar">{children}</div>; }

export function DataTable({ headers, children, label }: { headers: string[]; children: ReactNode; label: string }) {
  return <div className="ws-table-wrap"><table className="ws-table"><caption className="sr-only">{label}</caption><thead><tr>{headers.map(header=><th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}
