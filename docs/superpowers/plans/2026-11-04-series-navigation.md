# Series Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add series support to the blog so the distributed systems series reads like a book, with chapter badges, prev/next navigation, grouped listing on /blogs, and a series table of contents page.

**Architecture:** Extend `PostMeta` with `series` and `seriesOrder` fields, add two helper functions to `lib/posts.ts`, then build three new components (`SeriesBadge`, `SeriesNav`, `SeriesGroupCard`) and wire them into the existing pages. The series landing page is a static route at `/blogs/distributed-systems` that lists all 26 chapters.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS (existing design tokens only), Vitest.

**Spec:** `docs/superpowers/specs/2026-11-04-distributed-systems-series-design.md`

## Global Constraints

- No em-dashes anywhere: no `--`, `---`, or unicode em-dash character. Use commas or colons instead.
- Use only existing Tailwind design tokens from `tailwind.config.ts`. No arbitrary hex values.
- `PostMeta.date` is `string | undefined`. Always guard with `post.date ?` before use.
- `PostMeta.readTime` may be `0`. Guard with `post.readTime > 0` before rendering.
- No new npm dependencies.
- Do not change Tailwind color tokens.
- Do not modify `public/resume.pdf` or any content that must match the actual resume.

## Review Focus

- A post with `series` set but `seriesOrder` missing: `getAdjacentSeriesPosts` and `SeriesNav` must handle `seriesOrder` being `undefined` without crashing, treating it as unordered.
- The `/blogs/distributed-systems` static route must take priority over the `[slug]` dynamic route. Next.js does this automatically, but verify the build produces the right page.
- `SeriesNav` calls `getAllPosts()` on every series post render. This is called at build time (static generation), so it is fine. Confirm it is not called in a client component.
- When zero series chapters are published, the `/blogs/distributed-systems` page must render the "coming soon" state without crashing on an empty array.
- `PostCard` footer currently reads "Read Architecture Note" for all posts. For series posts it should read "Read Chapter N" using `seriesOrder`.

---

### Task 1: Extend `lib/posts.ts` with series fields and helpers

**Files:**
- Modify: `lib/posts.ts`
- Test: `lib/__tests__/posts.test.ts` (create)

**Interfaces:**
- Produces:
  - `PostMeta.series?: string`
  - `PostMeta.seriesOrder?: number`
  - `getAllPosts()` returns these fields populated when present in frontmatter
  - `getPostBySlug()` returns these fields populated when present in frontmatter
  - `getSeriesPosts(seriesSlug: string): PostMeta[]` returns all non-draft posts in that series, sorted ascending by `seriesOrder` (posts without `seriesOrder` go last)
  - `getAdjacentSeriesPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null }` returns the previous and next chapter by `seriesOrder`, or `null` if at the boundary or if the post is not in a series

- [ ] **Step 1: Create the test file with failing tests**

```typescript
// lib/__tests__/posts.test.ts
import { describe, it, expect } from 'vitest'
import { getSeriesPosts, getAdjacentSeriesPosts } from '../posts'

describe('getSeriesPosts', () => {
  it('returns empty array when no posts match the series slug', () => {
    const result = getSeriesPosts('nonexistent-series')
    expect(result).toEqual([])
  })
})

describe('getAdjacentSeriesPosts', () => {
  it('returns null for both when slug is not in any series', () => {
    // Use a real published post slug that is not in a series
    const result = getAdjacentSeriesPosts('go-worker-pool')
    expect(result).toEqual({ prev: null, next: null })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test lib/__tests__/posts.test.ts`
Expected: FAIL — `getSeriesPosts` and `getAdjacentSeriesPosts` are not exported

- [ ] **Step 3: Add `series` and `seriesOrder` to `PostMeta` type**

In `lib/posts.ts`, add to the `PostMeta` type:
```typescript
series?: string
seriesOrder?: number
```

- [ ] **Step 4: Update `getAllPosts()` to read series fields from frontmatter**

