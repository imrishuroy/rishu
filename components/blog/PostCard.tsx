import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { PostMeta } from '@/lib/posts'

interface PostCardProps {
  post: PostMeta
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group p-6 rounded-xl bg-surface-container border border-outline-variant/40 hover:border-primary/40 transition-all flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Tags + read time */}
        <div className="flex items-center justify-between text-xs font-mono text-outline">
          <div className="flex items-center gap-2 flex-wrap">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 text-on-surface-variant"
              >
                {tag}
              </span>
            ))}
          </div>
          {post.readTime > 0 && <span>{post.readTime} min read</span>}
        </div>

        {/* Title */}
        <h3 className="text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Summary */}
        <p className="text-body-sm text-on-surface-variant line-clamp-3">
          {post.summary}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant font-mono">{post.date ? formatDate(post.date) : '—'}</span>
        <div className="flex items-center gap-1 text-xs text-primary text-label-sm">
          <span>Read Architecture Note</span>
          <span className="material-symbols-outlined text-sm">arrow_outward</span>
        </div>
      </div>
    </Link>
  )
}
