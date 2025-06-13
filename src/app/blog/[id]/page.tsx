import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getAllSlugs } from '@/lib/mdx';
import MDXComponents from '@/components/mdx/MDXComponents';

// Generate metadata dynamically based on the post
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const post = getPostBySlug(id, 'blog');
    return {
      title: `${post.title} | JccL`,
      description: post.excerpt,
      keywords: post.tags.join(', '),
    };
  } catch {
    return {
      title: 'Post Not Found | JccL',
      description: 'The requested blog post could not be found.'
    };
  }
}

// Generate static paths for all blog posts (optional, for static generation)
export async function generateStaticParams() {
  const slugs = getAllSlugs('blog');
  return slugs.map((slug) => ({
    id: slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let post;
  try {
    post = getPostBySlug(id, 'blog');
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] pt-24">
      <main className="max-w-4xl mx-auto">
        {/* Back to blog link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Blog
          </Link>
        </div>

        {/* Article header */}
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span>By {post.author}</span>
            <span>•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article content */}
        <article className="prose prose-lg prose-gray dark:prose-invert max-w-none">
          <MDXRemote source={post.content} components={MDXComponents} />
        </article>

        {/* Article footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Written by <strong>{post.author}</strong>
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/blog"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                More Posts
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
} 