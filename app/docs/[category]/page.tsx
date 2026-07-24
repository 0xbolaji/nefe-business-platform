import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DocumentationPage from "../components/doc-page";
import { getAllDocs, getCategoryDocs, getNavGroups, titleFromSlug } from "@/lib/docs";
import DocsShell from "../components/docs-shell";

export function generateStaticParams() {
  return [...getNavGroups().map((group) => ({ category: group.slug })), { category: "documentation-system" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const routeDocument = getAllDocs().find((item) => item.route === `/docs/${category}`);
  if (category === "documentation-system" || routeDocument) {
    const doc =
      category === "documentation-system"
        ? getAllDocs().find((item) => item.sourcePath === "DOCUMENTATION-SYSTEM.md")
        : routeDocument;
    return doc
      ? {
          title: `${doc.title} | NEFE Business Network Documentation`,
          description: doc.summary,
          alternates: { canonical: doc.route },
          openGraph: { title: doc.title, description: doc.summary, url: doc.route },
        }
      : {};
  }
  const pages = getCategoryDocs(category);
  if (!pages.length) return {};
  const title = `${pages[0].category} | NEFE Business Network Documentation`;
  const description = `Explore ${pages[0].category.toLowerCase()} guidance for NEFE Business Network.`;
  return { title, description, alternates: { canonical: `/docs/${category}` }, openGraph: { title, description } };
}

export default async function DocsCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const routeDocument = getAllDocs().find((item) => item.route === `/docs/${category}`);
  if (category === "documentation-system" || routeDocument) {
    const doc =
      category === "documentation-system"
        ? getAllDocs().find((item) => item.sourcePath === "DOCUMENTATION-SYSTEM.md")
        : routeDocument;
    if (!doc) notFound();
    return <DocumentationPage doc={doc} />;
  }
  const pages = getCategoryDocs(category);
  if (!pages.length) notFound();
  return (
    <DocsShell groups={getNavGroups()} headings={[]}>
      <div className="docs-category-page">
        <nav className="docs-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/docs">Docs</Link><span>/</span><span aria-current="page">{titleFromSlug(category)}</span>
        </nav>
        <span className="docs-category-eyebrow">Documentation category</span>
        <h1>{pages[0].category}</h1>
        <p>Explore all {pages[0].category.toLowerCase()} documentation for NEFE Business Network.</p>
        <div className="docs-category-list">
          {pages.map((page) => (
            <Link key={page.route} href={page.route}>
              <div><span>{page.status}</span><h2>{page.title}</h2><p>{page.summary}</p></div>
              <strong aria-hidden="true">→</strong>
            </Link>
          ))}
        </div>
      </div>
    </DocsShell>
  );
}
