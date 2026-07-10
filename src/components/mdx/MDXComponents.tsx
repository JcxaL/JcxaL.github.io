import Image from "next/image";
import { Link } from "next-view-transitions";
import { MDXComponents } from "mdx/types";
import ImageGallery from "./ImageGallery";
import ImageComparison from "./ImageComparison";

/**
 * MDX components for notice bodies (blog posts).
 * Typography (headings, prose, lists, quotes, code, tables) is styled by the
 * scoped .notice-prose rules in src/app/blog/[id]/page.tsx — token vars only.
 * Only elements that need React behaviour are overridden here.
 */
const components: MDXComponents = {
  // Custom components available inside MDX content
  ImageGallery,
  ImageComparison,

  // next/image with the house hairline-panel framing
  img: ({ src, alt, ...props }) => (
    <Image
      src={src || ""}
      alt={alt || ""}
      width={800}
      height={600}
      className="my-6"
      style={{
        width: "100%",
        height: "auto",
        border: "1px solid var(--color-ground-line)",
        borderRadius: "var(--layout-radius-plate)",
      }}
      {...props}
    />
  ),

  // Internal links route through next/link; external links open safely.
  a: ({ href, children, ...props }) => {
    if (href?.startsWith("http")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href || "#"} {...props}>
        {children}
      </Link>
    );
  },
};

export default components;
