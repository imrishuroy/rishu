

Distributed Systems for Backend Engineers

1. Distributed Systems Fundamentals

Start here. These concepts form the foundation for everything else.

* What is a distributed system?
* Vertical vs horizontal scaling
* Stateless vs stateful services
* Distributed system challenges
* Network partitions and network failures
* Partial failures
* Latency vs throughput
* Availability vs reliability
* CAP theorem
* PACELC theorem
* Replication
* Fault tolerance
* High availability
* Single point of failure (SPOF)
* Bottleneck
* Durability
* Robustness

Key properties every distributed system is designed around:

* Availability — the system responds to every request (even during failures)
* Reliability — the system does the correct thing consistently over time
* Durability — data once written is not lost, even after crashes
* Robustness — the system degrades gracefully under unexpected conditions

Interview questions:

* What happens when a server goes down?
* Why are distributed systems difficult?
* Explain CAP theorem with practical examples.
* How do you design a highly available service?
* What is a single point of failure and how do you eliminate it?
* What is the difference between availability and reliability?

2. Distributed Communication

Understand how services communicate.

* HTTP vs RPC
* REST vs gRPC
* Synchronous vs asynchronous communication
* Service discovery
* Load balancing algorithms:
  * Round robin — requests distributed evenly in order
  * Weighted round robin — servers get traffic proportional to their capacity
  * Least connections — new request goes to the server with fewest active connections
  * IP hash / consistent hash — same client always routes to same server (session stickiness)
  * Random
* Layer 4 vs Layer 7 load balancing
* API gateways
* Connection pooling
* Timeouts and request timeouts
* Deadlines vs timeouts — a deadline is propagated end-to-end across all hops; a timeout is local to one call
* Retries and idempotency
* Retry budgets — a cap on total retry volume to prevent retry storms
* Circuit breakers
* Bulkheads
* Backpressure
* Domino effect / cascade failure — one slow or failing component causes downstream failures across the system
* HTTP/2 multiplexing and persistent connections
* HTTP/3 / QUIC — eliminates head-of-line blocking
* mTLS (mutual TLS) — both client and server present certificates; how services authenticate each other
* gRPC streaming modes — unary, server streaming, client streaming, bidirectional streaming

Real-world example — AWS Aurora MySQL read replica load balancing:
Aurora provides a Reader Endpoint that internally load balances read traffic across all read replicas using a DNS-based round-robin. When a replica is added or removed, Aurora updates the reader endpoint automatically. Applications connect to the single reader endpoint and Aurora handles routing — no client-side LB logic needed. This is an example of Layer 4 DNS load balancing handled transparently by the managed service.

Interview questions:

* How do you handle service failures?
* Why are retries dangerous?
* How do you prevent cascading failures?
* How does a load balancer work?
* What is the difference between round robin and least connections?
* When would you use IP hash load balancing?
* How does Aurora manage read replica traffic without client-side changes?
* How does a circuit breaker prevent a domino effect?

3. Consistency and Replication

One of the most important distributed systems topics.

* Leader-follower replication
* Multi-leader replication
* Leaderless replication
* Strong consistency
* Eventual consistency
* Read-after-write consistency
* Causal consistency
* Linearizability
* Sequential consistency
* Quorum reads and writes
* Replication lag
* Conflict resolution
* Read repair
* Write repair

Interview questions:

* What happens when replicas disagree?
* How does eventual consistency work?
* How do quorum reads and writes work?
* Explain strong consistency vs eventual consistency.
* How would you design a distributed counter?

4. Distributed Transactions

Very important for backend engineers working with microservices.

* ACID transactions
* Distributed transactions
* Two-phase commit (2PC)
* Three-phase commit (3PC) — adds a pre-commit phase to avoid blocking on coordinator failure; trade-off is more round trips
* Saga pattern
* Choreography vs orchestration
* Transaction isolation
* Deadlocks
* Optimistic concurrency control
* Pessimistic locking
* Multi-version concurrency control (MVCC) — how Postgres avoids read locks by keeping multiple row versions
* Distributed locks
* Transactional Outbox
* Change Data Capture (CDC)
* Idempotency at the database level — upsert patterns, INSERT ... ON CONFLICT, natural idempotency keys

