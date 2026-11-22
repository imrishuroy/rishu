# Scaling Reads: Blog Series Design

## What This Is

A 16-post engineering blog series on scaling read-heavy systems. The series serves two audiences simultaneously: engineers preparing for system design interviews who want the depth that separates strong candidates, and engineers building real systems who want the actual code, the failure modes, and the tradeoffs behind every pattern.

Core concepts are built from first principles and demonstrated with working Go implementations on a shared reference codebase. Each post has at least one runnable local experiment. Database and cloud-provider comparisons are sourced discussions, not claims that every product is implemented or benchmarked locally.

Posts build on each other using the same reference codebase. Each change must respond to a measured bottleneck or correctness requirement. Partitioning, sharding, and specialized databases are conditional choices, not mandatory upgrades that every deployment accumulates.

## Intended Reader

Backend engineers at any level. A junior engineer should finish Post 1 understanding why their queries are slow. A staff engineer should find Posts 11-16 genuinely useful. Every jargon term is defined inline on first use - not in a glossary, woven into the prose so the definition lands in context.

Each post states its prerequisites. Keep the main explanation accessible, with optional deeper sections for implementation details and operational tradeoffs. Interview readers can follow the mental models and decision summaries; implementation readers also run the experiments and failure tests.

## Reference System

A profile and feed service: a minimal Twitter/LinkedIn-style read path.

Three initial tables: `users`, `posts`, `follows`. Later chapters add feed projections, outbox events, and worker progress through explicit migrations.

Three read endpoints:
- `GET /users/:id` - profile lookup. Same data, millions of reads.
- `GET /feed/:userId` - assembled feed from followed users. Expensive, classic fan-out problem.
- `GET /posts/:id` - single post lookup.

Post 1 starts with the dumbest possible implementation. Every subsequent post modifies this same codebase.

### Mutation and Read Contracts

Add minimal authenticated mutation endpoints for updating profiles, creating/editing/deleting posts, following/unfollowing users, blocking users, and changing post visibility. Use deterministic test identities; building a complete identity provider is outside the series. These operations drive the correctness experiments, not just the seed script.

| Read | Required behavior |
|---|---|
| Profile and single post | After an acknowledged mutation, the writer's subsequent read observes that mutation or a newer state, or returns an explicit failure. It must not silently return an older value. |
| Feed | Reverse chronological order by `(created_at, id)`, no duplicate post IDs within a page. Across pages, document how concurrent inserts, edits, and deletes affect traversal; a cursor alone does not create a snapshot. |
| Other readers and derived views | Each experiment declares a freshness target and measures convergence time and violations. A TTL alone is not a guarantee when stale upstream reads can refill a cache. |
| Deletion and access revocation | A read initiated after the mutation is acknowledged must not serve deleted or newly unauthorized content. Validate current access and deletion state before serving cached objects or feed candidates; fail closed when that validation is unavailable. |

Start with primary-backed checks for these guarantees, include their cost in measurements, and retain them until an alternative passes the same tests. Public HTTP-caching labs use immutable fixtures; mutable or access-controlled content bypasses shared caches unless a separately stated invalidation contract is demonstrated.

### Companion Repository

Public GitHub repo: `imrishuroy/scaling-reads`

Structure:
```text
scaling-reads/
|-- cmd/server/        HTTP server entry point
|-- internal/
|   |-- store/         DB layer (evolves across posts)
|   |-- cache/         Redis layer (added in Post 6)
|   |-- feed/          Fan-out logic (added in Post 12)
|   `-- worker/        Pre-computation (added in Post 13)
|-- docker-compose.yml Base services + optional lab profiles
|-- migrations/        SQL schema
`-- load/              k6 arrival-rate scenarios + workload fixtures
```

Each post links to its corresponding git tag so readers can check out the exact state of the code at that point in the series.

