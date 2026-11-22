# Chapter 3: Consistency and Replication — Generation Prompt

Paste everything from the horizontal rule below into a **new Claude session**.
Save the output as `content/blogs/ds-03-consistency.mdx`.

---

You are writing Chapter 3 of a 26-chapter distributed systems engineering series published as MDX blog posts on a personal portfolio site (Next.js, Tailwind CSS, next-mdx-remote, Mermaid diagrams supported). The audience is mid-level to senior backend engineers who want deep, practical understanding, not a Wikipedia summary.

Write the full MDX file for this chapter. Output the raw MDX text only, no commentary around it.

---

## CONTENT PHILOSOPHY

**Write like a book, not a blog post.**
Build understanding layer by layer. Start with why something exists, build a mental model, show how it works, then show what breaks it. A reader finishing this chapter should feel they understand the concept deeply.

**Every concept needs a concrete failure scenario first.**
Show a real production failure that the concept solves, then introduce the concept as the solution.

**Diagrams are mandatory, not decorative.**
Every chapter has at least 2 Mermaid diagrams. Use them for system flows (`sequenceDiagram`), component relationships (`flowchart LR` / `flowchart TD`), state machines (`stateDiagram-v2`), and before/after architectures.

**All Go code must be copy-paste runnable.**
Every Go code block runs with `go run file.go` or `go test ./...` as written. No ellipsis placeholders. Expected output shown in `// Output:` comment.

**Go code must be idiomatic.**
- Errors are values. Every error return is handled. Never `_` an error.
- `context.Context` is the first parameter of any function that does I/O or could block.
- `defer` for cleanup.
- Meaningful variable names (min 3 chars except loop indexes i, j, k).
- Comments explain WHY, not what.

**Show the wrong version before the right version.**
Label `// BAD: reason` and `// CORRECT: reason`.

**Real systems ground every concept.**
After explaining how something works, show how a real system does it: PostgreSQL, Cassandra, DynamoDB, MongoDB, AWS Aurora, Google Spanner.

**NO EM-DASHES. THIS IS AN ABSOLUTE HARD RULE.**
The character `—` (U+2014) must not appear anywhere in the file. Not in prose, not in frontmatter, not in code comments, not in Mermaid diagram labels, not anywhere. Zero occurrences. No exceptions. Also ban `--` as a substitute.

Replace every em-dash with: a comma, a period, a colon, or parentheses.

---

## CHAPTER DETAILS

**Chapter number:** 3
**Chapter title:** Consistency and Replication
**Series order:** 3
**Date:** 2026-11-06
**Previous chapter slug:** ds-02-communication
**Next chapter slug:** ds-04-consensus

**Topics to cover:**

- Why replication exists: fault tolerance, read scaling, geographic distribution
- Single-leader replication: how writes flow from leader to followers, synchronous vs asynchronous replication
- Replication lag: what it is, how it accumulates, what breaks when it is large
- Read-your-writes consistency: the guarantee that after you write, you will see your own write on subsequent reads. Its violation: updating your password, being redirected to a replica, and failing to log in with the new password.
- Monotonic reads: the guarantee that if you read a value, a later read will never return an older value. Its violation: seeing a message in a feed, refreshing, and seeing it disappear.
- Consistent prefix reads: the guarantee that you will never see writes in an order that could not have occurred. Its violation: seeing a reply before the original message.
- Multi-leader replication: when to use it (multi-datacenter writes, offline clients), write conflict detection and resolution
- Conflict resolution strategies: last-write-wins (LWW), application-level merging, CRDTs (conflict-free replicated data types)
- Leaderless replication (Dynamo-style): any node accepts writes, reads and writes use quorums
- Quorum reads and writes: N replicas, W write quorum, R read quorum, the W+R>N guarantee of reading at least one up-to-date replica
- Hinted handoff: when a node is down, another node temporarily stores writes intended for it and delivers them when the node recovers
- Read repair: when a quorum read detects stale replicas, the coordinator writes the fresh value back to them
- Anti-entropy: a background process that compares replicas and repairs divergence, often using Merkle trees
- Merkle trees: a tree of hashes where each node is the hash of its children, allowing efficient detection of which data ranges differ between two replicas
- Vector clocks and version vectors: per-replica counters that capture causal relationships between writes, allowing detection of concurrent writes that may conflict
- Consistency models: strong consistency (linearizability), sequential consistency, causal consistency, read-your-writes, monotonic reads, eventual consistency. Order them from strongest to weakest.
- Linearizability: the strongest consistency model. Once a write completes, all subsequent reads from any node return that value. Equivalent to having only one copy of the data.
- Causal consistency: a weaker model where causally related operations are seen in order by all nodes. Concurrent operations may be seen in different orders by different nodes.

