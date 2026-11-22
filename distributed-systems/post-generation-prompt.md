# Distributed Systems Blog Post Generation Prompt

Paste this entire prompt into a new Claude session to generate one chapter.
Replace the placeholders at the top. Everything else stays fixed.

---

## CONFIGURATION (fill in before pasting)

```
CHAPTER_NUMBER:  <e.g. 1>
CHAPTER_TITLE:   <e.g. Distributed Systems Fundamentals>
TOPICS:          <paste the bullet-point list from distributed-systems.md for this chapter>
INTERVIEW_QS:    <paste the interview questions block for this chapter>
SERIES_ORDER:    <same as CHAPTER_NUMBER>
TODAY_DATE:      <YYYY-MM-DD>
PREV_CHAPTER:    <slug of previous post, or "none">
NEXT_CHAPTER:    <slug of next post, or "none">
```

---

## THE PROMPT (paste everything below this line into the new session)

You are writing Chapter {CHAPTER_NUMBER} of a 26-chapter distributed systems engineering series
published as MDX blog posts on a personal portfolio site (Next.js, Tailwind CSS, next-mdx-remote,
Mermaid diagrams supported). The audience is mid-level to senior backend engineers who want deep,
practical understanding -- not a Wikipedia summary.

Write the full MDX file for this chapter. Output the raw MDX text only, no commentary around it.

---

## CONTENT PHILOSOPHY

This is the most important section. Read it before writing a single word.

**Write like a book, not a blog post.**
The best technical books (Designing Data-Intensive Applications, The Go Programming Language) build
understanding layer by layer. They do not dump a list of facts. They start with why something exists,
build a mental model, then show how it actually works, then show what breaks it. Follow that structure
for every chapter. A reader finishing this chapter should feel they understand the concept deeply --
not that they have read a summary of it.

**Every concept needs a concrete failure scenario first.**
Do not define a term and then explain it. Show a real production failure that the concept solves,
then introduce the concept as the solution. The reader needs to feel the pain before they appreciate
the fix. If you cannot think of a concrete failure scenario for a concept, the chapter is not ready
to be written.

**Diagrams are mandatory, not decorative.**
Every chapter has at least 2 Mermaid diagrams. Use them for:
- System flows and request paths (sequenceDiagram)
- Component relationships and architecture (flowchart LR / flowchart TD)
- State machines like circuit breaker states (stateDiagram-v2)
- Decision trees for design choices (flowchart TD with diamond nodes)
- Before/after architecture (broken design first, then the fix)
- Happy path and failure path for any multi-step protocol (two separate diagrams)

Do not describe a system flow in prose when a sequence diagram would make it instantly clear.
Do not describe a data structure in prose when ASCII art would make it concrete.

**All Go code must be copy-paste runnable.**
Every Go code block runs with `go run file.go` or `go test ./...` as written. No ellipsis
placeholders. No "implement the rest yourself." The reader should be able to copy the code,
paste it into a file, and run it. Expected output is shown in a `// Output:` comment at the end
of every example. If a code block cannot be made self-contained, break it into smaller self-contained
examples instead of using a placeholder.

**Go code must be idiomatic.**
- Errors are values. Every error return is handled. Never `_` an error.
- `context.Context` is the first parameter of any function that does I/O or could block.
- `defer` is used for cleanup (file close, mutex unlock, connection close).
- Variable names are meaningful: `conn` not `c`, `msg` not `m`, `worker` not `w`.
- Comments explain WHY, not what. "// exponential backoff prevents thundering herd" not "// retry."
- Standard library only, unless a third-party package is essential to demonstrate the concept.
  If a third-party package is used, include the full go.mod snippet inline.

**Show the wrong version before the right version.**
For every pattern, start with the naive or broken implementation. Label it `// BAD: reason`.
Let the reader see exactly why it fails. Then build to the correct version and label it
`// CORRECT: reason`. This is how engineers actually learn -- by understanding what breaks
and why, not by memorizing the right answer.

**Real systems ground every concept.**
After explaining how something works, show how a real system does it: Kafka, PostgreSQL, Redis,
AWS Aurora, Google Spanner, DynamoDB, Cassandra, etcd. Be specific: name the actual component,
config option, or behavior. "Kafka guarantees ordering within a partition by assigning each message
a monotonically increasing offset" is useful. "Many systems use ordering" is not.

