import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocumentationPage from "../../components/doc-page";
import { getAllDocs, getDocByRoute } from "@/lib/docs";

export function generateStaticParams() {
  return getAllDocs()
    .filter((doc) => doc.sourcePath !== "DOCUMENTATION-SYSTEM.md" && doc.route.split("/").filter(Boolean).length === 3)
    .map((doc) => ({ category: doc.categorySlug, slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const doc = getDocByRoute(`/docs/${category}/${slug}`);
  if (!doc) return {};
  const title = `${doc.title} | NEFE Business Network Documentation`;
  return {
    title,
    description: doc.summary,
    alternates: { canonical: doc.route },
    openGraph: { title, description: doc.summary, url: doc.route, type: "article" },
  };
}

export default async function DocsArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const doc = getDocByRoute(`/docs/${category}/${slug}`);
  if (!doc) notFound();
  return <DocumentationPage doc={doc} />;
}
