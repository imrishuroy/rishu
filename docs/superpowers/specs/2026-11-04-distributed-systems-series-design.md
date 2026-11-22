# Distributed Systems for Backend Engineers: Blog Series Design

## What This Is

A 26-chapter distributed systems engineering series published as MDX blog posts on the portfolio
site. The series covers every foundational concept a mid-level to senior backend engineer needs
for production systems work and system design interviews, in the order they build on each other.

Each chapter reads like a chapter in a technical book: problem first, mechanics second, working
Go code third, real production system examples fourth. No concept is left as an abstract definition.
Every topic is grounded in a concrete failure scenario, implemented in idiomatic Go, and anchored
to how a real system (Kafka, PostgreSQL, Redis, AWS, Google Spanner) uses it.

The series is generated one chapter at a time using a reusable prompt (`distributed-systems/post-generation-prompt.md`).
Each chapter is a separate Claude session. The prompt encodes all writing rules, code quality
requirements, section structure, and diagram standards so they do not need to be re-established
each time.

## Intended Reader

Backend engineers preparing for system design interviews and engineers building production
distributed systems. The series serves both simultaneously: interview candidates get the mental
models, definitions, and interview question answers; practicing engineers get the Go implementations,
failure modes, and trade-off analysis.

Chapters 1 through 9 are foundational and accessible to any engineer who has built a backend service.
Chapters 10 through 26 assume the reader has completed the earlier chapters. Prerequisite chapters
are stated at the top of each post.

Every jargon term is defined inline on first use. No glossary lookups required. A reader who lands
on Chapter 7 without having read Chapter 3 can still follow it because terms are re-defined on
first use in each chapter, not globally assumed.

## Generation Workflow

Each chapter is generated in a fresh Claude session using the master prompt at
`distributed-systems/post-generation-prompt.md`. The workflow per chapter:

1. Open `distributed-systems/chapter-checklist.md` and copy the CONFIGURATION block for the target chapter
2. Open `distributed-systems/post-generation-prompt.md`
3. Fill in the CONFIGURATION block at the top with the copied values
4. Paste the entire file into a new Claude session
5. Claude generates the full MDX content
6. Save the output to `content/blogs/{slug}.mdx`
7. Run `npm run build` to verify the MDX compiles
8. Mark the chapter done in `chapter-checklist.md`

Chapters should be generated in the recommended order (1 through 26) since later chapters
cross-reference earlier ones by chapter number and slug.

## Chapter Shape

Each chapter follows this structure in this order. The prompt enforces it.

1. **TL;DR** -- three bullet points, under 20 words each. Written last, after the full chapter.
2. **The Problem** -- a concrete failure scenario that makes the reader feel the pain before any solution is shown. Never opens with a definition.
3. **Chapter Map** -- a Mermaid flowchart showing the concepts covered and how they connect. Reader orientation before the mechanics.
4. **Mental Model** -- one real-world analogy mapped precisely to the concept. Includes an explicit statement of where the analogy breaks down.
5. **How It Works** -- mechanics built progressively: 1-node case first, then 2-node, then N-node. One new failure surface per step. Includes two sequence diagrams for any multi-step protocol: happy path and failure path. Every solution names its concrete cost (latency, operational burden, failure blast radius) in numbers, not adjectives. Cross-references earlier chapters by name when a concept reuses prior material.
6. **Go Implementation** -- starts with the naive/broken version, iterates to production-quality idiomatic Go. See Go code rules below.
7. **Real System Examples** -- how 2-3 real systems (Kafka, PostgreSQL, Redis, AWS Aurora, Google Spanner, DynamoDB, Cassandra, etcd) actually implement or solve the topic. Specific component names, behaviors, and config options. No vague "major providers use this."
8. **What Can Go Wrong** -- 2-4 failure modes with Go code or Mermaid diagrams demonstrating each one. States the fix for each.
9. **Trade-offs** -- markdown table with columns: Approach, Strength, Weakness, Concrete Cost, Use When. Followed by a Mermaid decision flowchart for the chapter's main design choice.
10. **Common Misconceptions** -- 1-3 things engineers commonly believe that are wrong. States the misconception then corrects it precisely.
11. **Interview Questions** -- the chapter's interview questions with 3-5 sentence model answers written as what a strong candidate actually says, not a textbook definition.
12. **Key Takeaways** -- 5 bullet points. The insights that change how the reader designs systems, not a summary.
13. **Navigation** -- prev/next chapter links at the bottom.

