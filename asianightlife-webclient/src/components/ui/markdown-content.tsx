"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const markdownComponents: Components = {
  a: ({ href, children }) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className="text-primary font-medium hover:underline underline-offset-4">
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary font-medium hover:underline underline-offset-4"
      >
        {children}
      </a>
    );
  },
  table: ({ children }) => (
    <div className="not-prose my-8 overflow-x-auto rounded-xl border border-border/60 shadow-sm">
      <table className="w-full min-w-[480px] border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-secondary/60 border-b border-border">{children}</thead>
  ),
  tbody: ({ children }) => <tbody className="divide-y divide-border/50">{children}</tbody>,
  tr: ({ children }) => (
    <tr className="transition-colors hover:bg-secondary/20 even:bg-secondary/10">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3.5 text-left font-semibold text-foreground whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3.5 text-muted-foreground align-top leading-relaxed">{children}</td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="not-prose my-6 border-l-4 border-primary/50 bg-secondary/20 rounded-r-lg px-5 py-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-border/60" />,
  ul: ({ children }) => (
    <ul className="my-4 space-y-2 list-disc pl-6 marker:text-primary/70">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 space-y-2 list-decimal pl-6 marker:text-primary/70">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
  h2: ({ children }) => (
    <h2 className="not-prose text-2xl font-bold font-headline mt-10 mb-4 text-foreground scroll-mt-24">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="not-prose text-xl font-semibold font-headline mt-8 mb-3 text-foreground scroll-mt-24">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="my-4 leading-relaxed text-foreground/90">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
};

type MarkdownContentProps = {
  children: string;
  className?: string;
};

export function MarkdownContent({ children, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none prose-headings:font-headline prose-a:text-primary",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