Each tag pins Go, database, cache, load-generator, and container versions. Include seed/reset commands, migrations, health checks, minimum resource requirements, and the exact Compose command for that chapter. CI runs correctness tests and smoke-load scenarios; published performance measurements remain separate from noisy shared CI runs.

## Tech Stack for Code Examples

- **Go** - primary language for all application code. Idiomatic Go throughout.
- **PostgreSQL** - primary database. Replica setup via docker-compose.
- **Redis** - cache layer. `go-redis` client.
- **SQL** - raw queries shown and explained.
- **Shell** - docker-compose, migration commands, load test invocations.
- **No cloud account required** - all required experiments run with `docker compose` and the chapter's documented profiles. Real cloud/CDN comparisons remain optional and sourced.

## Diagrams

Mermaid diagrams are embedded in MDX as rendered SVG assets or through a validated build-time rehype plugin. Diagrams appear where a picture clarifies a flow: cache request paths, replica routing, fan-out write paths, and cache layers. Include accessible descriptions and readable mobile layouts. Not every post needs a diagram.

## Writing Style

- Plain sentences. No filler. Every sentence earns its place.
- No em-dashes. No marketing language. No fake metrics.
- Numbers over adjectives: "800ms p99" not "very slow."
- Every jargon term defined inline on first use, then used freely after.
- Textbook-level precision: complete enough for a beginner, dense enough to be useful to a staff engineer.
- No comments in code that describe what the code does. Only comments that explain non-obvious why.
- Distinguish measured results, hypothetical workload inputs, and externally sourced numbers. Published measurements include raw results and reproduction commands; never preselect a throughput or CPU result for the story.
- Cite version-specific documentation and dated engineering accounts for product behavior. Do not present historical company architectures as universal current practice.

## Post Shape

Each post follows this structure:

1. **Hook** - a concrete failure or problem, measured in numbers.
2. **Mental model** - first principles, all terms defined.
3. **Code** - complete runnable implementation in the companion repo, with the important changes explained in the article.
4. **Break it** - load or deterministic fault-injection test showing the failure mode before the fix.
5. **Fix it** - Go implementation of the solution, explained where non-obvious.
6. **Tradeoffs** - what you gave up. Nothing is free.

Every post also includes prerequisites, a correctness invariant, exact reproduction commands, observed results, and when not to use the technique. Check both performance and correctness after the fix. Deliberately unsafe intermediate implementations must name their failure mode and the chapter that repairs it.

## The 16 Posts

### Post 1: The Baseline
Build the naive server: single Postgres instance, no cache, raw queries. Instrument with latency metrics from day one (p50/p95/p99). Show the N+1 query problem with a load test. Add connection pooling with `pgxpool` and show the difference. Introduce query batching (`WHERE id IN (...)`) to replace N individual queries.

Load test methodology: use k6 constant-arrival-rate scenarios for overload experiments. Explain when closed-loop, constant-concurrency tests are appropriate and how their arrival rate falls as the server slows, potentially concealing overload through coordinated omission.

Every benchmark records dataset size and seed, hot-key/follower skew, endpoint and read/write mix, payload sizes, warm/cold cache state, warm-up and measurement duration, repetitions, software versions, hardware, and container resource limits. Report offered and achieved throughput, active concurrency, errors/timeouts, dropped iterations, and generator saturation alongside latency percentiles. State which requests the latency distribution includes. Save raw results and separate load-generator limits from service limits.

Instrument pool acquisition wait, SQL execution, cache calls, serialization, and end-to-end request time separately using metrics and sampled traces. Introduce `pg_stat_statements`, Go profiling, request cancellation, and bounded dependency deadlines. Show why more pooled connections can increase contention instead of throughput. Use route templates rather than user IDs as metric labels.

Readers leave with a measured baseline and the tools to measure everything that follows.

**Key terms defined:** p50/p95/p99, N+1 query, connection pool, query batching, open-loop vs closed-loop load test, coordinated omission.

