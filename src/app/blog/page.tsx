import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getAllPosts } from "@/lib/mdx";

/**
 * Notices — the notice board (blog index).
 * System voice throughout; each post is pinned to the board as a numbered
 * service notice. No JS motion here — the shared .jccl-lift hover is enough.
 */

export const metadata: Metadata = {
  title: "Notices",
  description:
    "Service notices, engineering works and posts from the operator of The JccL Line.",
};

export default function Notices() {
  const posts = getAllPosts("blog");

  return (
    <div className="mx-auto max-w-3xl px-6 pt-14 pb-16">
      {/* ---- Board header ---- */}
      <header>
        <p className="jccl-kicker">The JccL Line · Notice board</p>
        <h1 className="jccl-signage mt-5 text-4xl sm:text-5xl">Notices</h1>
        <div
          aria-hidden="true"
          className="mt-6 h-1.5 w-24"
          style={{ backgroundColor: "var(--color-board-amber)" }}
        />
        <p
          className="jccl-measure mt-6 text-lg leading-relaxed"
          style={{ color: "var(--color-ink-muted)" }}
        >
          Service notices, engineering works and posts from the operator.
        </p>
      </header>

      {/* ---- Posted notices ---- */}
      <section aria-label="Posted notices" className="mt-12">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2 className="jccl-signage text-xl">Currently posted</h2>
          <p className="jccl-telemetry">
            {String(posts.length).padStart(2, "0")}{" "}
            {posts.length === 1 ? "NOTICE" : "NOTICES"} · ALL CURRENT
          </p>
        </div>

        <div className="space-y-5">
          {posts.map((post, index) => {
            // Notice numbers are chronological: the oldest posting is 01.
            const noticeNumber = String(posts.length - index).padStart(2, "0");
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}/`}
                className="jccl-panel jccl-lift block p-6 sm:p-7"
              >
                <p className="jccl-telemetry">
                  NOTICE {noticeNumber} · {post.date} ·{" "}
                  {post.readTime.toUpperCase()}
                </p>
                <h3
                  className="mt-3 text-xl leading-snug font-bold sm:text-2xl"
                  style={{
                    fontFamily: "var(--font-stack-signage)",
                    color: "var(--color-ink-signage)",
                  }}
                >
                  {post.title}
                </h3>
                <p
                  className="mt-2 leading-relaxed"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  {post.excerpt}
                </p>
                {post.tags.length > 0 && (
                  <ul
                    aria-label="Filed under"
                    className="mt-5 flex flex-wrap gap-2"
                  >
                    {post.tags.map((tag) => (
                      <li
                        key={tag}
                        className="jccl-telemetry border px-2.5 py-1 uppercase"
                        style={{
                          borderColor: "var(--color-ground-line)",
                          borderRadius: "var(--layout-radius-pill)",
                          fontSize: "0.6875rem",
                        }}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---- Board foot line ---- */}
      <p className="jccl-telemetry mt-10">
        END OF NOTICES · NEW NOTICES ARE POSTED AS THE SERVICE REQUIRES
      </p>
    </div>
  );
}
