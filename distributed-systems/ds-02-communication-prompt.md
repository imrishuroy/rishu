# Chapter 2: Distributed Communication — Generation Prompt

Paste everything from the horizontal rule below into a **new Claude session**.
Save the output as `content/blogs/ds-02-communication.mdx`.

---

You are writing Chapter 2 of a 26-chapter distributed systems engineering series published as MDX blog posts on a personal portfolio site (Next.js, Tailwind CSS, next-mdx-remote, Mermaid diagrams supported). The audience is mid-level to senior backend engineers who want deep, practical understanding — not a Wikipedia summary.

Write the full MDX file for this chapter. Output the raw MDX text only, no commentary around it.

---

## CONTENT PHILOSOPHY

This is the most important section. Read it before writing a single word.

**Write like a book, not a blog post.**
The best technical books (Designing Data-Intensive Applications, The Go Programming Language) build understanding layer by layer. They do not dump a list of facts. They start with why something exists, build a mental model, then show how it actually works, then show what breaks it. Follow that structure for every chapter. A reader finishing this chapter should feel they understand the concept deeply, not that they have read a summary of it.

**Every concept needs a concrete failure scenario first.**
Do not define a term and then explain it. Show a real production failure that the concept solves, then introduce the concept as the solution. The reader needs to feel the pain before they appreciate the fix. If you cannot think of a concrete failure scenario for a concept, the chapter is not ready to be written.

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
Every Go code block runs with `go run file.go` or `go test ./...` as written. No ellipsis placeholders. No "implement the rest yourself." The reader should be able to copy the code, paste it into a file, and run it. Expected output is shown in a `// Output:` comment at the end of every example. If a code block cannot be made self-contained, break it into smaller self-contained examples instead of using a placeholder.

**Go code must be idiomatic.**
- Errors are values. Every error return is handled. Never `_` an error.
- `context.Context` is the first parameter of any function that does I/O or could block.
- `defer` is used for cleanup (file close, mutex unlock, connection close).
- Variable names are meaningful: `conn` not `c`, `msg` not `m`, `worker` not `w`.
- Comments explain WHY, not what.
- Standard library only, unless a third-party package is essential to demonstrate the concept. If a third-party package is used, include the full go.mod snippet inline.

**Show the wrong version before the right version.**
For every pattern, start with the naive or broken implementation. Label it `// BAD: reason`. Let the reader see exactly why it fails. Then build to the correct version and label it `// CORRECT: reason`.

**Real systems ground every concept.**
After explaining how something works, show how a real system does it: Kafka, PostgreSQL, Redis, AWS Aurora, Google Spanner, DynamoDB, Cassandra, etcd. Be specific: name the actual component, config option, or behavior.

**NO EM-DASHES. THIS IS AN ABSOLUTE HARD RULE.**
Search every line of your output before submitting. The em-dash character is `—` (Unicode U+2014). It must not appear anywhere in the file: not in prose, not in frontmatter fields, not inside code comments, not inside quoted strings, not in the TL;DR bullets, not in interview answers, not anywhere. Zero occurrences. No exceptions.

Replace every em-dash with one of these alternatives depending on context:
- Two independent clauses: split into two sentences.
- Parenthetical aside: use commas or parentheses instead.
- Definition or explanation: use a colon.
- List item with a descriptor: use a comma.

Do not use `--` as a substitute either. That is also banned. Use actual punctuation.

---

## CHAPTER DETAILS

**Chapter number:** 2
**Chapter title:** Distributed Communication
**Series order:** 2
**Date:** 2026-11-05
**Previous chapter slug:** ds-01-fundamentals
**Next chapter slug:** ds-03-consistency

**Topics to cover:**

- HTTP vs RPC
- REST vs gRPC
- Synchronous vs asynchronous communication
- Service discovery
- Load balancing algorithms: round robin, weighted round robin, least connections, IP hash / consistent hash, random
- Layer 4 vs Layer 7 load balancing
- API gateways
- Connection pooling
- Timeouts and request timeouts
- Deadlines vs timeouts (a deadline is propagated end-to-end across all hops; a timeout is local to one call)
- Retries and idempotency
- Retry budgets (a cap on total retry volume to prevent retry storms)
- Circuit breakers
- Bulkheads
- Backpressure
- Domino effect / cascade failure (one slow or failing component causes downstream failures across the system)
- HTTP/2 multiplexing and persistent connections
- HTTP/3 / QUIC (eliminates head-of-line blocking)
- mTLS (mutual TLS, both client and server present certificates; how services authenticate each other)
- gRPC streaming modes: unary, server streaming, client streaming, bidirectional streaming

Real-world example to include: AWS Aurora MySQL read replica load balancing. Aurora provides a Reader Endpoint that internally load balances read traffic across all read replicas using a DNS-based round-robin. When a replica is added or removed, Aurora updates the reader endpoint automatically. Applications connect to the single reader endpoint and Aurora handles routing, no client-side LB logic needed. This is an example of Layer 4 DNS load balancing handled transparently by the managed service.