### Post 2: Indexes
The foundation everything else rests on. B-tree indexes: how they work, what they cost on writes, and when they help. Composite indexes and column order: `(user_id, created_at)` is not the same as `(created_at, user_id)`; pin the PostgreSQL version and explain planner-dependent exceptions rather than claiming later columns can never be used. Covering indexes with `INCLUDE`: an index-only scan avoids a candidate row's heap fetch when its corresponding heap page is marked all-visible. Fresh writes clear visibility bits, and old snapshots can prevent vacuum from marking pages all-visible.

Partial indexes for sparse conditions (`WHERE deleted_at IS NULL`). Use `EXPLAIN (ANALYZE, BUFFERS)` with seeded data to inspect estimates, actual rows, heap fetches, buffer hits, and sort spills. Do not assert one exact plan across all versions and data distributions. Introduce MVCC, autovacuum, `ANALYZE`, long transactions, index bloat, and safe concurrent index creation/reindexing before adding more infrastructure.

**Key terms defined:** B-tree, index scan vs seq scan, heap fetch, index-only scan, visibility map, index bloat, EXPLAIN ANALYZE.

### Post 3: Table Partitioning
Keeping hot tables small. Range partitioning for time-series data: `posts` partitioned by month, queries on recent posts skip old partitions entirely. List partitioning for categorical splits. Hash partitioning for even distribution. Partition pruning - Postgres eliminates irrelevant partitions at both plan time and execution time depending on whether the partition key value is known statically. Cover the complication: `GET /posts/:id` by ID alone cannot prune partitions when the date is unknown - requires either a composite lookup or a separate ID-to-partition index. Partitioned unique constraints must include the partition key. What happens to indexes across partitions.

**Key terms defined:** partition pruning, range/list/hash partitioning, declarative partitioning, partition key.

### Post 4: Database Choices
When to leave Postgres. The access pattern drives the decision - not hype.

| Workload | Candidates | Why Consider Them |
|---|---|---|
| OLTP reads (profiles, feeds) | PostgreSQL | Strong consistency, rich query, replicas |
| High-volume key-value reads | DynamoDB, Redis | Direct key access; latency and capacity depend on key distribution, payload, provisioning, and topology. Durability and consistency requirements determine suitability. |
| Time-series (metrics, logs) | TimescaleDB, ClickHouse | Columnar compression, fast aggregations |
| Full-text search | Elasticsearch, Postgres FTS | Inverted index, relevance scoring |
| Analytics (GROUP BY billions) | ClickHouse, BigQuery | Columnar, vectorized execution |

Covers Cassandra's tunable consistency (`ONE` vs `QUORUM` vs `ALL`) and why it fits high-throughput writes but punishes ad-hoc queries. Covers DynamoDB's GSI model for secondary access patterns and its cost implications.

The runnable experiment compares two PostgreSQL access patterns on the reference workload. External products are a sourced decision exercise, not locally validated performance claims. Include consistency, durability, migration effort, and operating cost in the decision, not just latency.

**Key terms defined:** OLTP, OLAP, columnar store, tunable consistency, GSI.

### Post 5: Multi-Tier Caching
The full caching stack as a system before diving into individual layers:

```
Browser cache      Cache-Control, ETags, max-age
      miss
CDN / edge cache   Cloudflare, CloudFront - PoPs close to the user
      miss
Reverse proxy      Nginx, Varnish - response-level caching
      miss
Application cache  Redis, in-process LRU
      miss
Database cache     PostgreSQL shared buffers
      miss
OS page cache      File-system pages
      miss
Disk
```

For each layer, compare measured latency, capacity, invalidation complexity, and cost. This is a conceptual hierarchy, not a mandatory serial path. Materialized views are explicitly queried derived relations, not an automatic database cache. Use shared HTTP caches for suitable public responses and versioned assets; the reference service keeps personalized and access-controlled responses out of shared caches. Session state and disposable object caches have different eviction and durability requirements.

