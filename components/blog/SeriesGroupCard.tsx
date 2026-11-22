import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

interface SeriesGroupCardProps {
  seriesSlug: string
  posts: PostMeta[]
  // Optional overrides for pinned series shown before any chapters are published.
  title?: string
  description?: string
  totalChapters?: number
}

function toDisplayName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function SeriesGroupCard({
  seriesSlug,
  posts,
  title,
  description,
  totalChapters,
}: SeriesGroupCardProps) {
  const displayName = title ?? toDisplayName(seriesSlug)
  const displayDescription = description ?? posts[0]?.summary
  const publishedCount = posts.length
  const chapterLabel = totalChapters
    ? `${publishedCount} of ${totalChapters} chapters published`
    : `${publishedCount} ${publishedCount === 1 ? 'chapter' : 'chapters'}`

  return (
    <div className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-outline-variant/20">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-primary text-label-sm uppercase tracking-wider font-mono">
            <span className="material-symbols-outlined text-base">menu_book</span>
            <span>Series</span>
          </div>
          <span className="text-xs text-on-surface-variant font-mono shrink-0">{chapterLabel}</span>
        </div>

        <h2 className="text-headline-md text-on-surface font-semibold mb-2">{displayName}</h2>

        {displayDescription && (
          <p className="text-body-sm text-on-surface-variant line-clamp-2">{displayDescription}</p>
        )}

        <Link
          href={`/blogs/${seriesSlug}`}
          className="inline-flex items-center gap-1.5 mt-4 text-label-sm text-primary hover:opacity-80 transition-opacity"
        >
          <span>{publishedCount > 0 ? 'Start reading' : 'View chapters'}</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      {/* Published chapter list */}
      {posts.length > 0 && (
        <ul className="divide-y divide-outline-variant/20">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blogs/${post.slug}`}
                className="group flex items-center gap-3 px-6 py-3 hover:bg-surface-container-high transition-colors"
              >
                {post.seriesOrder !== undefined && (
                  <span className="text-xs text-outline font-mono w-6 shrink-0 text-right">
                    {post.seriesOrder}
                  </span>
                )}
                <span className="text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors truncate flex-1">
                  {post.title}
                </span>
                {post.readTime > 0 && (
                  <span className="text-xs text-outline font-mono shrink-0">{post.readTime} min</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
