import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DOCS_ROOT = path.join(process.cwd(), "content", "docs");

export type DocMeta = {
  title: string;
  summary: string;
  category: string;
  order: number;
  status: string;
  updated: string;
};

export type DocHeading = { id: string; text: string; level: 2 | 3 };

export type DocPage = DocMeta & {
  sourcePath: string;
  route: string;
  categorySlug: string;
  slug: string;
  content: string;
  headings: DocHeading[];
  plainText: string;
};

export type DocNavGroup = {
  category: string;
  slug: string;
  pages: Pick<DocPage, "title" | "route" | "slug">[];
};

const CATEGORY_ORDER = [
  "getting-started",
  "platform",
  "merchants",
  "consumers",
  "business",
  "ecosystem",
  "security",
  "developers",
  "reference",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function markdownFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory()
      ? markdownFiles(absolute)
      : entry.name.endsWith(".md")
        ? [absolute]
        : [];
  });
}

function routeForSource(relativeSource: string) {
  if (relativeSource === "DOCUMENTATION-SYSTEM.md") return "/docs/documentation-system";
  const withoutExtension = relativeSource.replace(/\.md$/i, "");
  const parts = withoutExtension.split(path.sep);
  if (parts.at(-1) === "index") parts.pop();
  return `/docs/${parts.join("/")}`;
}

function extractHeadings(markdown: string): DocHeading[] {
  const used = new Map<string, number>();
  return [...markdown.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => {
    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();
    const base = slugify(text);
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    return {
      id: count ? `${base}-${count}` : base,
      text,
      level: match[1].length as 2 | 3,
    };
  });
}

function toPlainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_`|[\]-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function loadRawDocs() {
  return markdownFiles(DOCS_ROOT).map((absolutePath) => {
    const sourcePath = path.relative(DOCS_ROOT, absolutePath);
    const parsed = matter(fs.readFileSync(absolutePath, "utf8"));
    const data = parsed.data as Partial<DocMeta>;
    const route = routeForSource(sourcePath);
    const routeParts = route.split("/").filter(Boolean);
    return {
      title: data.title ?? path.basename(sourcePath, ".md"),
      summary: data.summary ?? "",
      category: data.category ?? "Documentation",
      order: Number(data.order ?? 999),
      status: data.status ?? "live",
      updated: String(data.updated ?? ""),
      sourcePath,
      route,
      categorySlug: routeParts[1] ?? "documentation",
      slug: routeParts[2] ?? routeParts[1] ?? "documentation-system",
      content: parsed.content,
    };
  });
}

function resolveLinks(content: string, sourcePath: string, routeBySource: Map<string, string>) {
  return content.replace(
    /(\[[^\]]+\]\()([^)]+\.md)(#[^)]+)?(\))/g,
    (full, open: string, target: string, hash = "", close: string) => {
      const normalized = path
        .normalize(path.join(path.dirname(sourcePath), decodeURIComponent(target)))
        .split(path.sep)
        .join("/");
      const route = routeBySource.get(normalized);
      return route ? `${open}${route}${hash}${close}` : full;
    },
  );
}

export function getAllDocs(): DocPage[] {
  const raw = loadRawDocs();
  const routeBySource = new Map(raw.map((doc) => [doc.sourcePath.split(path.sep).join("/"), doc.route]));
  return raw
    .map((doc) => {
      const content = resolveLinks(doc.content, doc.sourcePath, routeBySource);
      return {
        ...doc,
        content,
        headings: extractHeadings(content),
        plainText: toPlainText(content),
      };
    })
    .sort((a, b) => {
      const categoryDifference =
        (CATEGORY_ORDER.indexOf(a.categorySlug) === -1 ? 999 : CATEGORY_ORDER.indexOf(a.categorySlug)) -
        (CATEGORY_ORDER.indexOf(b.categorySlug) === -1 ? 999 : CATEGORY_ORDER.indexOf(b.categorySlug));
      return categoryDifference || a.order - b.order || a.title.localeCompare(b.title);
    });
}

export function getNavGroups(): DocNavGroup[] {
  const docs = getAllDocs().filter((doc) => doc.sourcePath !== "DOCUMENTATION-SYSTEM.md");
  return CATEGORY_ORDER.map((slug) => {
    const pages = docs.filter((doc) => doc.categorySlug === slug);
    return {
      slug,
      category: pages[0]?.category ?? titleFromSlug(slug),
      pages: pages.map(({ title, route, slug: pageSlug }) => ({ title, route, slug: pageSlug })),
    };
  }).filter((group) => group.pages.length);
}

export function getDocByRoute(route: string) {
  return getAllDocs().find((doc) => doc.route === route);
}

export function getCategoryDocs(category: string) {
  return getAllDocs().filter((doc) => doc.categorySlug === category);
}

export function getAdjacentDocs(route: string) {
  const docs = getAllDocs();
  const index = docs.findIndex((doc) => doc.route === route);
  return {
    previous: index > 0 ? docs[index - 1] : undefined,
    next: index >= 0 && index < docs.length - 1 ? docs[index + 1] : undefined,
  };
}

export function getRelatedDocs(doc: DocPage) {
  const linkedRoutes = [...doc.content.matchAll(/\]\((\/docs\/[^)#]+)/g)].map((match) => match[1]);
  const candidates = getAllDocs().filter(
    (candidate) =>
      candidate.route !== doc.route &&
      (linkedRoutes.includes(candidate.route) || candidate.categorySlug === doc.categorySlug),
  );
  return [...new Map(candidates.map((candidate) => [candidate.route, candidate])).values()].slice(0, 3);
}

export function getUnresolvedMarkdownLinks() {
  return getAllDocs().flatMap((doc) =>
    [...doc.content.matchAll(/\]\(([^)]+\.md(?:#[^)]+)?)\)/g)].map((match) => ({
      source: doc.sourcePath,
      target: match[1],
    })),
  );
}

export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

