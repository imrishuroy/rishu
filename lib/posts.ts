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
  series?: string
  seriesOrder?: number
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
      series: data.series as string | undefined,
      seriesOrder: data.seriesOrder !== undefined ? Number(data.seriesOrder) : undefined,
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

  if (data.draft) return null

  return {
    slug,
    title: data.title as string,
    date: data.date as string | undefined,
    tags: (data.tags as string[]) ?? [],
    summary: data.summary as string,
    readTime: Number(data.readTime) || 0,
    draft: Boolean(data.draft),
    series: data.series as string | undefined,
    seriesOrder: data.seriesOrder !== undefined ? Number(data.seriesOrder) : undefined,
    content,
  }
}

export function getSeriesPosts(seriesSlug: string, dir = DEFAULT_POSTS_DIR): PostMeta[] {
  return getAllPosts(dir)
    .filter((p) => p.series === seriesSlug)
    .sort((a, b) => {
      const aOrder = a.seriesOrder ?? Infinity
      const bOrder = b.seriesOrder ?? Infinity
      return aOrder - bOrder
    })
}

export function getAdjacentSeriesPosts(
  slug: string,
  dir = DEFAULT_POSTS_DIR,
): { prev: PostMeta | null; next: PostMeta | null } {
  const all = getAllPosts(dir)
  const post = all.find((p) => p.slug === slug)
  if (!post?.series) return { prev: null, next: null }

  const seriesPosts = getSeriesPosts(post.series, dir)
  const index = seriesPosts.findIndex((p) => p.slug === slug)
  if (index === -1) return { prev: null, next: null }

  return {
    prev: index > 0 ? seriesPosts[index - 1] : null,
    next: index < seriesPosts.length - 1 ? seriesPosts[index + 1] : null,
  }
}
