"use client";

import { Children, isValidElement, ReactNode, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

function textContent(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) =>
      typeof child === "string"
        ? child
        : isValidElement<{ children?: ReactNode }>(child)
          ? textContent(child.props.children)
          : "",
    )
    .join("");
}

function CodeBlock({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const code = textContent(children).replace(/\n$/, "");
  return (
    <div className="docs-code-block">
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        }}
        aria-label="Copy code block"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre>{children}</pre>
    </div>
  );
}

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <article className="docs-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h2: ({ children, id }) => (
            <h2 id={id}>
              <a href={`#${id}`} aria-label={`Link to ${textContent(children)}`} className="heading-anchor">
                #
              </a>
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3 id={id}>
              <a href={`#${id}`} aria-label={`Link to ${textContent(children)}`} className="heading-anchor">
                #
              </a>
              {children}
            </h3>
          ),
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          blockquote: ({ children }) => {
            const label = textContent(children).trim();
            const kind = /^(Summary|Note|Important|Warning|Best Practice|Key Insight|Business Value):/i.exec(label)?.[1];
            return <blockquote className={kind ? `docs-callout docs-callout-${kind.toLowerCase().replace(/\s/g, "-")}` : ""}>{children}</blockquote>;
          },
          table: ({ children }) => (
            <div className="docs-table-wrap">
              <table>{children}</table>
            </div>
          ),
          a: ({ href = "", children }) => (
            <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
