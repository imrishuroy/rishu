import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/blog/PostCard'

export default function BlogPreview() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <section className="space-y-6 scroll-mt-24" id="blog">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <h2 className="text-headline-xl text-on-surface">Distributed Systems Blog</h2>
        </div>
        <Link
          href="/blogs"
          className="text-primary hover:underline text-label-sm flex items-center gap-1"
        >
          <span>Read All Architectural Notes</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