Minimum 2 Mermaid diagrams per chapter. Complex protocol chapters (Raft, 2PC, Saga) have more.

## Writing Rules

These are hard constraints. They apply to every chapter without exception.

**No em-dashes.** Use a comma, colon, or rewrite the sentence. The existing site CLAUDE.md prohibits em-dashes everywhere.

**Problem-first.** The opening paragraph is never a definition. It is always a concrete failure scenario. No chapter opens with "In distributed systems, X is important because..."

**Numbers over adjectives.** "Redis handles approximately 100,000 operations per second per node on typical hardware" not "Redis is very fast." Performance claims require a number and a reference point.

**Active voice.** "The leader sends a heartbeat" not "A heartbeat is sent by the leader."

**Jargon with inline definition.** Use technical terms freely. Define each one the first time it appears in the chapter, in parentheses immediately after the term. Do not assume the reader remembers a definition from a previous chapter.

**Analogy breakdown.** Every mental model analogy must state explicitly where it stops being accurate. This is not optional. Stretched analogies create wrong mental models.

**At scale threshold.** Every naive implementation must state the concrete threshold where it breaks: a number of requests, nodes, records, or connections. Not "at high scale."

**One true sentence.** Each chapter must have a core insight that can be stated in one non-cliche sentence. If the Key Takeaways section cannot be distilled to one sharp sentence, the chapter lacks a point of view and needs revision.

**Peer-to-peer tone.** An experienced engineer explaining to a smart colleague. No patronizing phrases: not "Simply put", "As you can see", "It's worth noting", or "Of course."

**No trailing summary.** The chapter ends with Key Takeaways and Navigation. No "In conclusion" or "In summary" section.

## Go Code Rules

Every Go code block must meet all of these before being included.

**Runnable.** Runs with `go run file.go` or `go test ./...` as written. No ellipsis placeholders, no "fill in the rest." The reader should be able to copy, paste, and run.

**Output shown.** Every example includes a `// Output:` comment at the end showing expected output.

**Stdlib first.** Use only the standard library unless a third-party package is essential to demonstrate the concept (not just convenient). If a third-party package is used, include the full `go.mod` snippet inline.

**Meaningful names.** No single-letter variable names except loop indexes `i`, `j`, `k`. Use `conn`, `msg`, `server`, `worker`, `result`. Not `c`, `m`, `s`, `r`.

**Errors handled.** Every error return is handled explicitly. Never `_` a returned error in example code.

**Context propagation.** Use `context.Context` for any function that does I/O or could block. Pass context as the first parameter.

**Defer for cleanup.** Use `defer` for file closes, mutex unlocks, connection closes.

**Comments explain why.** Comments explain non-obvious reasoning, not what the code does. "// exponential backoff prevents thundering herd on retry" not "// retry with backoff."

**BAD/CORRECT labeling.** Wrong versions are labeled `// BAD: reason`. Correct versions are labeled `// CORRECT: reason` only when a bad version was shown first.

**Failure injection.** For concurrent or distributed code examples, include a failure injection comment block showing how to deliberately trigger the failure mode the code defends against.

```go
// Failure injection: simulate network partition
// Uncomment to observe what this code prevents:
// conn.SetDeadline(time.Now().Add(0))
```

**Benchmarks with numbers.** If a benchmark is included, state expected output with real numbers and reference hardware. "On an AWS c6i.xlarge, expect approximately 450 ns/op for the mutex version and 120 ns/op for the atomic version."

**Playground comment.** After each example that fits in the Go Playground, add:
```go
// Try it: https://go.dev/play/p/PLACEHOLDER
```
Use PLACEHOLDER literally; the reader can paste the code.

