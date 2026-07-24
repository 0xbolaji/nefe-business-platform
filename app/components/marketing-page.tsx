import Link from "next/link";
import type { ReactNode } from "react";

export type MarketingFeature = {
  eyebrow?: string;
  title: string;
  description: string;
  outcome?: string;
  href: string;
  cta?: string;
};

export function ProductVisual({ variant = 0, label }: { variant?: number; label: string }) {
  return (
    <div className={`product-visual product-visual-${variant % 4}`} aria-label={`${label} conceptual illustration`} role="img">
      <div className="product-visual-bar">
        <span /><span /><span />
        <small>{label}</small>
      </div>
      <div className="product-visual-canvas">
        <i className="pv-node pv-node-a" />
        <i className="pv-node pv-node-b" />
        <i className="pv-node pv-node-c" />
        <i className="pv-line pv-line-a" />
        <i className="pv-line pv-line-b" />
        <div className="pv-panel">
          <span />
          <strong />
          <em />
        </div>
        <div className="pv-metric"><span>Commercial signal</span><strong>↑</strong></div>
      </div>
    </div>
  );
}

export function MarketingHero({
  eyebrow,
  title,
  accent,
  description,
  primary,
  secondary,
  visualLabel,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  visualLabel: string;
}) {
  return (
    <section className="marketing-hero">
      <div className="marketing-hero-grid" aria-hidden="true" />
      <div className="marketing-shell marketing-hero-layout">
        <div>
          <span className="marketing-eyebrow">{eyebrow}</span>
          <h1>{title} <span>{accent}</span></h1>
          <p>{description}</p>
          <div className="marketing-actions">
            <Link href={primary.href} className="button-primary">{primary.label} <span>→</span></Link>
            <Link href={secondary.href} className="button-secondary">{secondary.label}</Link>
          </div>
        </div>
        <ProductVisual label={visualLabel} />
      </div>
    </section>
  );
}

export function FeatureSection({
  eyebrow,
  title,
  description,
  features,
  alternating = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  features: MarketingFeature[];
  alternating?: boolean;
}) {
  return (
    <section className="marketing-section marketing-shell">
      <header className="marketing-section-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      <div className={alternating ? "marketing-feature-rows" : "marketing-feature-grid"}>
        {features.map((feature, index) =>
          alternating ? (
            <article className="marketing-feature-row" key={feature.title}>
              <div>
                <span className="marketing-index">{String(index + 1).padStart(2, "0")} · {feature.eyebrow ?? eyebrow}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                {feature.outcome && <div className="marketing-outcome"><span>Business outcome</span>{feature.outcome}</div>}
                <Link href={feature.href}>{feature.cta ?? "Read documentation"} →</Link>
              </div>
              <ProductVisual variant={index} label={feature.title} />
            </article>
          ) : (
            <article className="marketing-feature-card" key={feature.title}>
              <span className="marketing-index">{String(index + 1).padStart(2, "0")}</span>
              <div className={`marketing-mini-visual marketing-mini-visual-${index % 4}`} aria-hidden="true">
                <i /><i /><i />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              {feature.outcome && <div className="marketing-outcome"><span>Outcome</span>{feature.outcome}</div>}
              <Link href={feature.href}>{feature.cta ?? "Read documentation"} →</Link>
            </article>
          ),
        )}
      </div>
    </section>
  );
}

export function ProcessSection({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string;
  title: string;
  steps: { title: string; description: string }[];
}) {
  return (
    <section className="marketing-process">
      <div className="marketing-shell">
        <header className="marketing-section-heading">
          <span>{eyebrow}</span><h2>{title}</h2>
        </header>
        <div className="marketing-process-grid">
          {steps.map((step, index) => (
            <article key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MarketingCta({
  eyebrow = "Build connected commerce",
  title,
  description,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}) {
  return (
    <section className="marketing-cta marketing-shell">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="marketing-actions">
          <Link href={primary.href} className="button-primary">{primary.label} →</Link>
          <Link href={secondary.href} className="button-secondary">{secondary.label}</Link>
        </div>
      </div>
    </section>
  );
}

export function MarketingPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <main className={`marketing-page ${className}`}>{children}</main>;
}