Measure the complete operation, including serialization, locking, and network overhead, instead of assigning universal nanosecond/microsecond labels. Estimate working-set size, cache memory overhead, hit/miss rates, origin load during cold starts, and the cost of adding another layer.

**Key terms defined:** PoP (point of presence), buffer pool, cache hierarchy, cache hit rate.

### Post 6: Cache-Aside, Write Strategies, Eviction, Warming
Cache-aside in Go with `go-redis`. What to cache: individual objects, computed aggregates, full feed pages - each has a different invalidation story and memory cost.

Write strategies compared:
- **Cache-aside** (lazy load) - the application loads and stores data on a miss; the write path must separately invalidate or update cached data. Cold-cache behavior must fit the origin's capacity.
- **Write-through** - write to cache and DB on every write. Not inherently atomic: if the DB write succeeds and the cache write fails (or vice versa), the two are inconsistent. Cover partial failure handling, invalidation-after-commit patterns, and the stale fill race where a slow cache write overwrites a newer value.
- **Write-behind** (write-back) - acknowledge before the asynchronous DB write; durability depends on persistence, replication, and replay. An in-memory-only implementation can lose acknowledged writes on a crash.
- **Read-through** - cache sits in front of DB, fetches on miss automatically.

Cache consistency is the hard part of all strategies: cover TTL jitter (randomize TTL to prevent synchronized expiry), negative caching (cache "not found" results to avoid DB hammering for missing keys), and key versioning to detect stale fills.

TTL jitter addresses synchronized load, not write correctness. Define freshness targets, distinguish a missing key from a cache outage, and expire or invalidate negative entries when an object is created. Reproduce an old fill arriving after an update or delete. Test version checks when the newer entry has been evicted; do not assume the cache retains version metadata forever. Cover cross-instance invalidation, key-format changes, and current authorization checks for cached data.

Eviction policies: Redis's approximate LRU (least recently used), LFU (least frequently used), `allkeys-*` versus `volatile-*`, and `noeviction`. Explain `maxmemory`, headroom, memory overhead, and admission policy, which decides whether an object should enter the cache at all. ARC (adaptive replacement cache) is an optional in-process comparison, not a Redis eviction setting.

Cache warming: startup preload of top-N hot keys, shadow traffic replay, lazy warming with request coalescing to prevent cold-start thundering herd.

**Key terms defined:** cache-aside, write-through, write-behind, eviction policy, LRU, LFU, cache warming, cold start.

### Post 7: The Stampede Problem
Extend Post 6's warming/coalescing example to a hot-key expiration under sustained load. Measure concurrent origin fetches and database load. Fix 1: `golang.org/x/sync/singleflight` allows one in-flight fetch per key within a shared `Group`; overlapping callers share its result. It is not a cache, does not combine sequential requests, and does not coordinate separate processes. Test caller cancellation, fetch deadlines, and multiple application instances.

Fix 2: probabilistic early refresh, with the probability increasing near expiration and accounting for recomputation duration. State the chosen algorithm and its assumptions. Compare with bounded stale-while-revalidate where the read contract allows it. Any distributed refresh lease must account for expiration and late workers; duplicate suppression alone does not guarantee write correctness. Publish before/after load and correctness results.

**Key terms defined:** cache stampede, thundering herd, singleflight, probabilistic early expiry.

### Post 8: CDN and HTTP Caching
The outermost cache ring. `Cache-Control` header anatomy: `max-age`, `s-maxage`, `private`, `public`, `no-cache`, and `no-store`. Distinguish storage prohibition from mandatory validation. ETags and conditional requests: the client sends `If-None-Match`, and the server can return a bodyless 304 for an unchanged GET representation. `stale-while-revalidate` permits serving stale content within its allowed window while refreshing in the background, avoiding the wait for origin revalidation rather than eliminating latency.