**NO EM-DASHES. THIS IS AN ABSOLUTE HARD RULE.**
Search every line of your output before submitting. The em-dash character is `—` (Unicode U+2014).
It must not appear anywhere in the file: not in prose, not in frontmatter fields (title, summary),
not inside code comments, not inside quoted strings, not in the TL;DR bullets, not in interview
answers, not anywhere. Zero occurrences. No exceptions.

Replace every em-dash with one of these alternatives depending on context:
- Two independent clauses: split into two sentences.
- Parenthetical aside: use commas or parentheses instead.
- Definition or explanation: use a colon.
- List item with a descriptor: use a comma.

Examples of banned patterns and their replacements:
  BANNED:  "A distributed system is multiple nodes — failures make this hard."
  ALLOWED: "A distributed system is multiple nodes. Failures make this hard."

  BANNED:  "SPOF — a component whose failure takes the system down."
  ALLOWED: "SPOF, meaning a component whose failure takes the system down."

  BANNED:  summary: "What distributed systems are — with Go code examples."
  ALLOWED: summary: "What distributed systems are, with Go code examples."

Do not use `--` as a substitute either. That is also banned. Use actual punctuation.
Before writing a single word, internalize this rule. After writing the chapter,
scan every line for the `—` character and fix any occurrence before outputting.

---

---

## CHAPTER DETAILS

Chapter number: {CHAPTER_NUMBER}
Chapter title:  {CHAPTER_TITLE}
Topics to cover: {TOPICS}
Interview questions to include: {INTERVIEW_QS}

---

## FRONTMATTER TEMPLATE

Use exactly this format:

```mdx
---
title: "{A punchy, specific title -- not just the chapter title. Example: 'CAP Theorem: Why Every Distributed System Makes a Painful Trade-off'}"
date: "{TODAY_DATE}"
tags: ["Distributed Systems", "Go", <2-4 more specific tags from the topic>]
summary: "One sentence. What the reader will understand after this chapter that they didn't before."
readTime: <estimated reading time in minutes -- count ~200 words/min, include code scan time>
series: "distributed-systems"
seriesOrder: {SERIES_ORDER}
draft: false
---
```

---

## CHAPTER STRUCTURE

Follow this structure exactly, in this order. Use these exact section headings.

### 1. TL;DR

Three bullet points. Each under 20 words. The three most important facts a reader should retain.
No fluff. Write these last (after writing the full chapter) so they accurately reflect the content.

### 2. The Problem

Open with a concrete failure scenario. A real or realistic production incident that makes the
reader feel the pain this topic solves. No theory yet. 2-4 short paragraphs.

Good example opening: "It's 2:47 AM. Your payment service just processed the same transaction
twice. The charge hit the user's card. Your idempotency check said the request was new. The
database said otherwise. Your on-call engineer is staring at conflicting logs from two replicas."

Bad example opening: "In distributed systems, consistency is an important property..."

### 3. Chapter Map

A Mermaid `flowchart LR` or `flowchart TD` showing what concepts this chapter covers and how they
connect. 5-10 nodes. Keep labels short. This is the reader's orientation before they dive in.
Put it right after the problem section, before the mental model.

### 4. Mental Model

One real-world analogy that maps precisely to the concept. Explain the analogy in 2-3 sentences,
then in 1-2 sentences say explicitly how it maps ("Just like X, in distributed systems Y works
because..."). Then add 1-2 sentences stating explicitly where the analogy breaks down: "This
analogy stops working when X, because real distributed systems Y." Never omit the breakdown.
One strong analogy per chapter -- do not layer multiple analogies for the same concept.

### 5. How It Works

The actual mechanics. Use progressive disclosure: start with the 1-node or 2-node case, show
one failure, add complexity, show the next failure. Each layer of complexity surfaces exactly one
new problem. Do not start at the N-node production case -- build to it step by step.

Use Mermaid diagrams here (see diagram rules below). For multi-step protocols (Raft election,
2PC, Saga), show two sequence diagrams: one for the happy path, one for a specific failure path.
Seeing both makes the protocol legible.

For every solution you describe, name its concrete cost: latency added, operational overhead,
or failure blast radius. Vague trade-offs erode trust. "Adding a quorum check adds ~1ms of
latency per write at p99 on a 3-replica cluster in the same datacenter" is useful. "This adds
some latency" is not.

When a concept reuses something from an earlier chapter, name it: "This is the same quorum
logic from Chapter 3, applied to locks instead of reads."

Inline definitions: the first time you use a jargon term, define it in parentheses immediately
after. Example: "replication lag (the delay between when a write lands on the leader and when it
appears on the follower)". Never assume the reader knows a term just because it was mentioned
in a previous chapter.

