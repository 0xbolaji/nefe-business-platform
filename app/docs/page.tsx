import type { Metadata } from "next";
import Link from "next/link";
import DocsSearch from "./components/docs-search";
import { getAllDocs, getNavGroups } from "@/lib/docs";

export const metadata: Metadata = {
  title: "NEFE Business Network Documentation",
  description:
    "Platform concepts, merchant operations, consumer experiences, commercial architecture, security, developer resources, and reference materials for NEFE Business Network.",
  alternates: { canonical: "/docs" },
};

const featuredRoutes = [
  "/docs/platform/overview",
  "/docs/getting-started/quick-start",
  "/docs/merchants/portal-guide",
  "/docs/platform/opportunity-engine",
  "/docs/platform/commerce-graph",
  "/docs/business/revenue-architecture",
  "/docs/business/pilot-program",
  "/docs/reference/faq",
];

export default function DocsHomePage() {
  const docs = getAllDocs();
  const groups = getNavGroups();
  const records = docs.map((doc) => ({
    title: doc.title,
    category: doc.category,
    summary: doc.summary,
    route: doc.route,
    text: doc.plainText,
  }));
  const featured = featuredRoutes.map((route) => docs.find((doc) => doc.route === route)).filter(Boolean);

  return (
    <main className="docs-home">
      <section className="docs-home-hero">
        <div className="docs-kicker">Knowledge centre</div>
        <h1>NEFE Business Network Documentation</h1>
        <p>
          Explore platform concepts, merchant operations, consumer experiences, commercial architecture,
          ecosystem layers, security guidance, developer resources, and reference materials.
        </p>
        <DocsSearch records={records} />
      </section>
      <section className="docs-home-section">
        <div className="docs-section-heading">
          <div>
            <span>Explore</span>
            <h2>Browse by category</h2>
          </div>
          <Link href="/docs/documentation-system">How this documentation works →</Link>
        </div>
        <div className="docs-category-grid">
          {groups.map((group, index) => (
            <Link key={group.slug} href={`/docs/${group.slug}`} className="docs-category-card">
              <span className="docs-category-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{group.category}</h3>
              <p>{group.pages.length} {group.pages.length === 1 ? "guide" : "guides"}</p>
              <strong aria-hidden="true">→</strong>
            </Link>
          ))}
        </div>
      </section>
      <section className="docs-home-section docs-featured-section">
        <div className="docs-section-heading">
          <div>
            <span>Recommended</span>
            <h2>Featured documentation</h2>
          </div>
        </div>
        <div className="docs-featured-grid">
          {featured.map((doc) =>
            doc ? (
              <Link key={doc.route} href={doc.route}>
                <span>{doc.category}</span>
                <h3>{doc.title}</h3>
                <p>{doc.summary}</p>
              </Link>
            ) : null,
          )}
        </div>
      </section>
    </main>
  );
}

