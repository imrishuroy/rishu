import type { Metadata } from 'next'
import Link from 'next/link'
import { getSeriesPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Distributed Systems for Backend Engineers – Rishu Kumar',
  description:
    'A 26-chapter series covering distributed systems concepts, Go implementations, and system design interview prep.',
}

const CHAPTERS = [
  { order: 1,  title: 'Distributed Systems Fundamentals',       slug: 'ds-01-fundamentals' },
  { order: 2,  title: 'Distributed Communication',              slug: 'ds-02-communication' },
  { order: 3,  title: 'Consistency and Replication',            slug: 'ds-03-consistency' },
  { order: 4,  title: 'Distributed Transactions',               slug: 'ds-04-transactions' },
  { order: 5,  title: 'Messaging and Event-Driven Systems',     slug: 'ds-05-messaging' },
  { order: 6,  title: 'Distributed Coordination',               slug: 'ds-06-coordination' },
  { order: 7,  title: 'Distributed Storage and Databases',      slug: 'ds-07-storage' },
  { order: 8,  title: 'Distributed Caching',                    slug: 'ds-08-caching' },
  { order: 9,  title: 'Reliability and Resilience Engineering', slug: 'ds-09-reliability' },
  { order: 10, title: 'Advanced Distributed Systems',           slug: 'ds-10-advanced' },
  { order: 11, title: 'Time in Distributed Systems',            slug: 'ds-11-time' },
  { order: 12, title: 'Real-time Communication Patterns',       slug: 'ds-12-realtime' },
  { order: 13, title: 'CDN and DNS',                            slug: 'ds-13-cdn-dns' },
  { order: 14, title: 'Probabilistic Data Structures',          slug: 'ds-14-probabilistic' },
  { order: 15, title: 'API Design Patterns',                    slug: 'ds-15-api-design' },
  { order: 16, title: 'Deployment and Operational Patterns',    slug: 'ds-16-deployment' },
  { order: 17, title: 'Back-of-Envelope Calculations',          slug: 'ds-17-estimation' },
  { order: 18, title: 'Key Jargon Reference',                   slug: 'ds-18-jargon' },
  { order: 19, title: 'Serialization and Schema Evolution',     slug: 'ds-19-serialization' },
  { order: 20, title: 'Security in Distributed Systems',        slug: 'ds-20-security' },
  { order: 21, title: 'Task Queues and Job Scheduling',         slug: 'ds-21-task-queues' },
  { order: 22, title: 'Search Systems',                         slug: 'ds-22-search' },
  { order: 23, title: 'Microservices Patterns',                 slug: 'ds-23-microservices' },
  { order: 24, title: 'Service Mesh',                           slug: 'ds-24-service-mesh' },
  { order: 25, title: 'Networking Fundamentals',                slug: 'ds-25-networking' },
  { order: 26, title: 'Popular Interview Questions',            slug: 'ds-26-interview-questions' },
]

export default function DistributedSystemsSeriesPage() {
  const published = getSeriesPosts('distributed-systems')
  const publishedSlugs = new Set(published.map((p) => p.slug))
  const publishedCount = published.length

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Back */}
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary text-label-sm transition-colors mb-8"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span>All posts</span>
      </Link>

      {/* Header */}
      <div className="space-y-4 pb-10 border-b border-outline-variant/30 mb-10">
        <div className="flex items-center gap-2 text-primary text-label-sm uppercase tracking-wider">
          <span className="material-symbols-outlined text-base">menu_book</span>
          <span>Series</span>
        </div>
        <h1 className="text-headline-xl lg:text-display tracking-tight text-on-surface">
          Distributed Systems for Backend Engineers
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          A 26-chapter deep dive into distributed systems concepts, with runnable Go implementations,
          Mermaid diagrams, real production system examples, and system design interview prep.
        </p>
        <div className="flex items-center gap-4 text-label-sm text-on-surface-variant font-mono">
          <span>26 chapters</span>
          <span className="text-outline">·</span>
          <span className="text-tertiary">
            {publishedCount} published
          </span>
        </div>
      </div>

      {/* Chapter list */}
      <ol className="space-y-2">
        {CHAPTERS.map((chapter) => {
          const isPublished = publishedSlugs.has(chapter.slug)
          const publishedPost = published.find((p) => p.slug === chapter.slug)

          return (
            <li key={chapter.slug}>
              {isPublished ? (
                <Link
                  href={`/blogs/${chapter.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-outline-variant/40 hover:border-primary/40 transition-all"
                >
                  <span className="text-xs text-outline font-mono w-6 shrink-0 text-right">
                    {chapter.order}
                  </span>
                  <span className="flex-1 text-body-md text-on-surface group-hover:text-primary transition-colors">
                    {chapter.title}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    {publishedPost && publishedPost.readTime > 0 && (
                      <span className="text-xs text-outline font-mono hidden sm:block">
                        {publishedPost.readTime} min
                      </span>
                    )}
                    <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                      arrow_forward
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/20 opacity-50">
                  <span className="text-xs text-outline font-mono w-6 shrink-0 text-right">
                    {chapter.order}
                  </span>
                  <span className="flex-1 text-body-md text-on-surface-variant">
                    {chapter.title}
                  </span>
                  <span className="text-xs text-outline font-mono shrink-0">Coming soon</span>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