Interview questions:

* How do you maintain consistency across microservices?
* How do you implement a payment workflow?
* Why is 2PC problematic?
* How does the Saga pattern work?
* How do you prevent duplicate payments?

5. Messaging and Event-Driven Systems

Since you already work with Kafka, this is particularly important.

* Message brokers
* Kafka architecture
* Topics and partitions
* Consumer groups
* Partition keys
* Message ordering — guaranteed within a partition, not across partitions
* At-most-once delivery
* At-least-once delivery
* Exactly-once semantics
* Idempotent consumers
* Retry topics
* Dead-letter queues
* Kafka offsets
* Consumer lag
* Backpressure
* Log compaction — Kafka retains only the latest value per key; useful for event sourcing and changelog topics
* Event sourcing
* CQRS
* Schema evolution
* Pub/Sub alternatives and trade-offs:
  * RabbitMQ — queue-based, push delivery, flexible routing (exchanges), lower throughput than Kafka
  * AWS SQS / SNS — SQS is a managed queue (pull), SNS is pub/sub fan-out (push); no ordering by default (FIFO queues for ordering)
  * Google Pub/Sub — managed, at-least-once, global scale, push or pull
* Push vs pull consumer model — Kafka uses pull (consumer controls pace); SNS/SQS push to endpoints

Interview questions:

* How do you handle duplicate Kafka messages?
* How do you guarantee ordering?
* How do you handle failed consumers?
* What happens when consumers are slower than producers?
* How do you design an event-driven architecture?

6. Distributed Coordination

This is where you start understanding deeper distributed systems.

The four fundamental problems every distributed system must address:

* Consensus — getting all nodes to agree on a single value (even when some nodes fail)
* Leader election — choosing one node to coordinate without a central authority
* Clock synchronization — nodes have no shared clock; ordering events is non-trivial
* Distributed deadlocks — two or more nodes waiting on each other indefinitely

* Distributed locks
* Lease-based locks
* Leader election
* Heartbeats
* Fencing tokens
* Split-brain scenarios
* Consensus algorithms
* Raft
* Paxos
* Quorum
* ZooKeeper
* etcd

Interview questions:

* How does leader election work?
* What happens when two nodes believe they are leaders?
* Why are distributed locks difficult?
* Explain Raft at a high level.
* How does etcd maintain consistency?

7. Distributed Storage and Databases

Essential for backend and system design interviews.

* SQL vs NoSQL
* Database replication
* Sharding
* Partitioning
* Consistent hashing
* Hot partitions
* Database indexes
* B-tree
* LSM trees
* Write-ahead logs
* Compaction
* Distributed databases
* DynamoDB architecture
* Cassandra architecture
* Redis clustering
* Data locality
* OLTP vs OLAP
* Column-oriented databases (ClickHouse, BigQuery, Redshift)
* Time-series databases (InfluxDB, TimescaleDB)
* NewSQL / distributed SQL (CockroachDB, Google Spanner)
* Object storage (S3-like systems, blob storage)
* Connection pooling (PgBouncer, pgpool)

Interview questions:

* How would you shard a database?
* What happens when a shard becomes overloaded?
* Explain consistent hashing.
* How do you handle hot keys?
* How would you scale PostgreSQL?
* When would you choose a column-oriented database over a row-oriented one?
* How does Google Spanner achieve global consistency?
* How do you manage database connections at scale?

8. Distributed Caching

Extremely useful for real-world backend engineering.

* Cache-aside
* Write-through
* Write-back
* Write-around
* Cache invalidation
* Cache stampede
* Cache penetration
* Cache avalanche
* TTL strategies
* Redis replication
* Redis Cluster
* Distributed cache consistency
* Hot keys
* Local vs distributed cache

Interview questions:

