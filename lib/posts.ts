import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const DEFAULT_POSTS_DIR = path.join(process.cwd(), 'content/blogs')

export type PostMeta = {
  slug: string
  title: string
  date: string | undefined
  tags: string[]
  summary: string
  readTime: number
  draft: boolean
}

export type Post = PostMeta & {
  content: string
}

export function getAllPosts(dir = DEFAULT_POSTS_DIR): PostMeta[] {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((file): PostMeta => {
    const slug = file.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
    const { data } = matter(raw)
    return {
      slug,
      title: data.title as string,
      date: data.date as string | undefined,
      tags: (data.tags as string[]) ?? [],
      summary: data.summary as string,
      readTime: Number(data.readTime) || 0,
      draft: Boolean(data.draft),
    }
  })

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : -Infinity
      const bTime = b.date ? new Date(b.date).getTime() : -Infinity
      return bTime - aTime
    })
}

export function getPostBySlug(slug: string, dir = DEFAULT_POSTS_DIR): Post | null {
  const filePath = path.join(dir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title as string,
    date: data.date as string | undefined,
    tags: (data.tags as string[]) ?? [],
    summary: data.summary as string,
    readTime: Number(data.readTime) || 0,
    draft: Boolean(data.draft),
    content,
  }
}