In the `files.map()` callback inside `getAllPosts()`, add:
```typescript
series: data.series as string | undefined,
seriesOrder: data.seriesOrder !== undefined ? Number(data.seriesOrder) : undefined,
```

- [ ] **Step 5: Update `getPostBySlug()` to read series fields from frontmatter**

Same two lines in the returned object inside `getPostBySlug()`.

- [ ] **Step 6: Implement `getSeriesPosts(seriesSlug: string): PostMeta[]`**

Export a new function. It calls `getAllPosts()`, filters by `post.series === seriesSlug`, then sorts ascending by `seriesOrder` with posts lacking `seriesOrder` placed last.

- [ ] **Step 7: Implement `getAdjacentSeriesPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null }`**

Export a new function. It finds the post by slug in `getAllPosts()`. If the post has no `series`, return `{ prev: null, next: null }`. Otherwise call `getSeriesPosts(post.series)`, find the current post's index, and return the items at `index - 1` and `index + 1`, or `null` at boundaries.

- [ ] **Step 8: Run tests to verify they pass**

Run: `npm test lib/__tests__/posts.test.ts`
Expected: PASS

- [ ] **Step 9: Run full test suite**

Run: `npm test`
Expected: all tests pass

---

### Task 2: `SeriesBadge` component

**Files:**
- Create: `components/blog/SeriesBadge.tsx`

**Interfaces:**
- Consumes: `Badge` from `components/ui/Badge.tsx`, `PostMeta.series`, `PostMeta.seriesOrder`
- Produces: `SeriesBadge({ series: string; order?: number }): JSX.Element`
  - Renders a cyan (`primary` variant) `Badge` reading "Part {order} · Distributed Systems" when `order` is set, or "Distributed Systems Series" when it is not.
  - The series display name is derived by converting the series slug to title case: `"distributed-systems"` becomes `"Distributed Systems"`. Use a simple replace: `series.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')`.

- [ ] **Step 1: Create `components/blog/SeriesBadge.tsx`**

Props: `{ series: string; order?: number }`.
Use `Badge` with `variant="primary"`.
Label: `order !== undefined ? \`Part ${order} · ${displayName}\` : \`${displayName} Series\``

No test file needed: this is a pure presentational component with no logic beyond the label string. The label formula is simple enough to verify visually.

---

### Task 3: `SeriesNav` component

**Files:**
- Create: `components/blog/SeriesNav.tsx`

**Interfaces:**
- Consumes: `getAdjacentSeriesPosts` from `lib/posts.ts`, `PostMeta`
- Produces: `SeriesNav({ currentSlug: string; series: string; order?: number; totalInSeries: number }): JSX.Element | null`
  - Returns `null` if the post is not in a series (guard: `!series`).
  - Shows a horizontal rule, then a row: series name on the left, "Chapter N of M" on the right.
  - Below: two columns, prev link on the left and next link on the right. Missing prev or next shows an empty column.
  - Prev link: left arrow icon + "Previous: {prev.title}" truncated to one line.
  - Next link: "Next: {next.title}" + right arrow icon, right-aligned, truncated to one line.
  - Links go to `/blogs/{slug}`.

- [ ] **Step 1: Create `components/blog/SeriesNav.tsx`**

This component is called from a server component (`app/blogs/[slug]/page.tsx`). It may call `getAdjacentSeriesPosts` directly since it runs at build time.

Props:
```typescript
interface SeriesNavProps {
  currentSlug: string
  series: string
  order?: number
  totalInSeries: number
}
```

Use `Link` from `next/link`. Use `material-symbols-outlined` for `arrow_back` and `arrow_forward` (same pattern as `PostHeader`). Style using existing tokens: `text-on-surface-variant`, `hover:text-primary`, `border-outline-variant/30`.

No automated test: verified visually when wired into the post page.

---

### Task 4: Wire `SeriesBadge` into `PostCard` and `PostHeader`

**Files:**
- Modify: `components/blog/PostCard.tsx`
- Modify: `components/blog/PostHeader.tsx`