## Diagram Rules

**Minimum 2 per chapter.** Complex chapters have more.

**Mermaid in MDX code blocks.** Use the standard triple-backtick Mermaid syntax already supported by the site's `remark-mermaid` plugin.

**Descriptive node IDs.** Label every node and arrow descriptively. No single-letter node IDs.
Good: `Client-->LoadBalancer: HTTP POST /payment`
Bad: `A-->B: request`

**Diagram types by use case:**
- Request/response flows: `sequenceDiagram`
- System component relationships: `flowchart LR` or `flowchart TD`
- State machines (circuit breaker, etc.): `stateDiagram-v2`
- Decision flowcharts: `flowchart TD` with diamond decision nodes

**Before/after for architecture diagrams.** Show the naive architecture first with an annotation of what breaks, then the improved diagram. Two diagrams that tell a story are more instructive than one perfect diagram.

**Two sequence diagrams for protocols.** Any multi-step protocol (Raft election, 2PC, Saga) gets two sequence diagrams: happy path and failure path. Never show only the happy path.

**ASCII art for data structures.** For B-tree nodes, hash ring layouts, and similar structures where Mermaid is awkward, use a labeled ASCII art block inside a plain code block.

## Blog Infrastructure Changes Required

The following changes to the Next.js site are needed to support the series. None are
blocking content generation; chapters can be published as regular posts first and the
infrastructure added afterward. But the full reading experience requires all of them.

### 1. Extend PostMeta with series fields

In `lib/posts.ts`, add two optional fields to `PostMeta`:

```typescript
export type PostMeta = {
  slug: string
  title: string
  date: string | undefined
  tags: string[]
  summary: string
  readTime: number
  draft: boolean
  series?: string        // e.g. "distributed-systems"
  seriesOrder?: number   // e.g. 1
}
```

Update `getAllPosts()` and `getPostBySlug()` to read these fields from frontmatter.
Propagate to all callers: `PostCard`, `PostHeader`, and `generateMetadata` in `app/blogs/[slug]/page.tsx`.

### 2. Series grouping on /blogs

Update `app/blogs/page.tsx` to group posts by series. Posts belonging to a series
are shown as a collapsed series card ("Distributed Systems -- 26 chapters") rather
than individual post cards. Clicking the series card expands to show all chapters in order.
Standalone posts (no series) continue to show as individual `PostCard` components.

### 3. Series landing page

Create `app/blogs/distributed-systems/page.tsx` as a static table of contents for the series.
Shows all 26 chapters in order with title, estimated read time, and status (published / coming soon).
Acts as the entry point for readers who want to start the series from Chapter 1.

This is a static page -- no dynamic data fetching needed. Chapter metadata comes from
`getAllPosts()` filtered and sorted by `series === "distributed-systems"` and `seriesOrder`.

### 4. SeriesNav component

Create `components/blog/SeriesNav.tsx`. Renders at the bottom of each series post.
Shows the series name, current chapter number out of total, and prev/next links.
Reads `seriesOrder`, `series` from post metadata and looks up adjacent posts.

The post page at `app/blogs/[slug]/page.tsx` passes post metadata to `SeriesNav`.
`SeriesNav` calls `getAllPosts()` filtered by series to find prev and next.

### 5. SeriesBadge component

Create `components/blog/SeriesBadge.tsx`. A small chip/tag rendered in `PostHeader`
and `PostCard` when `post.series` is set. Shows "Part N of Distributed Systems Series"
in the site's existing badge style (using `components/ui/Badge.tsx`).

## The 26 Chapters

Chapters are listed in recommended generation and reading order. Each chapter title is the
canonical title; the actual MDX post title may be more specific and punchy.

