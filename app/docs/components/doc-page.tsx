import Link from "next/link";
import type { DocPage } from "@/lib/docs";
import { getAdjacentDocs, getNavGroups, getRelatedDocs, titleFromSlug } from "@/lib/docs";
import DocsShell from "./docs-shell";
import MarkdownContent from "./markdown-content";

export default function DocumentationPage({ doc }: { doc: DocPage }) {
  const { previous, next } = getAdjacentDocs(doc.route);
  const related = getRelatedDocs(doc);
  return (
    <DocsShell groups={getNavGroups()} headings={doc.headings}>
      <div className="docs-page">
        <nav className="docs-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/docs">Docs</Link>
          <span>/</span>
          {doc.sourcePath === "DOCUMENTATION-SYSTEM.md" ? (
            <span aria-current="page">Documentation System</span>
          ) : (
            <>
              <Link href={`/docs/${doc.categorySlug}`}>{titleFromSlug(doc.categorySlug)}</Link>
              <span>/</span>
              <span aria-current="page">{doc.title}</span>
            </>
          )}
        </nav>
        <div className="docs-page-meta">
          <span className={`docs-status docs-status-${doc.status.toLowerCase()}`}>{doc.status}</span>
          <span>Updated {doc.updated}</span>
        </div>
        <MarkdownContent content={doc.content} />
        <nav className="docs-pagination" aria-label="Previous and next documentation">
          {previous ? (
            <Link href={previous.route}>
              <span>Previous</span>
              <strong>← {previous.title}</strong>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={next.route}>
              <span>Next</span>
              <strong>{next.title} →</strong>
            </Link>
          ) : <span />}
        </nav>
        {related.length > 0 && (
          <section className="docs-related">
            <h2>Related documentation</h2>
            <div>
              {related.map((item) => (
                <Link key={item.route} href={item.route}>
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                  <p>{item.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </DocsShell>
  );
}

