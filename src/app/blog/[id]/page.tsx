import type { Metadata } from "next";
import type { ComponentPropsWithoutRef } from "react";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getPostBySlug, getAllSlugs } from "@/lib/mdx";
import MDXComponents from "@/components/mdx/MDXComponents";

/* Code blocks are lit boards: pinning the night palette keeps the amber/jade
   syntax colours legible on the pale day-service paper (they'd fail on it
   otherwise). Merges any hljs class rehype adds. */
function LitPre({ className, ...props }: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      className={className ? `jccl-lit-board ${className}` : "jccl-lit-board"}
      {...props}
    />
  );
}

/**
 * Service notice — a single posting from the notice board (blog post).
 * Chrome is system voice; the article body is the operator's own prose.
 * Typography is scoped under .notice-prose below — token vars only.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const post = getPostBySlug(id, "blog");
    return {
      title: post.title,
      description: post.excerpt,
      keywords: post.tags.join(", "),
    };
  } catch {
    return {
      title: "Notice not found",
      description:
        "The requested notice is not posted on this board. Please check the notice number and try again.",
    };
  }
}

export async function generateStaticParams() {
  const slugs = getAllSlugs("blog");
  return slugs.map((slug) => ({
    id: slug,
  }));
}

/* Notice-body typography. Token vars only (CLAUDE.md rule 1); authored
   no-motion-first — the only transitions live inside the reduced-motion
   media query. The .hljs-* rules give rehype-highlight a small board
   palette instead of an imported theme. */
const NOTICE_PROSE_CSS = `
.notice-prose {
  color: var(--color-ink-muted);
  font-size: 1.05rem;
  line-height: 1.7;
}
.notice-prose h2,
.notice-prose h3 {
  font-family: var(--font-stack-signage);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.01em;
  color: var(--color-ink-signage);
}
.notice-prose h2 {
  font-size: 1.5rem;
  margin: 2.5rem 0 0.875rem;
}
.notice-prose h3 {
  font-size: 1.1875rem;
  margin: 2rem 0 0.75rem;
}
.notice-prose p {
  margin: 0 0 1.25rem;
}
.notice-prose strong {
  color: var(--color-ink-signage);
  font-weight: 600;
}
.notice-prose a {
  color: var(--color-ink-signage);
  text-decoration: underline;
  text-decoration-color: var(--color-accent-base);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}
.notice-prose a:hover {
  color: var(--color-accent-base);
}
.notice-prose ul,
.notice-prose ol {
  margin: 0 0 1.25rem;
  padding-left: 1.375rem;
}
.notice-prose ul { list-style: disc; }
.notice-prose ol { list-style: decimal; }
.notice-prose li { margin-bottom: 0.5rem; }
.notice-prose li::marker { color: var(--color-ink-faint); }
.notice-prose blockquote {
  border-left: 3px solid var(--color-board-amber);
  margin: 1.75rem 0;
  padding: 0.25rem 0 0.25rem 1.25rem;
  font-style: italic;
}
.notice-prose hr {
  border: 0;
  border-top: 1px solid var(--color-ground-line);
  margin: 2.5rem 0;
}
.notice-prose code {
  font-family: var(--font-stack-mono);
  font-size: 0.875em;
  color: var(--color-ink-signage);
  background: var(--color-ground-1);
  border: 1px solid var(--color-ground-line);
  border-radius: var(--layout-radius-plate);
  padding: 0.125rem 0.375rem;
}
.notice-prose pre {
  background: var(--color-ground-1);
  border: 1px solid var(--color-ground-line);
  border-radius: var(--layout-radius-plate);
  margin: 1.75rem 0;
  padding: 1rem 1.25rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.65;
}
.notice-prose pre code {
  background: none;
  border: 0;
  border-radius: 0;
  padding: 0;
  font-size: inherit;
  color: var(--color-ink-signage);
}
.notice-prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.75rem 0;
  font-size: 0.9375rem;
}
.notice-prose th {
  font-family: var(--font-stack-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 400;
  text-align: left;
  color: var(--color-ink-muted);
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--color-ground-line);
}
.notice-prose td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--color-ground-line);
  vertical-align: top;
}
/* Board palette for rehype-highlight (small set, token vars only). */
.notice-prose .hljs-keyword,
.notice-prose .hljs-built_in,
.notice-prose .hljs-type,
.notice-prose .hljs-tag,
.notice-prose .hljs-name,
.notice-prose .hljs-selector-tag {
  color: var(--color-board-amber);
}
.notice-prose .hljs-string,
.notice-prose .hljs-attr,
.notice-prose .hljs-attribute,
.notice-prose .hljs-regexp,
.notice-prose .hljs-addition {
  color: var(--color-status-visited);
}
.notice-prose .hljs-comment,
.notice-prose .hljs-quote,
.notice-prose .hljs-meta,
.notice-prose .hljs-deletion {
  color: var(--color-ink-faint);
}
.notice-prose .hljs-number,
.notice-prose .hljs-literal,
.notice-prose .hljs-symbol,
.notice-prose .hljs-variable {
  color: var(--color-status-planning);
}
.notice-prose .hljs-title,
.notice-prose .hljs-section,
.notice-prose .hljs-selector-class,
.notice-prose .hljs-selector-id {
  color: var(--color-ink-signage);
}
.notice-return {
  font-family: var(--font-stack-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}
.notice-return:hover {
  color: var(--color-accent-base);
}
@media (prefers-reduced-motion: no-preference) {
  .notice-prose a,
  .notice-return {
    transition: color var(--motion-duration-card-hover)
      var(--motion-easing-standard);
  }
}
`;

export default async function ServiceNotice({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post;
  try {
    post = getPostBySlug(id, "blog");
  } catch {
    notFound();
  }

  const tagsLine = post.tags.map((tag) => tag.toUpperCase()).join(" · ");

  return (
    <div className="mx-auto max-w-3xl px-6 pt-14 pb-16">
      <style>{NOTICE_PROSE_CSS}</style>

      {/* ---- Notice header ---- */}
      <header>
        <p className="jccl-kicker">Service notice · {post.date}</p>
        <h1
          className="mt-5 text-3xl leading-tight font-bold sm:text-4xl"
          style={{
            fontFamily: "var(--font-stack-signage)",
            color: "var(--color-ink-signage)",
            letterSpacing: "0.01em",
          }}
        >
          {post.title}
        </h1>
        <p className="jccl-telemetry mt-4">
          {post.readTime.toUpperCase()}
          {tagsLine ? ` · ${tagsLine}` : ""}
        </p>
        <div
          aria-hidden="true"
          className="mt-6 h-1.5 w-24"
          style={{ backgroundColor: "var(--color-board-amber)" }}
        />
      </header>

      {/* ---- Notice body ---- */}
      <article className="notice-prose jccl-measure mt-10">
        <MDXRemote
          source={post.content}
          components={{ ...MDXComponents, pre: LitPre }}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight],
            },
          }}
        />
      </article>

      {/* ---- Return to the board ---- */}
      <footer
        className="mt-14 border-t pt-6"
        style={{ borderColor: "var(--color-ground-line)" }}
      >
        <Link href="/blog/" className="notice-return">
          ← All notices
        </Link>
      </footer>
    </div>
  );
}