**Real-world example to include:** PostgreSQL streaming replication. The primary writes to its WAL (write-ahead log). The WAL sender process streams WAL records to standby servers. Each standby's WAL receiver writes to its local WAL and replays them into its local data files. Replication lag is measured as the difference between the primary's current LSN (log sequence number) and the standby's replay LSN. You can query `pg_stat_replication` on the primary to see lag per standby in bytes and estimated seconds. Synchronous replication (`synchronous_commit = on`) forces the primary to wait for the standby to acknowledge the WAL record before returning success to the client. This eliminates replication lag at the cost of write latency equal to one network roundtrip to the standby.

**Interview questions to include:**

- What is the difference between strong consistency and eventual consistency?
- What is replication lag and what problems does it cause?
- How does a quorum prevent reading stale data?
- What is the difference between linearizability and sequential consistency?
- How do you handle write conflicts in a multi-leader setup?
- What is hinted handoff and when does it help?
- How does Cassandra achieve high write availability?
- What is a read-your-writes violation and how do you fix it?

---

## FRONTMATTER TEMPLATE

Use exactly this format:

```mdx
---
title: "{A punchy, specific title. Example: 'Replication and Consistency: Why Your Read Might Return Yesterday\'s Data'}"
date: "2026-11-06"
tags: ["Distributed Systems", "Go", <2-4 more specific tags from the topic>]
summary: "One sentence. What the reader will understand after this chapter that they did not before."
readTime: <estimated reading time in minutes, count ~200 words/min, include code scan time>
series: "distributed-systems"
seriesOrder: 3
draft: false
---
```

---

## CHAPTER STRUCTURE

Follow this structure exactly, in this order. Use these exact section headings.

### 1. TL;DR

Three bullet points. Each under 20 words. The three most important facts a reader should retain. Write these last (after writing the full chapter) so they accurately reflect the content.

### 2. The Problem

Open with a concrete failure scenario. Use the read-your-writes violation: a user changes their password, the write succeeds on the leader, the user is redirected to another page whose server reads from a replica with 2-second replication lag, the login fails with the old password, the user thinks the password change did not work and tries again. This is not a bug in the application code. It is a consequence of replication lag with no read-your-writes guarantee. 2-4 short paragraphs.

### 3. Chapter Map

A Mermaid `flowchart TD` showing what concepts this chapter covers and how they connect. 6-10 nodes.

### 4. Mental Model

One strong analogy. Use the Google Docs offline editing analogy: when you and a colleague edit a shared document simultaneously offline (airplane mode), you each make different changes. When you reconnect, the app must merge your changes. If the same sentence was edited differently by both of you, there is a conflict. The app must resolve it. This is exactly multi-leader replication with conflict detection. The analogy breaks down because Google Docs has a central server that acts as an arbiter; true multi-leader replication has no such central authority. State the breakdown explicitly.

### 5. How It Works

Use progressive disclosure. Start with single-leader, show its failure modes, then add complexity. Each layer surfaces exactly one new problem.

Subsections:
- **Single-Leader Replication** (sync vs async replication, sequence diagram showing both paths)
- **Replication Lag and Its Anomalies** (read-your-writes, monotonic reads, consistent prefix reads, each with a concrete example and sequence diagram)
- **Multi-Leader Replication** (when it makes sense, write conflicts)
- **Conflict Resolution** (LWW, application merge, CRDTs)
- **Leaderless Replication and Quorums** (Dynamo-style, N/W/R explanation with the math)
- **Hinted Handoff and Read Repair**
- **Anti-Entropy with Merkle Trees**
- **Consistency Models Spectrum** (from linearizable to eventual, with concrete examples of each)