Cover `Vary`, cache-key isolation, authenticated requests, and cookies. `Set-Cookie` alone does not prohibit caching, and `Vary` is not an authorization mechanism. Test two identities against the same URL and verify that neither receives the other's representation. Explain why an ETag may save bandwidth without avoiding the underlying query.

Use a local reverse proxy and immutable public fixtures to demonstrate shared caching, invalidation, and cache-busting URLs. Personalized or access-controlled endpoints bypass shared caching in this reference implementation. Cloudflare/CloudFront configuration is optional sourced material; local tests do not measure geographic CDN latency.

**Key terms defined:** ETag, conditional request, stale-while-revalidate, cache-busting, PoP, cache purge.

### Post 9: Pagination
Offset-based (`LIMIT n OFFSET m`) - simple, universally supported, silently degrades. At offset 10,000 the DB scans and discards 10,000 rows. Inconsistent results when rows are inserted or deleted between pages.

Keyset / seek method: `WHERE id < :last_seen ORDER BY id DESC LIMIT 20`. With a matching index and suitable filters, the seek plus page retrieval is approximately O(log n + k) for k returned rows; it avoids scanning all earlier pages. Additional filtering can increase the work. No arbitrary page jumps, and no automatic snapshot guarantee.

Composite cursor - `WHERE (created_at, id) < (:ts, :id)` - handles ties in time-ordered feeds. Encodes cursor as opaque base64 for clients.

Use matching `ORDER BY created_at DESC, id DESC` and index order. Validate cursor structure, version, filter scope, and page size; base64 is encoding, not integrity protection or authorization. Test equal timestamps, concurrent inserts/deletes, and changes to sort keys. Define when snapshot semantics are required, especially for exports.

TID scan (Postgres-specific) - uses physical tuple ID (`ctid`) to scan heap pages directly. Fast for bulk export and data migration. Not stable: `ctid` changes on row updates and `VACUUM FULL` (ordinary VACUUM does not move rows). Not for user-facing pagination.

Full Go implementation of each strategy on the reference codebase. Load test showing where offset breaks.

**Key terms defined:** keyset pagination, cursor, TID (tuple ID), seek method, VACUUM.

### Post 10: Read Replicas
Spin up a Postgres replica in docker-compose with streaming replication. Route reads to replicas, writes to primary - two separate `pgxpool` instances in Go. Replication lag: how to detect it (`pg_stat_replication`, WAL positions), what the numbers mean, what the user sees when lag is 2 seconds. Read-your-own-writes (ROWC) - after a user writes, route their own reads to the primary for a short window. This is a heuristic: if replication lag exceeds the routing window, the user still sees stale data. Cover the more robust alternative: track the write's WAL position and wait for the replica to replay past that point before routing to it. A stale cache hit can also bypass primary routing entirely - cover interaction between replica lag and cache state. Load balancing reads across multiple replicas. Eventual consistency - defining it precisely, when it is acceptable and when it is not.

**Key terms defined:** streaming replication, replication lag, read-your-own-writes, eventual consistency, strong consistency, primary/replica.

Capture a WAL watermark after commit on the primary, not an LSN from before the commit. Check replay progress on the specific replica that will serve the read. Bound the wait and fall back to the primary within the request budget or return an explicit failure. Specify cache bypass/version checks for read-your-writes and test a lagging replica refilling a cache after invalidation. Cover recovery conflicts, WAL retention from replication slots, and why read scaling is not by itself an automatic failover design.

### Post 11: The Hot Key Problem
Generate skewed profile-read traffic so one hot key receives a disproportionate share of requests. Measure the overloaded node's CPU, latency, and throughput relative to other nodes. Follower count alone does not determine profile-read traffic; state the request distribution used in the experiment.

