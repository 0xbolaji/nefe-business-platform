"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import type { DocHeading, DocNavGroup } from "@/lib/docs";

function Sidebar({ groups, close }: { groups: DocNavGroup[]; close?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="docs-sidebar-nav" aria-label="Documentation">
      <Link className={pathname === "/docs" ? "active docs-home-link" : "docs-home-link"} href="/docs" onClick={close}>
        Documentation home
      </Link>
      {groups.map((group) => (
        <details key={group.slug} open>
          <summary>{group.category}</summary>
          <div>
            {group.pages.map((page) => (
              <Link
                key={page.route}
                href={page.route}
                onClick={close}
                aria-current={pathname === page.route ? "page" : undefined}
                className={pathname === page.route ? "active" : ""}
              >
                {page.title}
              </Link>
            ))}
          </div>
        </details>
      ))}
      <Link
        href="/docs/documentation-system"
        onClick={close}
        className={pathname === "/docs/documentation-system" ? "active docs-system-link" : "docs-system-link"}
      >
        Documentation system
      </Link>
    </nav>
  );
}

function TableOfContents({ headings }: { headings: DocHeading[] }) {
  const [active, setActive] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const elements = headings.map((heading) => document.getElementById(heading.id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;
  return (
    <aside className="docs-toc" aria-label="On this page">
      <strong>On this page</strong>
      <nav>
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`${heading.level === 3 ? "nested" : ""} ${active === heading.id ? "active" : ""}`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default function DocsShell({
  groups,
  headings,
  children,
}: {
  groups: DocNavGroup[];
  headings: DocHeading[];
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const drawer = drawerRef.current;
    const focusable = () => Array.from(drawer?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), summary") ?? []);
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <div className="docs-shell">
      <button
        ref={menuButtonRef}
        className="docs-mobile-menu"
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-expanded={mobileOpen}
        aria-controls="docs-mobile-drawer"
      >
        <span aria-hidden="true">☰</span> Browse documentation
      </button>
      <aside className="docs-sidebar">
        <Sidebar groups={groups} />
      </aside>
      {mobileOpen && (
        <div className="docs-drawer-backdrop" role="presentation" onMouseDown={() => setMobileOpen(false)}>
          <aside
            ref={drawerRef}
            id="docs-mobile-drawer"
            className="docs-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Documentation navigation"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div>
              <strong>Documentation</strong>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close documentation navigation">
                ×
              </button>
            </div>
            <Sidebar groups={groups} close={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
      <main className="docs-main">{children}</main>
      <TableOfContents headings={headings} />
    </div>
  );
}