The quorum section must include the math: W + R > N guarantees at least one node in the read quorum has the most recent write. Show with concrete numbers: N=3, W=2, R=2, W+R=4>N=3. Any 2-node read set must overlap with any 2-node write set by at least 1 node. Include a Mermaid diagram showing the overlap.

### 6. Go Implementation

Build at least two examples. Always start with the naive/broken version, then iterate to the correct version.

**Example 1: Replication lag and read-your-writes violation**
Show a simple in-memory primary/replica pair. Write to the primary. Immediately read from the replica (before replication completes). Show the stale read. Then show the fix: route reads to the primary for one second after any write from the same client (a simple read-your-writes implementation using a last-write timestamp).

**Example 2: Quorum write and read simulation**
Simulate N=3 nodes where W=2 and R=2. Write to 2 nodes (one is "slow" and skipped). Read from 2 nodes. Show that the read quorum always intersects the write quorum, returning the fresh value. Then show what breaks when W=1, R=1 (W+R=2, not >N=3): a read can miss the write.

Each code block must:
- Run with `go run` or `go test` without modification
- Include `// Output:` comment
- Use only stdlib unless a third-party package is essential
- Handle all errors (no `_` on errors)
- Use `context.Context` where any network or blocking operation is involved
- Use `defer` for cleanup
- After each example: `// Try it: https://go.dev/play/p/PLACEHOLDER`
- Include a `// Failure injection:` block (commented out) showing how to trigger the problem
- If using `for i := range n` integer range: add `// requires Go 1.22+` in run comment

### 7. Real System Examples

Must include:
- **PostgreSQL streaming replication** (WAL, WAL sender/receiver, pg_stat_replication, synchronous_commit, LSN)
- **Cassandra** (leaderless, tunable consistency: ONE, QUORUM, ALL, LOCAL_QUORUM, hinted handoff, read repair)
- **DynamoDB** (eventually consistent reads default, strongly consistent reads cost 2x read capacity units, global tables for multi-region active-active)
- **MongoDB** (replica sets with single-leader, Raft-based elections, write concern w:majority, read preference)

### 8. What Can Go Wrong

Three failure modes. For each: name it, show Go code or a Mermaid diagram demonstrating how it happens, explain why it happens, state the fix.

Must include:
- **Replication lag spike causing read-your-writes violations** at scale
- **Quorum misconfiguration**: W=1, R=1, N=3 (W+R=2, not >N=3, so reads can miss writes)
- **Split-brain in single-leader setup**: a network partition causes two nodes to both think they are the leader, both accept writes, data diverges

### 9. Trade-offs

A markdown table. Columns: Approach | Strength | Weakness | Concrete Cost | Use When. At least 4 rows:
- Synchronous single-leader replication
- Asynchronous single-leader replication
- Multi-leader replication
- Leaderless replication with quorum (W=2, R=2, N=3)

After the table, a Mermaid `flowchart TD` decision tree titled "Choosing a replication strategy."

### 10. Common Misconceptions

**Misconception:** "Eventual consistency means stale for a few milliseconds."
**Reality:** Under a network partition, eventual consistency gives no time bound. Data can diverge indefinitely. "Eventually" means "when the partition heals." That could be seconds, minutes, or never.

**Misconception:** "Quorum reads always return the latest write."
**Reality:** Only when W + R > N. With W=1 and R=1 on N=3 nodes, you can read a node that never received the write. The W+R>N condition is necessary, not just helpful.

**Misconception:** "Single-leader replication means no data loss on failover."
**Reality:** With asynchronous replication, the leader acknowledges writes before they reach any follower. If the leader crashes, those writes are lost. Only synchronous replication prevents this, at the cost of write latency equal to one round-trip to the standby.

### 11. Interview Questions