Important distinction: consistent hashing does not fix a hot key. It assigns ownership, and a single hot key still maps to one owner. Fix 1: a bounded local in-process cache reduces Redis traffic, but misses, refreshes, and invalidations still reach upstream services. Fix 2: key replication stores copies across different Redis nodes and spreads reads across them. Verify actual slot placement; different key names alone do not guarantee different nodes, and shared hash tags can colocate copies. Cover memory cost, invalidation, and inconsistent copies. Fix 3: `singleflight` coalesces overlapping fetches within one process; its benefit depends on overlap and it does not replace caching or replication.

Contrast consistent hashing and virtual-node rings with Redis Cluster's fixed 16,384 hash slots. Redis maps keys to slots and reassigns slots between nodes during resharding; this is a distinct approach, not an implementation of a consistent-hashing ring.

Trace local-cache hits, Redis hits, and database fetches across multiple application instances. Measure each path, including expiration, invalidation, and authorization work. Avoid universal latency labels or assuming all upstream calls occur only on misses.

**Key terms defined:** hot key, consistent hashing, hash slot, virtual nodes, hash ring, local cache, key replication.

### Post 12: Fan-Out Strategies
The feed endpoint. Two approaches:

**Fan-out on read** - assemble candidates from followed users at request time and merge/sort them. Freshness depends on the database snapshot, replica, and cache used. Compare an indexed set-based query with the naive N+1 version; 1000 follows do not inherently require 1000 queries. Measure rows examined, sorting, and bounded parallelism as follow counts increase.

**Fan-out on write** - when a user posts, write their post ID into every follower's feed table. Reads become a single lookup. Fast reads, expensive writes. Breaks for celebrities: a user with 5M followers triggers 5M writes on every post.

**Hybrid** - fan-out on write for users with fewer than N followers, fan-out on read for high-follower accounts. Merge at query time. The threshold N is determined by the cost of write fan-out vs the cost of read-time assembly for the specific workload - not a universal number.

Full Go implementation of all three, including merge logic, workload-based thresholds, inactive-reader policy, retention, and write amplification. Cover deduplication, unfollow/block/delete handling, and authorization filtering of stored candidates. Background fan-out starts with an explicitly crash-unsafe in-memory worker. Demonstrate lost work on process termination; Post 13 replaces it with durable delivery before it can be treated as reliable.

**Key terms defined:** fan-out on write, fan-out on read, hybrid fan-out, feed table, merge at query time.

### Post 13: Pre-Computation Workers, Materialized Views, CQRS
Background Go worker that materializes feeds, leaderboards, and aggregates ahead of time. Candidate retrieval becomes a precomputed lookup; current authorization and deletion checks remain on the read path. Ticker-based scheduling, work queue, goroutine pool.

Durability: in-memory workers lose in-flight work on crash. Cover persisted progress checkpoints - the worker records its position durably so it can resume without replaying from the beginning. The outbox pattern for reliable event delivery: write the event to a DB table in the same transaction as the write, then have the worker read and process from that table. This separates the commit-to-event gap from downstream delivery guarantees. Idempotent processing so replays are safe.

Persist completion only after the side effect succeeds. Where projection writes and acknowledgments share a database, make them transactional; across systems, use idempotency and retry-safe version checks. Test a crash after applying an event but before acknowledgment, duplicate delivery, out-of-order events, and failed batches. Do not skip unprocessed events by treating a sequence ID as commit order. Define retry limits, failed-event handling, replay, and per-entity ordering requirements.

Rebuild a read model while writes continue using a defined snapshot/change boundary, checkpoints, reconciliation, and a validated cutover. Include deletions and schema evolution; the outbox alone does not make backfills correct.

Backpressure - what happens when the worker falls behind, how to detect it (queue depth, lag metric), how to recover.

Postgres `CREATE MATERIALIZED VIEW` and `REFRESH MATERIALIZED VIEW CONCURRENTLY`: DB-native pre-computation with a populated view and a qualifying unique index covering all rows and using plain columns. `CONCURRENTLY` permits concurrent reads; it does not provide incremental view maintenance, and only one refresh can run per view at a time. Refresh scheduling, monitoring, failure handling, resource cost, and freshness remain the operator's responsibility. Compare full refresh with application-managed incremental projections.