### 6. Go Implementation

Build the concept in Go. Always start with the naive/broken version that shows the problem,
then iterate to the correct version. Show at least 2 iterations. The final version must be
production-quality idiomatic Go.

Each code block must:
- Run with `go run` or `go test` without modification
- Include a `// Output:` comment at the end showing expected output
- Use only stdlib unless a third-party package is essential (if essential, include go.mod snippet)
- Use meaningful variable names (not `c`, `m`, `s` -- use `conn`, `msg`, `server`)
- Have comments that explain WHY, not what ("// exponential backoff prevents thundering herd on retry")
- Handle errors explicitly -- never `_` a returned error in example code
- Use `context.Context` where any network or blocking operation is involved
- Use `defer` for cleanup
- After each example that runs locally, add a comment: `// Try it: https://go.dev/play/p/PLACEHOLDER` -- use PLACEHOLDER literally; the reader can paste the code themselves

When showing a wrong version, label it clearly with a comment:
```go
// BAD: this races under concurrent access
```

When showing the correct version:
```go
// CORRECT: sync.Mutex serializes access to the shared counter
```

For concurrent or distributed code examples, include a failure injection block showing how to
deliberately trigger the failure mode:
```go
// Failure injection: simulate network partition
// Uncomment to observe the problem this code solves:
// conn.SetDeadline(time.Now().Add(0))
```

If the topic includes a benchmark claim (e.g., "this is faster"), include a `Benchmark` function
with realistic data. State the expected output with actual numbers and reference hardware:
"On an AWS c6i.xlarge, expect ~450ns/op for the mutex version and ~120ns/op for the atomic version."

Include the "at scale" point for each example: at what number of requests, nodes, or records
does the naive version break? Give a concrete threshold, not "at high scale".

### 7. Real System Examples

Show how 2-3 real systems (AWS, Google, Kafka, PostgreSQL, Redis, Cassandra, DynamoDB, etc.)
implement or solve this exact problem. Be specific: name the actual component, behavior, or config
option. No vague "major cloud providers use this pattern."

Good example: "Kafka guarantees ordering within a partition by assigning each message a monotonically
increasing offset. When a consumer reads messages, it always reads them in offset order. If you need
global ordering across topics, Kafka cannot help you -- that requires a single partition or
application-level sequencing."

Bad example: "Many systems use ordering mechanisms to handle this."

### 8. What Can Go Wrong

A "break it" section. 2-4 failure modes for this topic. For each:
- Name the failure mode
- Show Go code (or a Mermaid diagram) that demonstrates how it happens
- Explain why it happens
- State the fix

This is where readers learn to think defensively.

### 9. Trade-offs

A markdown table. Columns: Approach | Strength | Weakness | Concrete Cost | Use When.
3-6 rows covering the main design choices for this topic.
The "Concrete Cost" column must have a real number or specific operational burden -- not "some overhead."

After the table, include a Mermaid decision flowchart titled "Choosing an approach" that answers
the most common design question for this chapter's topic. 5-10 decision nodes. Example for caching:
"Is your data read-heavy? -> Yes -> Is staleness acceptable? -> Yes -> Cache-aside. -> No -> Write-through."

### 10. Common Misconceptions

A "The Lie" section. 1-3 things engineers commonly believe that are wrong or oversimplified.
State the misconception, then explain what is actually true.

Example format:
**Misconception:** "Eventual consistency means your data will be inconsistent for a few milliseconds."
**Reality:** "Eventual consistency gives no time bound. Under network partition, two replicas could
diverge indefinitely. 'Eventually' means 'when the partition heals' -- which could be never if
the partition is permanent."

### 11. Interview Questions

Include the questions from {INTERVIEW_QS}. For each question, give a 3-5 sentence model answer.
The answer should be what a strong candidate actually says, not a textbook definition.

Format:
**Q: {question}**
A model answer: ...

### 12. Key Takeaways

5 bullet points. These are the sticky notes -- the things worth writing down. Not a summary of
the chapter. The insights that change how the reader designs systems.