Include all 8 questions listed above. For each, give a 3-5 sentence model answer. The answer should be what a strong candidate actually says, not a textbook definition.

Format:
**Q: {question}**
A model answer: ...

### 12. Key Takeaways

5 bullet points. The insights that change how the reader designs systems. Not a summary.

End with the chapter's core insight in a single sentence that is not a cliche.

### 13. Navigation

```mdx
---

**Series:** Distributed Systems for Backend Engineers
**Previous:** [Distributed Communication](/blogs/ds-02-communication) | **Next:** [Consensus and Leader Election](/blogs/ds-04-consensus)
```

---

## WRITING STYLE RULES

- No em-dashes anywhere (search for U+2014 and `--` before finishing)
- Vary sentence length. Short sentences for impact. Never more than 35 words in a sentence.
- Avoid passive voice. "The leader sends a WAL record" not "A WAL record is sent by the leader."
- Avoid hedging in factual statements. If something is true, state it. If conditional, state the condition explicitly.
- One strong analogy per chapter (the Google Docs offline editing analogy).
- Always give concrete numbers for performance claims.
- Use jargon. Define every term the first time it appears inline.
- Peer-to-peer tone.

---

## MERMAID DIAGRAM RULES

Include at least 2 Mermaid diagrams. Mandatory diagrams:
1. Single-leader replication: `sequenceDiagram` showing both sync and async paths side by side or sequentially
2. Quorum overlap: `flowchart` showing 3 nodes, W=2 write set, R=2 read set, and their intersection

Also recommended:
- Read-your-writes violation sequence diagram
- Consistency models spectrum (flowchart TD from linearizable to eventual)
- Monotonic reads violation sequence diagram

Syntax for the MDX code block:
````
```mermaid
<diagram content>
```
````

Rules:
- Do NOT use `\n` in `sequenceDiagram` participant `as` aliases. Use `Note over` for multi-line info instead.
- No em-dashes in diagram labels. Use colons or commas instead.
- Label every node and arrow descriptively.
- For `flowchart` nodes with multi-word labels, use quotes: `A["Multi word label"]`
- Apply "naive first" to diagrams: show the broken case, then the fixed case.

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
- [ ] `// Try it: https://go.dev/play/p/PLACEHOLDER` after each example
- [ ] `// Failure injection:` block included (commented out) for distributed/concurrent examples

---

## REAL SYSTEM EXAMPLES BANK

| System | Relevant behavior |
|--------|-------------------|
| PostgreSQL | WAL streaming replication, WAL sender/receiver, pg_stat_replication, synchronous_commit = on/off, LSN comparison for lag measurement |
| Cassandra | Leaderless, tunable consistency per query (ONE, QUORUM, ALL, LOCAL_QUORUM), hinted handoff for down nodes, read repair on quorum reads, anti-entropy via Merkle trees |
| DynamoDB | Eventually consistent reads default, strongly consistent reads cost 2x read capacity units, global tables for multi-region active-active replication |
| MongoDB | Replica sets (single-leader), Raft-based elections, write concern w:majority for durability, read preference (primary/primaryPreferred/secondary/nearest) |
| AWS Aurora | Shared storage layer with 6 copies across 3 AZs, reader endpoint, no traditional replication lag (storage-level replication) |
| Google Spanner | TrueTime API provides bounded clock uncertainty, external consistency (stronger than linearizability across datacenters) |

---

## MDX FILE NAME

Save the output as:
`content/blogs/ds-03-consistency.mdx`

---

## QUALITY BAR

Before considering the post done, verify:

- Opening paragraph does NOT start with "In distributed systems..." or any other generic opener
- Every code block compiles and runs
- At least 2 Mermaid diagrams (single-leader replication sequence and quorum overlap are mandatory)
- Zero em-dashes anywhere in the file (search for `—` and `--`)
- Every jargon term defined inline on first use
- "What Can Go Wrong" covers replication lag spike, quorum misconfiguration, and split-brain
- Trade-offs table has at least 4 rows with concrete costs
- All 8 interview questions have model answers
- Navigation links point to ds-02-communication and ds-04-consensus
