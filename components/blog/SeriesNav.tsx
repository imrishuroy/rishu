import Link from 'next/link'
import { getAdjacentSeriesPosts } from '@/lib/posts'

interface SeriesNavProps {
  currentSlug: string
  series: string
  order?: number
  totalInSeries: number
}

export default function SeriesNav({ currentSlug, series, order, totalInSeries }: SeriesNavProps) {
  const { prev, next } = getAdjacentSeriesPosts(currentSlug)

  return (
    <div className="mt-16 pt-8 border-t border-outline-variant/30">
      <div className="flex items-center justify-between mb-6 text-label-sm text-on-surface-variant font-mono">
        <Link
          href={`/blogs/${series}`}
          className="hover:text-primary transition-colors"
        >
          {series
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')}{' '}
          Series
        </Link>
        {order !== undefined && (
          <span>
            Chapter {order} of {totalInSeries}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          {prev && (
            <Link
              href={`/blogs/${prev.slug}`}
              className="group flex items-start gap-2 p-4 rounded-xl border border-outline-variant/40 hover:border-primary/40 transition-all"
            >
              <span className="material-symbols-outlined text-sm mt-0.5 text-on-surface-variant group-hover:text-primary transition-colors shrink-0">
                arrow_back
              </span>
              <div className="min-w-0">
                <div className="text-xs text-on-surface-variant font-mono mb-1">Previous</div>
                <div className="text-label-md text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                  {prev.title}
                </div>
              </div>
            </Link>
          )}
        </div>

        <div className="flex justify-end">
          {next && (
            <Link
              href={`/blogs/${next.slug}`}
              className="group flex items-start gap-2 p-4 rounded-xl border border-outline-variant/40 hover:border-primary/40 transition-all text-right w-full"
            >
              <div className="min-w-0 flex-1">
                <div className="text-xs text-on-surface-variant font-mono mb-1">Next</div>
                <div className="text-label-md text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                  {next.title}
                </div>
              </div>
              <span className="material-symbols-outlined text-sm mt-0.5 text-on-surface-variant group-hover:text-primary transition-colors shrink-0">
                arrow_forward
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