* How do you prevent cache stampede?
* How do you invalidate distributed caches?
* How would you design a distributed cache?
* How do you handle Redis failure?

9. Reliability and Resilience Engineering

Critical for production backend engineers.

* SLI, SLO, SLA
* Error budgets
* Fault injection
* Chaos engineering
* Graceful degradation
* Retry storms
* Cascading failures
* Rate limiting algorithms (token bucket, leaky bucket, fixed window, sliding window log, sliding window counter)
* Distributed rate limiting with Redis
* Load shedding
* Health checks
* Disaster recovery
* Multi-region architecture
* Recovery Point Objective (RPO)
* Recovery Time Objective (RTO)

Observability:

* Distributed tracing (OpenTelemetry, Jaeger, Zipkin)
* Trace context propagation
* Structured logging and log aggregation (ELK, Loki)
* Metrics collection (Prometheus, Grafana)
* Alerting and on-call practices
* P50 / P99 / P999 latency and why averages lie

Interview questions:

* Explain the difference between SLI, SLO, and SLA.
* How does the token bucket algorithm work?
* How do you implement distributed rate limiting?
* How do you trace a request across 10 microservices?
* What is the difference between metrics and traces?
* How do you set an error budget?

10. Advanced Distributed Systems

Study after mastering the previous sections.

* Exactly-once processing
* Global ordering
* CRDTs
* Vector clocks
* Distributed snapshots
* Merkle trees
* Gossip protocols
* Anti-entropy
* Multi-region replication
* Active-active systems
* Active-passive systems
* Byzantine fault tolerance
* Distributed scheduling

11. Time in Distributed Systems

Time is deceptively hard in distributed systems — clocks drift and can't be trusted.