CQRS (Command Query Responsibility Segregation) - the architectural pattern that formalizes the separation: write model updates the primary store, read model is a separately optimized view. How the worker is the bridge between the two.

**Key terms defined:** pre-computation, materialized view, CQRS, command model, query model, backpressure, idempotent worker.

### Post 14: Search - Inverted Indexes and Elasticsearch
Why a B-tree index on a `text` column cannot do full-text search efficiently. The forward index (`doc → words`) flipped to an inverted index (`word → docs list`) - how this makes "find all documents containing 'idempotent'" a direct lookup instead of a full scan.

Elasticsearch internals: shards, segments, Lucene underneath, and configurable near-real-time refresh behavior. Verify defaults for the pinned deployment rather than promising every write becomes searchable within one second. Relevance scoring: TF-IDF, BM25, and why query term frequency and document frequency both matter.

Postgres FTS: `tsvector`, `tsquery`, GIN indexes. When Postgres FTS is enough vs when to reach for Elasticsearch. Analyzers and tokenizers - how "Running" becomes "run", why language matters.

Reuse Post 13's outbox to avoid losing the event between the PostgreSQL commit and search indexing. Test duplicate/out-of-order updates, deletes, and rebuilding an index while writes continue. Measure commit-to-search visibility separately from HTTP response latency. Revalidate current access before returning search results so stale indexed permissions do not expose content.

**Key terms defined:** inverted index, forward index, TF-IDF, BM25, shard (Elasticsearch), segment, near-real-time (NRT), tsvector, tokenizer, analyzer, dual-write, outbox pattern.

### Post 15: Sharding
When read replicas and caching are not enough - the primary write throughput or storage size is genuinely the bottleneck. Horizontal partitioning across independent database instances.

Shard key design: high cardinality, even load distribution, and alignment with access patterns. Increasing timestamps and sequential IDs can concentrate writes under range routing; hashing those values can distribute them. Conversely, hashing cannot spread one exceptionally hot logical key without changing the data model. Distinguish even key counts from even traffic.

Range-based vs hash-based sharding. With balanced equal-weight consistent hashing, adding one node to N existing nodes moves approximately 1/(N+1) of keys in expectation, not an exact guaranteed fraction. Distinguish routing from actually migrating data. Cover cross-shard queries, denormalization, and a rebalancing lab with backfill, concurrent changes, routing cutover, validation, and rollback. Do not claim zero downtime without measuring availability during the migration.

**Key terms defined:** shard, shard key, hash sharding, range sharding, cross-shard query, shard rebalancing, hotspot.

### Post 16: Rate Limiting and Circuit Breakers
Protecting the read path from abuse and cascade failure.

Rate limiting: token bucket and sliding window algorithms. Go implementation using Redis as the shared counter across instances. Per-user limits vs per-IP limits vs global limits. What to return on limit hit (429, Retry-After header).

Circuit breakers: when the DB or Redis is slow, stop hitting it rather than letting the backlog grow. Three states - closed (normal), open (failing, reject fast), half-open (probe recovery). Go implementation with a simple state machine. Fallback responses - serve stale data or a degraded response rather than an error.

Backpressure at the HTTP layer: bounded in-flight concurrency, bounded queues, pool-wait limits, propagated deadlines, and cancellation. Distinguish client quota violations (429) from temporary service overload (503). Cover capped retries at one layer, retry budgets, exponential backoff with jitter, and recovery probes; a circuit breaker is not a replacement for admission control.

Run an integration failure lab: stop Redis under sustained load, inject slow database calls, and restart cold application instances. Do not send every cache failure directly to the database without a concurrency budget. Define rate-limiter behavior when its Redis dependency fails, including conservative local limits or explicit rejection. Stale fallbacks remain forbidden when they violate deletion or authorization requirements. Publish latency, errors, admitted/rejected load, origin concurrency, freshness violations, and recovery time rather than throughput alone.

