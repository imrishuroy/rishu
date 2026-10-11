import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { safeIsoDate } from '@/lib/utils'
import PostHeader from '@/components/blog/PostHeader'
import MdxContent from '@/components/blog/MdxContent'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} – Rishu Kumar`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: safeIsoDate(post.date),
      tags: post.tags,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <PostHeader post={post} />
      <div className="mt-10">
        <MdxContent source={post.content} />
      </div>
    </div>
  )
}
