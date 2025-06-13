import Image from 'next/image'
import Link from 'next/link'
import { MDXComponents } from 'mdx/types'
import ImageGallery from './ImageGallery'
import ImageComparison from './ImageComparison'

// Custom MDX components
const components: MDXComponents = {
  // Custom components
  ImageGallery,
  ImageComparison,
  
  // Enhanced Next.js Image component
  img: ({ src, alt, ...props }) => (
    <Image
      src={src || ''}
      alt={alt || ''}
      width={800}
      height={600}
      className="rounded-lg shadow-lg my-6"
      style={{ width: '100%', height: 'auto' }}
      {...props}
    />
  ),
  
  // Enhanced Link component
  a: ({ href, children, ...props }) => {
    if (href?.startsWith('http')) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
          {...props}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href || '#'} className="text-blue-600 hover:text-blue-800 underline" {...props}>
        {children}
      </Link>
    )
  },
  
  // Typography enhancements
  h1: ({ children, ...props }) => (
    <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8" {...props}>
      {children}
    </h1>
  ),
  
  h2: ({ children, ...props }) => (
    <h2 className="text-3xl font-semibold text-gray-800 mb-4 mt-8" {...props}>
      {children}
    </h2>
  ),
  
  h3: ({ children, ...props }) => (
    <h3 className="text-2xl font-medium text-gray-800 mb-3 mt-6" {...props}>
      {children}
    </h3>
  ),
  
  p: ({ children, ...props }) => (
    <p className="text-gray-700 leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),
  
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2" {...props}>
      {children}
    </ul>
  ),
  
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2" {...props}>
      {children}
    </ol>
  ),
  
  li: ({ children, ...props }) => (
    <li className="text-gray-700" {...props}>
      {children}
    </li>
  ),
  
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6" {...props}>
      {children}
    </blockquote>
  ),
  
  code: ({ children, ...props }) => (
    <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  ),
  
  pre: ({ children, ...props }) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6" {...props}>
      {children}
    </pre>
  ),
}

export default components 