| # | Slug | Title | Priority |
|---|------|-------|----------|
| 1 | `ds-01-fundamentals` | Distributed Systems Fundamentals | Foundation |
| 2 | `ds-02-communication` | Distributed Communication | Foundation |
| 3 | `ds-03-consistency` | Consistency and Replication | Foundation |
| 4 | `ds-04-transactions` | Distributed Transactions | Foundation |
| 5 | `ds-05-messaging` | Messaging and Event-Driven Systems | Foundation |
| 6 | `ds-06-coordination` | Distributed Coordination | Foundation |
| 7 | `ds-07-storage` | Distributed Storage and Databases | Core |
| 8 | `ds-08-caching` | Distributed Caching | Core |
| 9 | `ds-09-reliability` | Reliability and Resilience Engineering | Core |
| 10 | `ds-10-advanced` | Advanced Distributed Systems | Advanced |
| 11 | `ds-11-time` | Time in Distributed Systems | Advanced |
| 12 | `ds-12-realtime` | Real-time Communication Patterns | Core |
| 13 | `ds-13-cdn-dns` | CDN and DNS | Core |
| 14 | `ds-14-probabilistic` | Probabilistic Data Structures | Advanced |
| 15 | `ds-15-api-design` | API Design Patterns | Core |
| 16 | `ds-16-deployment` | Deployment and Operational Patterns | Core |
| 17 | `ds-17-estimation` | Back-of-Envelope Calculations | Foundation |
| 18 | `ds-18-jargon` | Key Jargon Reference | Reference |
| 19 | `ds-19-serialization` | Serialization and Schema Evolution | Core |
| 20 | `ds-20-security` | Security in Distributed Systems | Core |
| 21 | `ds-21-task-queues` | Task Queues and Job Scheduling | Core |
| 22 | `ds-22-search` | Search Systems | Advanced |
| 23 | `ds-23-microservices` | Microservices Patterns | Core |
| 24 | `ds-24-service-mesh` | Service Mesh | Advanced |
| 25 | `ds-25-networking` | Networking Fundamentals | Foundation |
| 26 | `ds-26-interview-questions` | Popular Interview Questions | Reference |

Chapters 17 (estimation) and 18 (jargon) are reference chapters. They have different shapes:
Chapter 17 is a worked-examples chapter built around the estimation framework. Chapter 18 is a
glossary-style reference formatted as a lookup table with extended definitions. Both still follow
the Go code and diagram rules where applicable.

## Files Created

The following files were created as part of this design and are ready for use:

| File | Purpose |
|------|---------|
| `distributed-systems/post-generation-prompt.md` | Master prompt for chapter generation. Fill in CONFIGURATION, paste into new Claude session. |
| `distributed-systems/chapter-checklist.md` | Pre-filled CONFIGURATION blocks for all 26 chapters. Progress tracker. |

## Constraints

- No em-dashes anywhere in the content. The site CLAUDE.md prohibits them.
- Do not use `BlocProvider` or other Flutter/Dart patterns. This is a Next.js site.
- Do not change Tailwind color tokens in `tailwind.config.ts`. Use existing design system tokens.
- `PostMeta` type changes must propagate to all callers before any chapter that uses series fields is published.
- All content must be accurate. No invented benchmark numbers, no fake metrics, no made-up company statistics.
- Go code examples must use only real APIs and real behavior. Do not describe APIs that do not exist.
- Do not add npm dependencies without checking `package.json` first. The site currently uses next-mdx-remote, gray-matter, Shiki, and remark-mermaid. New packages require justification.

## What This Series Is Not

**Not a Wikipedia article.** Every concept is grounded in a failure scenario and implemented in
running Go code. Definitions alone are not enough.

**Not cloud-specific.** Examples draw from multiple systems (AWS, GCP, Cassandra, Kafka, PostgreSQL)
to illustrate concepts, not to recommend a vendor stack.

**Not a glossary dump.** Chapter 18 is the reference glossary. Every other chapter builds intuition
through code and examples. Terms are defined once per chapter inline, not in a sidebar.

**Not sequential-only.** A reader who needs to understand Kafka can start at Chapter 5. Prerequisites
are listed at the top of each post. Terms used from earlier chapters are re-defined inline.

**Not a marketing piece.** No claims about how great distributed systems are, no buzzwords, no
hype. The series is a practitioner's guide written by and for engineers who build these systems.
