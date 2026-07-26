"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export type SearchRecord = {
  title: string;
  category: string;
  summary: string;
  route: string;
  text: string;
};

function excerpt(record: SearchRecord, query: string) {
  const source = `${record.summary} ${record.text}`.replace(/\s+/g, " ").trim();
  const index = source.toLowerCase().indexOf(query.toLowerCase());
  const start = Math.max(0, index === -1 ? 0 : index - 55);
  const value = source.slice(start, start + 170);
  return `${start ? "…" : ""}${value}${source.length > start + 170 ? "…" : ""}`;
}

export default function DocsSearch({
  records,
  compact = false,
}: {
  records: SearchRecord[];
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return records
      .map((record) => {
        const haystack = `${record.title} ${record.category} ${record.summary} ${record.text}`.toLowerCase();
        const score =
          (record.title.toLowerCase().includes(normalized) ? 4 : 0) +
          (record.category.toLowerCase().includes(normalized) ? 2 : 0) +
          (haystack.includes(normalized) ? 1 : 0);
        return { record, score };
      })
      .filter(({ score }) => score)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [query, records]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.matches("input, textarea, select, [contenteditable='true']");
      if (
        ((!typing && event.key === "/") || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k"))
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={`docs-search ${compact ? "docs-search-compact" : ""}`}>
      <label className="sr-only" htmlFor={compact ? "docs-search-compact" : "docs-search"}>
        Search documentation
      </label>
      <div className="docs-search-field">
        <span aria-hidden="true">⌕</span>
        <input
          ref={inputRef}
          id={compact ? "docs-search-compact" : "docs-search"}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search documentation"
          autoComplete="off"
        />
        <kbd>⌘ K</kbd>
      </div>
      {query && (
        <div className="docs-search-results" role="region" aria-label="Documentation search results">
          <p className="sr-only" aria-live="polite">
            {results.length} documentation {results.length === 1 ? "result" : "results"} found.
          </p>
          {results.length ? (
            results.map(({ record }) => (
              <Link key={record.route} href={record.route} onClick={() => setQuery("")}>
                <span>{record.category}</span>
                <strong>{record.title}</strong>
                <p>{excerpt(record, query)}</p>
              </Link>
            ))
          ) : (
            <p className="docs-search-empty">No documentation matched “{query}”.</p>
          )}
        </div>
      )}
    </div>
  );
}