**Interfaces:**
- Consumes: `SeriesBadge` from Task 2, updated `PostMeta` from Task 1

- [ ] **Step 1: Update `PostCard`**

Add `SeriesBadge` above the title when `post.series` is set:
```tsx
{post.series && (
  <SeriesBadge series={post.series} order={post.seriesOrder} />
)}
```

Change the footer CTA label: when `post.series && post.seriesOrder`, render `"Read Chapter ${post.seriesOrder}"` instead of `"Read Architecture Note"`.

- [ ] **Step 2: Update `PostHeader`**

Add `SeriesBadge` between the back link and the tags row when `post.series` is set:
```tsx
{post.series && (
  <SeriesBadge series={post.series} order={post.seriesOrder} />
)}
```

Change the back link: when `post.series` is set, link to `/blogs/distributed-systems` and label it "Back to series" instead of "/blogs" and "All posts".

- [ ] **Step 3: Run build to verify no type errors**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors

---

### Task 5: Wire `SeriesNav` into the blog post page

**Files:**
- Modify: `app/blogs/[slug]/page.tsx`

**Interfaces:**
- Consumes: `SeriesNav` from Task 3, `getSeriesPosts` from Task 1, `Post` type

- [ ] **Step 1: Import `SeriesNav` and `getSeriesPosts`**

In `app/blogs/[slug]/page.tsx`:
```typescript
import SeriesNav from '@/components/blog/SeriesNav'
import { getSeriesPosts } from '@/lib/posts'
```

- [ ] **Step 2: Compute `totalInSeries` inside `BlogPostPage`**

```typescript
const totalInSeries = post.series ? getSeriesPosts(post.series).length : 0
```

- [ ] **Step 3: Render `SeriesNav` after `MdxContent`**

```tsx
{post.series && (
  <SeriesNav
    currentSlug={post.slug}
    series={post.series}
    order={post.seriesOrder}
    totalInSeries={totalInSeries}
  />
)}
```

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: build succeeds

---

### Task 6: Update `/blogs` page with series grouping

**Files:**
- Create: `components/blog/SeriesGroupCard.tsx`
- Modify: `app/blogs/page.tsx`

**Interfaces:**
- Consumes: `PostMeta` with series fields, `getSeriesPosts` from Task 1
- Produces:
  - `SeriesGroupCard({ seriesSlug: string; posts: PostMeta[] }): JSX.Element`
    - A card showing the series display name, chapter count, summary of the first chapter, and a "Start Reading" link to the series landing page `/blogs/{seriesSlug}`.
    - Below the header card, renders a compact chapter list: chapter number + title for each post, linking to `/blogs/{slug}`. Shows all chapters.

- [ ] **Step 1: Create `components/blog/SeriesGroupCard.tsx`**

Props: `{ seriesSlug: string; posts: PostMeta[] }`.
Layout: outer card div with the same border and background as `PostCard`. Top section: series display name as `h2`, chapter count badge (e.g. "26 chapters"), first post's summary as the description, and a "Start Reading" `Link` to `/blogs/${seriesSlug}`. Below: a `ul` of chapter entries: chapter number, title (truncated to one line), and read time.

- [ ] **Step 2: Update `app/blogs/page.tsx`**

```typescript
import { getAllPosts } from '@/lib/posts'
import SeriesGroupCard from '@/components/blog/SeriesGroupCard'
```

Partition posts:
```typescript
const allPosts = getAllPosts()
const seriesSlugs = [...new Set(allPosts.filter(p => p.series).map(p => p.series!))]
const standalonePosts = allPosts.filter(p => !p.series)
```

Render series group cards first (one per series slug, posts sorted by `seriesOrder`), then standalone post cards below. Update the post count label to count standalone posts only, or update it to say "N posts + M series chapters."

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: build succeeds, no type errors

---

### Task 7: Series landing page at `/blogs/distributed-systems`

**Files:**
- Create: `app/blogs/distributed-systems/page.tsx`

