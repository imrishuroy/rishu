import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { PostMeta } from '@/lib/posts'

interface PostHeaderProps {
  post: PostMeta
}

export default function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="space-y-6 pb-8 border-b border-outline-variant/30">
      {/* Back link */}
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary text-label-sm transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span>All posts</span>
      </Link>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded bg-surface-container-high border border-primary/20 text-primary font-mono text-xs"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-headline-xl lg:text-display tracking-tight text-on-surface">
        {post.title}
      </h1>

      {/* Summary */}
      <p className="text-body-lg text-on-surface-variant max-w-3xl">{post.summary}</p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-label-sm text-on-surface-variant font-mono">
        <span>{post.date ? formatDate(post.date) : '—'}</span>
        {post.readTime > 0 && (
          <>
            <span className="text-outline">·</span>
            <span>{post.readTime} min read</span>
          </>
        )}
      </div>
    </header>
  )
}