* Clock drift and NTP limitations
* Why wall-clock time is unreliable across nodes
* Lamport timestamps (logical clocks)
* Vector clocks (track causality across nodes)
* Hybrid Logical Clocks (HLC)
* True Time (Google Spanner's approach)
* Monotonic vs wall-clock time
* Ordering events without a global clock

Interview questions:

* Why can't you rely on system clocks in a distributed system?
* What is the difference between Lamport clocks and vector clocks?
* How does Google Spanner use TrueTime to achieve external consistency?
* How do you determine which event happened first across two nodes?

12. Real-time Communication Patterns

* Short polling
* Long polling
* Server-Sent Events (SSE)
* WebSockets
* When to use each pattern
* Presence systems (online/offline detection)
* Heartbeats and connection keepalive
* Reconnection and backoff strategies
* Scaling WebSocket connections

Interview questions:

* What is the difference between polling, SSE, and WebSockets?
* How do you scale a WebSocket server to millions of connections?
* How do you implement a presence system?
* How do you handle reconnections gracefully?

13. CDN and DNS

* How DNS works (resolution, recursion, caching)
* DNS TTL and its implications for deployments
* DNS-based load balancing (GeoDNS)
* Anycast routing
* How CDNs work
* CDN push vs pull model
* Edge caching and cache invalidation at the edge
* Origin shield
* CDN failover

Interview questions:

* How does a CDN reduce latency?
* How do you invalidate CDN cache for a specific file?
* Why is a low DNS TTL dangerous?
* How does Anycast work?

14. Probabilistic Data Structures

Useful when exact answers are too expensive at scale.

* Bloom filter — membership testing with no false negatives
* Counting Bloom filter — supports deletes
* HyperLogLog — approximate cardinality (unique count) estimation
* Count-Min Sketch — approximate frequency counting
* MinHash — similarity estimation
* Where these are used in real systems (Cassandra, Redis, BigQuery)

Interview questions:

* How does a Bloom filter work and what are its trade-offs?
* How would you count unique visitors without storing each user?
* How does HyperLogLog achieve near-constant memory regardless of input size?
* When would you use a Count-Min Sketch?

15. API Design Patterns

* Cursor-based pagination vs offset pagination
* Idempotency keys (safe retries for POST/PUT)
* API versioning strategies (URL path, header, query param)
* Webhook delivery and retry strategies
* Webhook fan-out at scale
* Request deduplication
* Partial failures in bulk APIs
* Long-running operations (polling vs callback vs streaming)

Interview questions:

* Why is offset pagination a problem at scale?
* How do you make a payment API safe to retry?
* How do you design a webhook delivery system with at-least-once guarantees?
* How do you handle partial failures in a bulk insert API?

16. Deployment and Operational Patterns

* Blue-green deployment
* Canary releases and traffic splitting
* Rolling deployments
* Feature flags
* Shadow traffic / dark launches
* Zero-downtime database migrations
* Backward-compatible schema changes
* Backfills and long-running migrations
* Graceful shutdown
* Drain and restart patterns

Interview questions:

* How do you deploy a new version without downtime?
* How do you roll back a bad deploy safely?
* How do you migrate a database column in a live system with millions of rows?
* What is the difference between a blue-green and a canary deployment?

17. Back-of-Envelope Calculations

Essential for every system design interview.

Common reference numbers:

* L1 cache: ~1 ns | L2: ~10 ns | RAM: ~100 ns | SSD: ~100 µs | HDD: ~10 ms | Network (same DC): ~0.5 ms
* 1 Gbps network: ~125 MB/s throughput
* Average HTTP request size: ~1–10 KB
* Average DB row read: ~1 µs (in-memory), ~1 ms (disk)
* Typical read QPS per DB instance: ~1,000–10,000
* Redis: ~100,000 ops/sec per node

Estimation process:

* Estimate QPS: daily active users × requests per user per day ÷ 86,400
* Estimate peak QPS: average QPS × 2–10 (depending on traffic pattern)
* Estimate storage: QPS × payload size × retention period
* Estimate bandwidth: QPS × avg response size

Common patterns:

* 1M DAU, 10 requests/day → ~116 avg QPS, ~1,160 peak QPS
* 100 bytes per event, 1M events/day → ~8.6 GB/day, ~3 TB/year
* 1 KB per row, 1M rows → 1 GB; 1 KB per row, 1B rows → 1 TB

Interview questions:

* Estimate the QPS and storage for a URL shortener with 100M DAU.
* How much bandwidth does a video platform need for 1M concurrent streams at 720p?
* Estimate how many servers you need to handle 1M requests per second.
* How much storage does a Twitter-scale system need for tweets per year?

19. Serialization and Schema Evolution

Choosing the wrong wire format or breaking schema compatibility causes production incidents in distributed systems.

* JSON — human-readable, no schema enforcement, verbose, slow to parse at scale
* Protocol Buffers (Protobuf) — binary, compact, strongly typed, requires .proto schema; used by gRPC
* Apache Avro — binary, schema stored separately, common in Kafka ecosystems
* Apache Thrift — binary, Facebook-originated, similar to Protobuf
* MessagePack — binary JSON; compact but no schema enforcement
* Why binary over JSON — 5–10x smaller payload, faster serialization/deserialization, schema enforcement
* Schema registry — Confluent Schema Registry stores Avro/Protobuf schemas; producers and consumers agree on schema version
* Backward compatibility — new schema can read old data (safe to deploy consumer before producer)
* Forward compatibility — old schema can read new data (safe to deploy producer before consumer)
* Full compatibility — both backward and forward; safest rule for Kafka topics
* Breaking changes — removing required fields, changing field types, reusing field numbers (Protobuf)

Interview questions:

* Why would you use Protobuf over JSON for a high-throughput API?
* How does a schema registry prevent breaking changes in a Kafka pipeline?
* What is the difference between backward and forward compatibility?
* How do you safely add a new field to a Protobuf message in production?

20. Security in Distributed Systems

Authentication and authorization between services is as important as between user and system.

* mTLS (mutual TLS) — both client and server present certificates; services prove their identity to each other
* SPIFFE / SPIRE — framework for issuing service identities (SVIDs) in a zero-trust environment
* Certificate rotation — automating cert renewal without downtime
* JWT for service-to-service auth — short-lived tokens; validate at the edge vs per-service trade-off
* OAuth2 client credentials flow — machine-to-machine auth without a user
* API keys — simple but hard to rotate; no identity, only authentication
* Secrets management — Vault, AWS Secrets Manager, GCP Secret Manager; never hardcode credentials
* Zero-trust networking — every request is authenticated and authorized regardless of network location
* Encryption at rest and in transit — TLS for in-transit; AES-256 for at-rest storage
* Principle of least privilege — services only have permissions they need

Interview questions:

* How do two microservices authenticate each other without a user involved?
* What is the difference between mTLS and a JWT token for service auth?
* How do you rotate a database password in a live system without downtime?
* What is zero-trust networking and why does it matter?

21. Task Queues and Job Scheduling

Task queues handle async background work; different from message queues (which handle event streams).

* Task queues vs message queues — task queues are for discrete units of work (send email, resize image); message queues are for event streams
* Worker pool model — workers pull jobs from a queue and process them
* Popular systems — Sidekiq (Ruby), Celery (Python), BullMQ (Node), Faktory (Go-friendly)
* Job deduplication — prevent the same job from running twice (idempotency key on the job)
* Priority queues — high-priority jobs jump ahead of low-priority ones
* Scheduled jobs / cron at scale — distributed cron needs leader election to avoid duplicate execution
* At-least-once job execution — retries on failure; job must be idempotent
* Job visibility timeout — SQS model: job is hidden from other workers while being processed; if not acked in time, re-queued
* Dead-letter queue for jobs — jobs that fail too many times go to DLQ for inspection
* Backpressure in job queues — bounded queues reject new jobs when full to avoid memory exhaustion

Interview questions:

* How would you design a system to send 10 million emails?
* How do you prevent a job from running twice when using at-least-once delivery?
* How do you implement distributed cron without duplicate execution?
* What happens to a job that keeps failing?

22. Search Systems

Understanding search internals is essential for designing typeahead, full-text search, and recommendation features.

* Inverted index — maps terms to the list of documents containing them; core data structure of all search engines
* TF-IDF — term frequency × inverse document frequency; classic relevance ranking
* BM25 — improved TF-IDF; default ranking in Elasticsearch and Lucene
* Elasticsearch architecture — shards (horizontal scale), replicas (HA), coordinator node, data node, master node
* Near-real-time indexing — documents are searchable within ~1 second of ingestion (refresh interval)
* Relevance tuning — boosting fields, synonyms, stop words, analyzers
* Full-text search vs vector search — keyword matching vs semantic similarity (embedding-based)
* Vector databases — pgvector (Postgres), Pinecone, Weaviate; store and query high-dimensional embeddings
* ANN (Approximate Nearest Neighbor) algorithms — HNSW, IVF; trade accuracy for speed at scale
* Search vs database — search engines are optimized for read-heavy, complex queries; not a source of truth

Interview questions:

* How does an inverted index work?
* How would you design a search autocomplete system?
* How does Elasticsearch shard a large index?
* When would you use vector search instead of full-text search?

23. Microservices Patterns

* Monolith vs microservices — start with a monolith; extract services when a team boundary or scaling boundary demands it
* Strangler fig pattern — incrementally replace a monolith by routing new traffic to new services; old code remains until fully replaced
* BFF (Backend for Frontend) — a dedicated API layer per client type (mobile BFF, web BFF) with tailored response shapes
* API composition / aggregator — gateway fetches from multiple services and joins the results before responding to the client
* Anti-corruption layer — a translation layer that isolates your domain model from a legacy or third-party system's model
* Service decomposition strategies — decompose by business capability, by subdomain (DDD), or by team ownership
* Inter-service communication — synchronous (REST/gRPC) vs asynchronous (events); choose based on coupling and latency needs
* Shared database anti-pattern — services sharing a database creates tight coupling; each service should own its data
* Data consistency across services — use eventual consistency + Saga/Outbox rather than distributed transactions

Interview questions:

* When would you NOT use microservices?
* How do you migrate a monolith to microservices without downtime?
* What is a BFF and when does it help?
* How do you query data that spans three different services?

24. Service Mesh

A service mesh moves cross-cutting concerns (retries, mTLS, tracing, circuit breaking) out of application code into infrastructure.

* Sidecar proxy pattern — each service pod gets an Envoy sidecar that intercepts all inbound/outbound traffic
* Control plane vs data plane — control plane (Istio, Linkerd control plane) configures proxies; data plane (Envoy) enforces policy
* What a mesh gives you without code changes — automatic mTLS, retries, timeouts, circuit breaking, distributed tracing, traffic metrics
* Traffic management — canary releases and A/B testing via traffic weight splitting in the mesh config
* When NOT to use a mesh — adds operational complexity; overkill for small services counts or simple architectures
* Alternatives — library-based approach (Hystrix, Resilience4j); simpler but pollutes application code

Interview questions:

* What problem does a service mesh solve that an API gateway doesn't?
* How does a sidecar proxy intercept traffic without changing application code?
* How would you implement canary deployments using a service mesh?

25. Networking Fundamentals

* TCP vs UDP — TCP: reliable, ordered, connection-oriented, higher overhead; UDP: unreliable, unordered, low latency (DNS, video, gaming)
* TCP three-way handshake — SYN → SYN-ACK → ACK; adds latency to new connections
* HTTP/1.1 — one request per connection (without pipelining); head-of-line blocking
* HTTP/2 — multiplexing many requests over one TCP connection; header compression (HPACK); still TCP head-of-line blocking
* HTTP/3 / QUIC — built on UDP; eliminates TCP head-of-line blocking; faster connection setup (0-RTT)
* Keep-alive and connection reuse — reuse TCP connections across requests to avoid handshake overhead
* Ephemeral port exhaustion — a client can run out of outbound ports (~64K) under very high connection rates
* NAT traversal — services behind NAT need techniques (STUN, TURN) to accept inbound connections
* TLS handshake cost — adds 1–2 RTTs per new connection; session resumption reduces this

Interview questions:

* Why is HTTP/2 faster than HTTP/1.1?
* What problem does HTTP/3 solve that HTTP/2 doesn't?
* What is head-of-line blocking?
* How would you reduce connection overhead for a high-QPS internal API?

⸻

26. Popular Interview Questions (by category)

These are the most frequently asked questions in backend engineering and system design interviews. Each one is worth practicing out loud until you can answer it in under 2 minutes.

Fundamentals and Concepts

* Explain CAP theorem. Give a real-world example of a CP system and an AP system.
* What is the difference between availability and reliability? Can you have one without the other?
* What is eventual consistency? Give a concrete example where it is acceptable and where it is not.
* What is the difference between latency and throughput? How do you trade one for the other?
* What happens when a node in a distributed system crashes?
* What is a single point of failure and how do you design around it?
* How does horizontal scaling differ from vertical scaling? When would you choose each?
* What is idempotency and why does it matter in distributed systems?

Consistency and Replication

* What is replication lag and what problems can it cause?
* A user writes data and immediately reads it back — but gets stale data. What consistency model is violated and how do you fix it?
* What is the difference between linearizability and eventual consistency?
* How do quorum reads and writes work? What values of W and R give you strong consistency?
* When would you use multi-leader replication and what problem does it introduce?
* How does Cassandra handle conflicts when two nodes write to the same key simultaneously?

Distributed Transactions

* How do you maintain data consistency when a transaction spans two microservices?
* What is two-phase commit and why is it problematic in practice?
* How does the Saga pattern work? What is the difference between choreography and orchestration?
* How do you prevent duplicate payments in a payment system?
* What is the Transactional Outbox pattern and why do you need it?
* What is MVCC and how does Postgres use it to avoid read locks?

Messaging and Kafka

* How does Kafka guarantee message ordering?
* What happens if a Kafka consumer crashes after reading a message but before processing it?
* How do you handle duplicate messages in a Kafka consumer?
* What is consumer lag and how do you alert on it?
* How do you choose the right number of partitions for a Kafka topic?
* When would you use SQS instead of Kafka?
* What is a dead-letter queue and when does a message end up there?
* How does exactly-once delivery work in Kafka?

Distributed Coordination

* How does leader election work? What happens when a network partition splits the cluster?
* What is split-brain and how does Raft prevent it?
* Explain Raft consensus at a high level.
* How do distributed locks work? What problem does a fencing token solve?
* Why are distributed locks hard to get right? What can go wrong?
* How does etcd maintain consistency?

Databases and Storage

* How would you shard a PostgreSQL database? What are the trade-offs?
* Explain consistent hashing. Why is it better than modulo-based sharding?
* What happens when a shard becomes a hot spot?
* When would you choose a NoSQL database over a relational database?
* What is the difference between a B-tree and an LSM tree? When does each win?
* How does DynamoDB achieve single-digit millisecond reads?
* How would you scale a read-heavy PostgreSQL database?
* What is OLTP vs OLAP? When do you need a separate analytics database?

Caching

* What is cache stampede and how do you prevent it?
* How do you keep a cache consistent with a database?
* What is the difference between cache-aside, write-through, and write-back?
* What is cache penetration and how do you defend against it?
* A Redis node goes down — what happens to your service? How do you design for this?
* How do you handle hot keys in Redis?

Reliability and Resilience

* How does a circuit breaker work? What are the three states?
* Why are retries dangerous? How do you make them safe?
* What is exponential backoff with jitter and why do you need jitter?
* How do you implement rate limiting? Walk me through the token bucket algorithm.
* What is the difference between an SLA, SLO, and SLI?
* How do you design a service to degrade gracefully under heavy load?
* What is a retry storm and how do you prevent it?
* What is the difference between RPO and RTO?

Networking and Communication

* What is the difference between REST and gRPC? When would you choose gRPC?
* What is HTTP/2 and how does it improve on HTTP/1.1?
* What is head-of-line blocking and how does HTTP/3 solve it?
* What is mTLS and how does it differ from regular TLS?
* How does a service mesh help without changing application code?
* What is backpressure and how do you implement it?
* What is the difference between a timeout and a deadline?

API Design

* How do you design an API that is safe to retry?
* What is an idempotency key and how do you implement it on the server side?
* Why is offset-based pagination a problem at scale? What do you use instead?
* How do you version an API without breaking existing clients?
* How would you design a webhook delivery system?

Security

* How do two microservices authenticate each other?
* What is the difference between authentication and authorization?
* How do you manage secrets (database passwords, API keys) in a production system?
* What is zero-trust and why does it matter?
* How do you rotate a secret without taking the service down?

Commonly asked scenario questions

* Walk me through what happens when a user types a URL and hits Enter. (covers DNS, TCP, TLS, LB, HTTP)
* A downstream service your API depends on is suddenly responding in 10 seconds. What do you do?
* Your database CPU is at 100%. Walk me through how you diagnose and fix it.
* A microservice is producing duplicate events. How do you find the root cause and fix it?
* You need to migrate a 500 GB table in production with zero downtime. How do you do it?
* Your Kafka consumer is falling behind. What are the possible causes and solutions?
* Traffic spikes 10x during a sale event. How does your system handle it?
* Design a distributed rate limiter that works across 100 servers.
* How would you implement a global leaderboard that updates in real time?
* How do you debug high tail latency (P99) in a microservice?

⸻

18. Key Jargon Reference

Quick lookup for terms you'll hear in interviews and system design discussions.

| Term | Meaning |
|------|---------|
| Availability | System responds to every request, even during partial failures |
| Reliability | System consistently does the correct thing over time |
| Durability | Written data survives crashes and failures |
| Robustness | System degrades gracefully under unexpected load or failure |
| Bottleneck | The single resource or component that limits overall system throughput |
| Single point of failure (SPOF) | One component whose failure brings down the whole system |
| Domino effect | A failure in one component triggers failures in dependent components |
| Cascade failure | Failures spread through the system; same as domino effect but typically used for rapid, wide-spread collapse |
| Circuit breaker | Stops sending requests to a failing service to prevent cascade failure |
| Backpressure | Downstream service signals it is overloaded so upstream slows down |
| Replication lag | Delay between a write on the leader and when it appears on a replica |
| Request timeout | Maximum time a caller waits for a response before giving up |
| Retries | Re-sending a request after failure; dangerous without idempotency |
| SLA | Service Level Agreement — contractual uptime/performance guarantee (e.g. 99.9%) |
| SLO | Service Level Objective — internal target (e.g. 99.95% uptime) |
| SLI | Service Level Indicator — the actual measured metric (e.g. error rate) |
| Idempotency | An operation that produces the same result no matter how many times it is applied |
| Consensus | All nodes agreeing on a single value despite failures |
| Leader election | Picking one node to coordinate without a central authority |
| Distributed deadlock | Two or more nodes waiting on each other indefinitely, making no progress |
| Clock skew | Difference between the clock times of two nodes in the same system |
| Network partition | A network split where some nodes can no longer communicate with others |
| Fencing token | A monotonically increasing token used to prevent stale distributed lock holders from causing harm |
| Quorum | A majority of nodes (N/2 + 1) required to agree before an operation proceeds |
| Fan-out | One write triggers multiple downstream writes or notifications |
| Hot key / hot partition | A single key or shard receiving disproportionately high traffic |

⸻

Best Learning Resources

Since you already have subscriptions, these are particularly useful.

Resource	What to study
urlByteByteGohttps://bytebytego.com/	Distributed systems fundamentals, Kafka, databases, caching, system design
urlHello Interviewhttps://www.hellointerview.com/	System design interview preparation and practical designs
ativehttps://www.educative.io/	Distributed systems, concurrency, system design
https://systemdesignschool.io/	Distributed systems and system design concepts
valuable book for deep distributed systems understanding	

Most important book

Designing Data-Intensive Applications

Recommended chapters:

* Chapter 1: Reliable, Scalable, and Maintainable Applications
* Chapter 2: Data Models and Query Languages
* Chapter 3: Storage and Retrieval
* Chapter 4: Encoding and Evolution
* Chapter 5: Replication
* Chapter 6: Partitioning
* Chapter 7: Transactions
* Chapter 8: The Trouble with Distributed Systems
* Chapter 9: Consistency and Consensus
* Chapter 11: Stream Processing

⸻

My Recommended Learning Order for Backend Interviews

If your goal is to become stronger at backend engineering and clear interviews, follow this sequence:

Week	Topics
Week 1	Fundamentals, CAP, replication, consistency
Week 2	Distributed communication, retries, timeouts, resilience
Week 3	Kafka, messaging, delivery guarantees, idempotency
Week 4	Transactions, Saga, Outbox, CDC
Week 5	Sharding, consistent hashing, distributed databases
Week 6	Caching, Redis, cache failure patterns
Week 7	Distributed locks, Raft, leader election
Week 8	Multi-region systems, reliability, advanced concepts

What I would prioritize most for your interviews

Top 15 topics:

1. CAP theorem
2. Strong vs eventual consistency
3. Replication
4. Sharding
5. Consistent hashing
6. Kafka partitions and ordering
7. At-least-once vs exactly-once processing
8. Idempotency
9. Transactional Outbox
10. Saga pattern
11. Distributed locks
12. Leader election
13. Raft
14. Cache invalidation and cache stampede
15. Retry, timeout, circuit breaker, backpressure

Important: Don’t just memorize definitions. For each topic, understand:

* Why the problem exists
* How the solution works
* Its trade-offs
* Failure scenarios
* How you would implement it in a backend service
* How it appears in system design interviews

For a backend engineer with Go, Kafka, PostgreSQL, Redis, and microservices experience, this combination provides an excellent foundation for mid-level backend and distributed systems interviews.