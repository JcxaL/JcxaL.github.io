import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'src/content')

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  author: string
  content: string
}

export interface ContentItem {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  content: string
  category: 'blog' | 'travel' | 'photography' | 'music' | 'design'
}

export function getAllPosts(category: string = 'blog'): BlogPost[] {
  const categoryPath = path.join(contentDirectory, category)
  
  if (!fs.existsSync(categoryPath)) {
    return []
  }
  
  const fileNames = fs.readdirSync(categoryPath)
  const posts = fileNames
    .filter(name => name.endsWith('.mdx'))
    .map(name => {
      const slug = name.replace(/\.mdx$/, '')
      return getPostBySlug(slug, category)
    })
    .filter(Boolean)
    .sort((a, b) => (a.date > b.date ? -1 : 1))

  return posts
}

export function getPostBySlug(slug: string, category: string = 'blog'): BlogPost {
  const filePath = path.join(contentDirectory, category, `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Post not found: ${slug}`)
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  
  return {
    slug,
    title: data.title || 'Untitled',
    excerpt: data.excerpt || '',
    date: data.date || new Date().toISOString(),
    readTime: data.readTime || '5 min read',
    tags: data.tags || [],
    author: data.author || 'JccL',
    content,
  }
}

export function getAllSlugs(category: string = 'blog'): string[] {
  const categoryPath = path.join(contentDirectory, category)
  
  if (!fs.existsSync(categoryPath)) {
    return []
  }
  
  const fileNames = fs.readdirSync(categoryPath)
  return fileNames
    .filter(name => name.endsWith('.mdx'))
    .map(name => name.replace(/\.mdx$/, ''))
}

export function getPostsByTag(tag: string, category: string = 'blog'): BlogPost[] {
  const allPosts = getAllPosts(category)
  return allPosts.filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

// Calculate estimated reading time
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
} 