**Interview questions to include:**

- How do you handle service failures?
- Why are retries dangerous?
- How do you prevent cascading failures?
- How does a load balancer work?
- What is the difference between round robin and least connections?
- When would you use IP hash load balancing?
- How does Aurora manage read replica traffic without client-side changes?
- How does a circuit breaker prevent a domino effect?

---

## FRONTMATTER TEMPLATE

Use exactly this format:

```mdx
---
title: "{A punchy, specific title, not just the chapter title. Example: 'Circuit Breakers and Retries: Why Your Services Need to Know When to Give Up'}"
date: "2026-11-05"
tags: ["Distributed Systems", "Go", <2-4 more specific tags from the topic>]
summary: "One sentence. What the reader will understand after this chapter that they did not before."
readTime: <estimated reading time in minutes, count ~200 words/min, include code scan time>
series: "distributed-systems"
seriesOrder: 2
draft: false
---
```

---

## CHAPTER STRUCTURE

Follow this structure exactly, in this order. Use these exact section headings.

### 1. TL;DR

Three bullet points. Each under 20 words. The three most important facts a reader should retain. No fluff. Write these last (after writing the full chapter) so they accurately reflect the content.

### 2. The Problem

Open with a concrete failure scenario. A real or realistic production incident that makes the reader feel the pain this topic solves. No theory yet. 2-4 short paragraphs.

Good example opening: "Your service is handling 50,000 requests per second. At 3:12 AM, one of your downstream services starts responding in 8 seconds instead of 50 milliseconds. Within 90 seconds, every thread in your connection pool is waiting. New requests queue behind them. The queue fills. Your load balancer starts seeing timeouts. It retries. Now you have 3x the traffic hitting the already-overwhelmed service. Your service goes down. The downstream service, now receiving zero traffic, recovers. One slow service took down three others. This is cascade failure."

Bad example opening: "In distributed systems, communication is an important property..."

### 3. Chapter Map

A Mermaid `flowchart LR` or `flowchart TD` showing what concepts this chapter covers and how they connect. 5-10 nodes. Keep labels short. Put it right after the problem section, before the mental model.

### 4. Mental Model

One real-world analogy that maps precisely to the concept. Explain the analogy in 2-3 sentences, then in 1-2 sentences say explicitly how it maps. Then add 1-2 sentences stating explicitly where the analogy breaks down. One strong analogy per chapter.

### 5. How It Works

The actual mechanics. Use progressive disclosure: start with the 1-node or 2-node case, show one failure, add complexity, show the next failure. Each layer of complexity surfaces exactly one new problem. Build to the N-node production case step by step.

Use Mermaid diagrams here. For multi-step protocols, show two sequence diagrams: one for the happy path, one for a specific failure path.

For every solution, name its concrete cost: latency added, operational overhead, or failure blast radius.

When a concept reuses something from Chapter 1, name it.

Inline definitions: define every jargon term in parentheses immediately after first use.

### 6. Go Implementation

Build the concept in Go. Always start with the naive/broken version, then iterate to the correct version. Show at least 2 iterations. The final version must be production-quality idiomatic Go.

Each code block must:
- Run with `go run` or `go test` without modification
- Include a `// Output:` comment at the end showing expected output
- Use only stdlib unless a third-party package is essential (if essential, include go.mod snippet)
- Use meaningful variable names
- Have comments that explain WHY
- Handle errors explicitly, never `_` a returned error
- Use `context.Context` where any network or blocking operation is involved
- Use `defer` for cleanup
- After each example, add: `// Try it: https://go.dev/play/p/PLACEHOLDER`
- Note `// requires Go 1.22+` in the run comment if using range-over-integer

When showing a wrong version: `// BAD: reason`
When showing the correct version: `// CORRECT: reason`

For concurrent or distributed code examples, include a failure injection block:
```go
// Failure injection: simulate network partition
// Uncomment to observe the problem this code solves:
// conn.SetDeadline(time.Now().Add(0))
```

Include the "at scale" point for each example: at what number of requests, nodes, or records does the naive version break? Give a concrete threshold.

### 7. Real System Examples

Show how 2-3 real systems implement or solve this exact problem. Be specific. No vague "major cloud providers use this pattern."

Must include the Aurora Reader Endpoint example. Also draw from: Nginx/HAProxy (Layer 4 vs Layer 7), Envoy (circuit breaking configuration), AWS ELB, gRPC (deadline propagation), Kafka (backpressure via consumer lag).

### 8. What Can Go Wrong

A "break it" section. 2-4 failure modes. For each:
- Name the failure mode
- Show Go code (or a Mermaid diagram) that demonstrates how it happens
- Explain why it happens
- State the fix

Must include: retry storms, cascade failure, and connection pool exhaustion.

### 9. Trade-offs