End with a "one true sentence" test: after writing the takeaways, can you state the chapter's
core insight in a single sentence that is not a cliche? If not, the chapter is missing a sharp
point of view and needs revision before the takeaways are finalized.

### 13. Navigation

At the very bottom of the MDX, include:

```mdx
---

**Series:** Distributed Systems for Backend Engineers
**Previous:** [{PREV_CHAPTER_TITLE}](/blogs/{PREV_CHAPTER_SLUG}) | **Next:** [{NEXT_CHAPTER_TITLE}](/blogs/{NEXT_CHAPTER_SLUG})
```

If PREV or NEXT is "none", omit that direction.

---

## WRITING STYLE RULES

These are hard rules. Violating any of them means the post needs to be rewritten.

**Em-dashes:** Never use em-dashes (---, --, or the unicode character --). Use a comma, colon,
or rewrite the sentence instead.

**Sentence length:** Vary it. Short sentences for impact. Longer sentences for explanation where
the parts relate to each other and the connection matters. Never more than 35 words in a sentence.

**Passive voice:** Avoid it. "The leader sends a heartbeat" not "A heartbeat is sent by the leader."

**Hedging:** Avoid "might", "could", "may", "perhaps" in factual statements. If something is true,
state it. If something is conditional, say the condition explicitly.

**Analogies:** Use one strong analogy per chapter. Do not layer multiple analogies for the same
concept.

**Numbers:** Always give concrete numbers when making performance claims. "Redis handles ~100,000
operations per second per node on typical hardware" not "Redis is very fast."

**Jargon:** Use it. This is a technical series. But define every term the first time it appears
inline, right after the term in parentheses.

**Lists:** Use bullet lists for 3+ items that are genuinely parallel. Do not use bullets to avoid
writing connected prose.

**Tone:** Peer-to-peer. You are an experienced engineer explaining to a smart colleague, not
lecturing a student. No patronizing phrases like "Simply put" or "As you can see."

---

## MERMAID DIAGRAM RULES

Include at least 2 Mermaid diagrams per chapter. More is better for complex topics.

Use this syntax for the MDX code block:
````
```mermaid
<diagram content>
```
````

**For request/response flows:** use `sequenceDiagram`
**For system component relationships:** use `flowchart LR` or `flowchart TD`
**For state machines (e.g., circuit breaker):** use `stateDiagram-v2`
**For timelines and causality:** use `sequenceDiagram` with `Note` annotations

Label every node and arrow descriptively. Avoid single-letter node IDs.
Good: `Client-->LoadBalancer: HTTP POST /payment`
Bad: `A-->B: request`

Apply the same "naive first" technique to diagrams: show the broken architecture (single DB, no
replica), annotate what breaks ("SPOF: this node going down takes the whole system"), then show
the improved diagram. Two diagrams that tell a before/after story are more instructive than one
perfect diagram.

For data structure visualization (B-trees, hash rings, etc.) where Mermaid is awkward,
use a labeled ASCII art block inside a plain code block.

---

## GO CODE QUALITY CHECKLIST

Before writing any Go code block, verify it meets all of these:

- [ ] Runs with `go run file.go` or `go test ./...` as written
- [ ] All imports used, none missing
- [ ] Every error return is handled (no `_` on errors)
- [ ] `context.Context` passed to any function that does I/O or could block
- [ ] `defer` used for resource cleanup (file close, mutex unlock, conn close)
- [ ] Variable names are meaningful (minimum 3 characters except loop indexes `i`, `j`, `k`)
- [ ] No global mutable state without explicit synchronization
- [ ] Expected output shown in `// Output:` comment
- [ ] Wrong/naive version labeled `// BAD:`
- [ ] Correct version labeled `// CORRECT:` (only needed if a bad version was shown)
- [ ] go.mod snippet included if any non-stdlib import is used

---

## REAL SYSTEM EXAMPLES BANK

Draw from these for the "Real System Examples" section. Only use systems relevant to the chapter topic.

