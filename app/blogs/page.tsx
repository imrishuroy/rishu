import type { Metadata } from 'next'
import { getAllPosts, getSeriesPosts } from '@/lib/posts'
import PostCard from '@/components/blog/PostCard'
import SeriesGroupCard from '@/components/blog/SeriesGroupCard'

export const metadata: Metadata = {
  title: 'Blog – Rishu Kumar | Distributed Systems & Go Engineering',
  description: 'Architecture notes, deep dives, and engineering writing on Go, Kafka, distributed systems, and observability.',
}

// Series that always appear on this page, even before any chapters are published.
const PINNED_SERIES = [
  {
    slug: 'distributed-systems',
    title: 'Distributed Systems for Backend Engineers',
    description:
      'A 26-chapter deep dive into distributed systems concepts, with runnable Go implementations, Mermaid diagrams, real production system examples, and system design interview prep.',
    totalChapters: 26,
  },
]

export default function BlogsPage() {
  const allPosts = getAllPosts()
  const standalonePosts = allPosts.filter((p) => !p.series)

  // Merge pinned series with any dynamically detected ones not already pinned.
  const pinnedSlugs = new Set(PINNED_SERIES.map((s) => s.slug))
  const dynamicSlugs = [...new Set(allPosts.filter((p) => p.series && !pinnedSlugs.has(p.series)).map((p) => p.series!))]

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
          {standalonePosts.length > 0
            ? `${standalonePosts.length} ${standalonePosts.length === 1 ? 'post' : 'posts'} published`
            : null}
        </div>
      </div>

      <div className="space-y-10">
        {/* Pinned series */}
        <div className="space-y-6">
          {PINNED_SERIES.map((series) => (
            <SeriesGroupCard
              key={series.slug}
              seriesSlug={series.slug}
              title={series.title}
              description={series.description}
              totalChapters={series.totalChapters}
              posts={getSeriesPosts(series.slug)}
            />
          ))}

          {/* Any additional dynamically detected series */}
          {dynamicSlugs.map((seriesSlug) => (
            <SeriesGroupCard
              key={seriesSlug}
              seriesSlug={seriesSlug}
              posts={getSeriesPosts(seriesSlug)}
            />
          ))}
        </div>

        {/* Standalone posts */}
        {standalonePosts.length > 0 && (
          <div>
            <h2 className="text-label-sm text-on-surface-variant font-mono uppercase tracking-wider mb-6">
              Standalone Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standalonePosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