A markdown table. Columns: Approach | Strength | Weakness | Concrete Cost | Use When. 3-6 rows. The "Concrete Cost" column must have a real number or specific operational burden, not "some overhead."

After the table, include a Mermaid decision flowchart "Choosing an approach" that answers the most common design question for communication patterns. 5-10 decision nodes.

### 10. Common Misconceptions

1-3 things engineers commonly believe that are wrong or oversimplified.

Format:
**Misconception:** "..."
**Reality:** "..."

Must include the misconception that retries are always safe.

### 11. Interview Questions

Include all 8 questions from the interview questions list above. For each, give a 3-5 sentence model answer. The answer should be what a strong candidate actually says, not a textbook definition.

Format:
**Q: {question}**
A model answer: ...

### 12. Key Takeaways

5 bullet points. The insights that change how the reader designs systems. Not a summary.

End with a "one true sentence" test: state the chapter's core insight in a single sentence that is not a cliche.

### 13. Navigation

At the very bottom of the MDX:

```mdx
---

**Series:** Distributed Systems for Backend Engineers
**Previous:** [Distributed Systems Fundamentals](/blogs/ds-01-fundamentals) | **Next:** [Consistency and Replication](/blogs/ds-03-consistency)
```

---

## WRITING STYLE RULES

- No em-dashes anywhere (search for the unicode character U+2014 and `--` before finishing)
- Vary sentence length. Short sentences for impact. Never more than 35 words in a sentence.
- Avoid passive voice. "The leader sends a heartbeat" not "A heartbeat is sent by the leader."
- Avoid hedging in factual statements. If something is true, state it. If conditional, state the condition explicitly.
- One strong analogy per chapter.
- Always give concrete numbers for performance claims.
- Use jargon. Define every term the first time it appears inline.
- Use bullet lists for 3+ genuinely parallel items. Do not use bullets to avoid connected prose.
- Peer-to-peer tone. You are an experienced engineer explaining to a smart colleague, not lecturing a student.

---

## MERMAID DIAGRAM RULES

Include at least 2 Mermaid diagrams. For this chapter, the circuit breaker state machine is mandatory. Also recommended: cascade failure flow, load balancer request path, retry budget flow.

Syntax for the MDX code block:
````
```mermaid
<diagram content>
```
````

- For request/response flows: `sequenceDiagram`
- For system component relationships: `flowchart LR` or `flowchart TD`
- For state machines (circuit breaker): `stateDiagram-v2`

Label every node and arrow descriptively.
Good: `Client-->LoadBalancer: HTTP POST /payment`
Bad: `A-->B: request`

Apply "naive first" to diagrams: show the broken architecture, annotate what breaks, then show the improved diagram.

---

## GO CODE QUALITY CHECKLIST

Before writing any Go code block, verify:

- [ ] Runs with `go run file.go` or `go test ./...` as written
- [ ] All imports used, none missing
- [ ] Every error return is handled (no `_` on errors)
- [ ] `context.Context` passed to any function that does I/O or could block
- [ ] `defer` used for resource cleanup
- [ ] Variable names are meaningful (minimum 3 characters except loop indexes `i`, `j`, `k`)
- [ ] No global mutable state without explicit synchronization
- [ ] Expected output shown in `// Output:` comment
- [ ] Wrong/naive version labeled `// BAD:`
- [ ] Correct version labeled `// CORRECT:`
- [ ] go.mod snippet included if any non-stdlib import is used
- [ ] If using `for i := range n` integer range, run comment notes `requires Go 1.22+`

---

## REAL SYSTEM EXAMPLES BANK

Draw from these for the "Real System Examples" section:

| System | What it is known for in this context |
|--------|--------------------------------------|
| Kafka | Backpressure via consumer lag, partition-based load distribution |
| Redis | Single-threaded event loop, circuit breaker state storage |
| AWS Aurora | Reader Endpoint DNS-based load balancing across replicas |
| AWS ELB/ALB | Layer 7 routing, connection draining, health checks |
| Nginx/HAProxy | Layer 4 vs Layer 7 LB, connection pooling, upstream health |
| Envoy | Circuit breaking config (outlier detection), retry policies, bulkheads |
| gRPC | Deadline propagation across hops, streaming modes, keepalive |
| Cloudflare | Anycast, edge load balancing, connection multiplexing |

---

## MDX FILE NAME

Save the output as:
`content/blogs/ds-02-communication.mdx`

---

## QUALITY BAR

Before considering the post done, verify:

- The opening paragraph does NOT start with "In distributed systems..." or any other generic opener
- Every code block compiles and runs
- There are at least 2 Mermaid diagrams (circuit breaker state machine is mandatory)
- No em-dashes anywhere in the file (search for `—` and `--`)
- Every jargon term is defined inline on first use
- The "What Can Go Wrong" section covers retry storms, cascade failure, and connection pool exhaustion
- The trade-offs table has at least 3 rows with concrete costs
- All 8 interview questions have model answers
- Navigation links point to ds-01-fundamentals and ds-03-consistency
