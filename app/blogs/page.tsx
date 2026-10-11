import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/blog/PostCard'

export const metadata: Metadata = {
  title: 'Blog – Rishu Kumar | Distributed Systems & Go Engineering',
  description: 'Architecture notes, deep dives, and engineering writing on Go, Kafka, distributed systems, and observability.',
}

export default function BlogsPage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="space-y-4 pb-10 border-b border-outline-variant/30 mb-10">
        <div className="flex items-center gap-2 text-primary text-label-sm uppercase tracking-wider">
          <span className="material-symbols-outlined text-base">menu_book</span>
          <span>Engineering Writing</span>
        </div>
        <h1 className="text-headline-xl lg:text-display tracking-tight text-on-surface">
          Distributed Systems Blog
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          Architecture notes, implementation deep-dives, and lessons from building high-throughput systems with Go, Kafka, and AWS.
        </p>
        <div className="text-label-sm text-on-surface-variant font-mono">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
        </div>
      </div>

      {/* Post grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant font-mono text-body-sm">
          <span className="material-symbols-outlined text-4xl text-outline mb-4 block">pending</span>
          First post coming soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