**Key terms defined:** token bucket, sliding window, circuit breaker, open/closed/half-open state, fallback, backpressure, 429 Too Many Requests.

## Infrastructure Changes Required

### 1. Mermaid Support in MDX
`rehype-mermaid` renders Mermaid diagrams server-side as SVG and requires Playwright plus a browser installation. The unscoped package `mermaid-isomorphic` also requires a browser for Node rendering. `remark-mermaidjs` has the same requirement and is archived, so it is not a preferred alternative.

Preferred initial approach: pre-render SVG assets in a separate local or CI environment and publish those assets with the posts. This moves the browser requirement out of the Vercel build; it does not eliminate the rendering dependency. If using a build-time plugin instead, validate browser installation, plugin ordering with syntax highlighting, MDX output, accessible descriptions, and mobile rendering in the actual deployment build before adopting it. Do not introduce a runtime browser dependency for static diagrams.

### 2. Companion GitHub Repository
Create `imrishuroy/scaling-reads` as a public repo. Each post links to its git tag at the top. `docker compose up` starts the baseline server and PostgreSQL. Add optional profiles only as needed:

| Profile | Required Services |
|---|---|
| `cache` | Standalone Redis |
| `replica` | Streaming PostgreSQL replica with reproducible bootstrap |
| `multi-app` | Multiple server processes behind a local proxy |
| `http-cache` | Caching reverse proxy for public-response experiments |
| `redis-cluster` | Multiple Redis primaries and replicas, with explicit slot initialization |
| `workers` | Durable outbox consumers running separately from HTTP handlers |
| `search` | Elasticsearch with a pinned configuration |
| `shards` | Independent PostgreSQL instances and application routing |
| `load` | Pinned k6 runner and deterministic workload fixtures |

Document profile combinations and resource budgets per tag so readers do not need to run the entire stack. Container images and dependencies need an initial download, but required labs need no cloud account. Remote CDN geography and managed-database behavior are not validated by local proxies or containers.

## Reference Sources

Verify behavior against the versions pinned by each chapter; these references support the design, not unrun benchmark results.

- [PostgreSQL index-only scans and visibility maps](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)
- [PostgreSQL partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)
- [PostgreSQL system columns and ctid](https://www.postgresql.org/docs/current/ddl-system-columns.html)
- [PostgreSQL replication and replay](https://www.postgresql.org/docs/current/warm-standby.html)
- [Materialized-view refresh requirements](https://www.postgresql.org/docs/current/sql-refreshmaterializedview.html)
- [Redis Cluster hash slots](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)
- [Redis eviction policies](https://redis.io/docs/latest/develop/reference/eviction/)
- [Go singleflight scope](https://pkg.go.dev/golang.org/x/sync/singleflight)
- [HTTP caching and security, RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html)
- [k6 open and closed load models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/)
- [Meta: Cache made consistent, June 2022](https://engineering.fb.com/2022/06/08/core-infra/cache-made-consistent/)
- [AWS transactional outbox guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [AWS timeouts, retries, and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [rehype-mermaid installation](https://github.com/remcohaszing/rehype-mermaid)
- [mermaid-isomorphic installation](https://github.com/remcohaszing/mermaid-isomorphic)
- [Archived remark-mermaidjs](https://github.com/remcohaszing/remark-mermaidjs)

## What This Series Is Not

- Not a shallow survey. Every chapter has a runnable experiment; correctness failures use fault injection as well as load tests.
- Not cloud-specific. Required experiments run locally with documented Compose profiles; product comparisons are separately sourced.
- No fake metrics. No invented throughput numbers or uptime percentages.
- Not a glossary dump. Terms are defined inline in context, not in a reference list.