| System | What it's known for in this context |
|--------|-------------------------------------|
| Kafka | Partitioned log, offset-based ordering, consumer groups, compaction |
| PostgreSQL | MVCC, WAL, B-tree indexes, VACUUM, advisory locks |
| Redis | Single-threaded event loop, cluster hash slots, Lua scripting for atomicity |
| DynamoDB | Consistent hashing, eventually consistent reads, conditional writes |
| Cassandra | Leaderless replication, tunable consistency, LWW conflict resolution |
| Etcd | Raft consensus, linearizable reads, lease-based distributed locks |
| AWS Aurora | Multi-AZ replication, reader endpoint DNS load balancing, storage layer separation |
| AWS SQS | Visibility timeout, at-least-once delivery, FIFO queues |
| Google Spanner | TrueTime API, external consistency, globally distributed transactions |
| Elasticsearch | Inverted index, shard routing, near-real-time refresh |
| Nginx/HAProxy | Layer 4 vs Layer 7 load balancing, health checks, connection pooling |
| Cloudflare | Anycast routing, edge caching, CDN cache invalidation |

---

## FRONTMATTER SERIES SLUG REFERENCE

Use these exact slugs for the `{PREV_CHAPTER_SLUG}` and `{NEXT_CHAPTER_SLUG}` placeholders:

| Chapter | Slug |
|---------|------|
| 1. Fundamentals | `ds-01-fundamentals` |
| 2. Distributed Communication | `ds-02-communication` |
| 3. Consistency and Replication | `ds-03-consistency` |
| 4. Distributed Transactions | `ds-04-transactions` |
| 5. Messaging and Event-Driven Systems | `ds-05-messaging` |
| 6. Distributed Coordination | `ds-06-coordination` |
| 7. Distributed Storage and Databases | `ds-07-storage` |
| 8. Distributed Caching | `ds-08-caching` |
| 9. Reliability and Resilience Engineering | `ds-09-reliability` |
| 10. Advanced Distributed Systems | `ds-10-advanced` |
| 11. Time in Distributed Systems | `ds-11-time` |
| 12. Real-time Communication Patterns | `ds-12-realtime` |
| 13. CDN and DNS | `ds-13-cdn-dns` |
| 14. Probabilistic Data Structures | `ds-14-probabilistic` |
| 15. API Design Patterns | `ds-15-api-design` |
| 16. Deployment and Operational Patterns | `ds-16-deployment` |
| 17. Back-of-Envelope Calculations | `ds-17-estimation` |
| 18. Key Jargon Reference | `ds-18-jargon` |
| 19. Serialization and Schema Evolution | `ds-19-serialization` |
| 20. Security in Distributed Systems | `ds-20-security` |
| 21. Task Queues and Job Scheduling | `ds-21-task-queues` |
| 22. Search Systems | `ds-22-search` |
| 23. Microservices Patterns | `ds-23-microservices` |
| 24. Service Mesh | `ds-24-service-mesh` |
| 25. Networking Fundamentals | `ds-25-networking` |
| 26. Popular Interview Questions | `ds-26-interview-questions` |

---

## MDX FILE NAME

The generated MDX file must be saved as:
`content/blogs/{SLUG}.mdx`

where `{SLUG}` comes from the slug reference table above.

---

## QUALITY BAR

Before considering the post done, verify:

- The opening paragraph does NOT start with "In distributed systems..." or any other generic opener
- Every code block compiles and runs
- There are at least 2 Mermaid diagrams
- No em-dashes anywhere in the file (search for `--` and the unicode em-dash character)
- Every jargon term is defined inline on first use
- The "What Can Go Wrong" section has at least 2 failure modes with code
- The trade-offs table has at least 3 rows
- The interview questions have model answers
- Navigation links at the bottom are correct

---

## EXAMPLE: WHAT A GREAT OPENING LOOKS LIKE

This is an example of the right tone and structure for the problem-first opening.
Do not copy this. Write a fresh scenario relevant to your chapter topic.

---

Your service is handling 50,000 requests per second. At 3:12 AM, one of your downstream services
starts responding in 8 seconds instead of 50 milliseconds. Within 90 seconds, every thread in your
connection pool is waiting. New requests queue behind them. The queue fills. Your load balancer
starts seeing timeouts. It retries. Now you have 3x the traffic hitting the already-overwhelmed
service. Your service goes down. The downstream service, now receiving zero traffic, recovers.

One slow service took down three others. This is cascade failure. This chapter explains why it
happens and how circuit breakers, bulkheads, and backpressure prevent it.

---

That is the full prompt. Everything above the `---` line at the top is configuration you fill in.
Everything from the prompt title downward gets pasted into the new session.
