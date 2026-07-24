import type { ReactNode } from "react";
import "./docs.css";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <div className="docs-centre">{children}</div>;
}