**Interfaces:**
- Consumes: `getSeriesPosts` from Task 1, `PostMeta` with series fields
- This is a static Next.js page (no `generateStaticParams` needed, the route is fixed).

- [ ] **Step 1: Create `app/blogs/distributed-systems/page.tsx`**

```typescript
import type { Metadata } from 'next'
import Link from 'next/link'
import { getSeriesPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Distributed Systems for Backend Engineers – Rishu Kumar',
  description: 'A 26-chapter series covering distributed systems concepts, Go implementations, and system design interview prep.',
}
```

Body:
- Header section: series title ("Distributed Systems for Backend Engineers"), tagline, and chapter count.
- Chapter list: an ordered list of all 26 chapters. Each row shows the chapter number, title, read time, and status. For published chapters (`getSeriesPosts('distributed-systems')` returns them), link the title to `/blogs/{slug}`. For unpublished chapters, show "Coming soon" in muted text.
- The full chapter list (all 26 titles and slugs) is defined as a static constant in this file since the chapters are known in advance. The function `getSeriesPosts` provides only the subset that is published. Merge the two: for each entry in the static list, check if it appears in the published set.

The static chapter list constant:
```typescript
const CHAPTERS = [
  { order: 1, title: 'Distributed Systems Fundamentals', slug: 'ds-01-fundamentals' },
  { order: 2, title: 'Distributed Communication', slug: 'ds-02-communication' },
  { order: 3, title: 'Consistency and Replication', slug: 'ds-03-consistency' },
  { order: 4, title: 'Distributed Transactions', slug: 'ds-04-transactions' },
  { order: 5, title: 'Messaging and Event-Driven Systems', slug: 'ds-05-messaging' },
  { order: 6, title: 'Distributed Coordination', slug: 'ds-06-coordination' },
  { order: 7, title: 'Distributed Storage and Databases', slug: 'ds-07-storage' },
  { order: 8, title: 'Distributed Caching', slug: 'ds-08-caching' },
  { order: 9, title: 'Reliability and Resilience Engineering', slug: 'ds-09-reliability' },
  { order: 10, title: 'Advanced Distributed Systems', slug: 'ds-10-advanced' },
  { order: 11, title: 'Time in Distributed Systems', slug: 'ds-11-time' },
  { order: 12, title: 'Real-time Communication Patterns', slug: 'ds-12-realtime' },
  { order: 13, title: 'CDN and DNS', slug: 'ds-13-cdn-dns' },
  { order: 14, title: 'Probabilistic Data Structures', slug: 'ds-14-probabilistic' },
  { order: 15, title: 'API Design Patterns', slug: 'ds-15-api-design' },
  { order: 16, title: 'Deployment and Operational Patterns', slug: 'ds-16-deployment' },
  { order: 17, title: 'Back-of-Envelope Calculations', slug: 'ds-17-estimation' },
  { order: 18, title: 'Key Jargon Reference', slug: 'ds-18-jargon' },
  { order: 19, title: 'Serialization and Schema Evolution', slug: 'ds-19-serialization' },
  { order: 20, title: 'Security in Distributed Systems', slug: 'ds-20-security' },
  { order: 21, title: 'Task Queues and Job Scheduling', slug: 'ds-21-task-queues' },
  { order: 22, title: 'Search Systems', slug: 'ds-22-search' },
  { order: 23, title: 'Microservices Patterns', slug: 'ds-23-microservices' },
  { order: 24, title: 'Service Mesh', slug: 'ds-24-service-mesh' },
  { order: 25, title: 'Networking Fundamentals', slug: 'ds-25-networking' },
  { order: 26, title: 'Popular Interview Questions', slug: 'ds-26-interview-questions' },
]
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: build succeeds. Verify that `/blogs/distributed-systems` renders as a distinct page from the `[slug]` dynamic route (check `.next/server/app/blogs/distributed-systems` exists in the build output).

- [ ] **Step 3: Run full test suite**

Run: `npm test`
Expected: all tests pass
