# Chapter Generation Checklist

Track which chapters have been generated and published.

## How to generate a chapter

1. Open `post-generation-prompt.md`
2. Fill in the CONFIGURATION block at the top
3. Paste the entire prompt into a new Claude session
4. Claude generates the full MDX content
5. Save it to `content/blogs/{slug}.mdx`
6. Run `npm run build` to verify no errors
7. Mark the chapter done below

---

## Recommended generation order

Go in this order -- each chapter builds on the previous ones.

| # | Slug | Title | Status |
|---|------|-------|--------|
| 1 | `ds-01-fundamentals` | Distributed Systems Fundamentals | [ ] |
| 2 | `ds-02-communication` | Distributed Communication | [ ] |
| 3 | `ds-03-consistency` | Consistency and Replication | [ ] |
| 4 | `ds-04-transactions` | Distributed Transactions | [ ] |
| 5 | `ds-05-messaging` | Messaging and Event-Driven Systems | [ ] |
| 6 | `ds-06-coordination` | Distributed Coordination | [ ] |
| 7 | `ds-07-storage` | Distributed Storage and Databases | [ ] |
| 8 | `ds-08-caching` | Distributed Caching | [ ] |
| 9 | `ds-09-reliability` | Reliability and Resilience Engineering | [ ] |
| 10 | `ds-10-advanced` | Advanced Distributed Systems | [ ] |
| 11 | `ds-11-time` | Time in Distributed Systems | [ ] |
| 12 | `ds-12-realtime` | Real-time Communication Patterns | [ ] |
| 13 | `ds-13-cdn-dns` | CDN and DNS | [ ] |
| 14 | `ds-14-probabilistic` | Probabilistic Data Structures | [ ] |
| 15 | `ds-15-api-design` | API Design Patterns | [ ] |
| 16 | `ds-16-deployment` | Deployment and Operational Patterns | [ ] |
| 17 | `ds-17-estimation` | Back-of-Envelope Calculations | [ ] |
| 18 | `ds-18-jargon` | Key Jargon Reference | [ ] |
| 19 | `ds-19-serialization` | Serialization and Schema Evolution | [ ] |
| 20 | `ds-20-security` | Security in Distributed Systems | [ ] |
| 21 | `ds-21-task-queues` | Task Queues and Job Scheduling | [ ] |
| 22 | `ds-22-search` | Search Systems | [ ] |
| 23 | `ds-23-microservices` | Microservices Patterns | [ ] |
| 24 | `ds-24-service-mesh` | Service Mesh | [ ] |
| 25 | `ds-25-networking` | Networking Fundamentals | [ ] |
| 26 | `ds-26-interview-questions` | Popular Interview Questions | [ ] |

---

## CONFIGURATION quick-fill per chapter

Copy the right block when filling in the prompt's CONFIGURATION section.

### Chapter 1
```
CHAPTER_NUMBER:  1
CHAPTER_TITLE:   Distributed Systems Fundamentals
TOPICS:
  - What is a distributed system?
  - Vertical vs horizontal scaling
  - Stateless vs stateful services
  - Distributed system challenges
  - Network partitions and network failures
  - Partial failures
  - Latency vs throughput
  - Availability vs reliability
  - CAP theorem
  - PACELC theorem
  - Replication
  - Fault tolerance
  - High availability
  - Single point of failure (SPOF)
  - Bottleneck
  - Durability
  - Robustness
INTERVIEW_QS:
  - What happens when a server goes down?
  - Why are distributed systems difficult?
  - Explain CAP theorem with practical examples.
  - How do you design a highly available service?
  - What is a single point of failure and how do you eliminate it?
  - What is the difference between availability and reliability?
SERIES_ORDER:    1
PREV_CHAPTER:    none
NEXT_CHAPTER:    ds-02-communication
```

### Chapter 2
```
CHAPTER_NUMBER:  2
CHAPTER_TITLE:   Distributed Communication
TOPICS:
  - HTTP vs RPC
  - REST vs gRPC
  - Synchronous vs asynchronous communication
  - Service discovery
  - Load balancing algorithms (round robin, weighted round robin, least connections, IP hash, random)
  - Layer 4 vs Layer 7 load balancing
  - API gateways
  - Connection pooling
  - Timeouts and request timeouts
  - Deadlines vs timeouts
  - Retries and idempotency
  - Retry budgets
  - Circuit breakers
  - Bulkheads
  - Backpressure
  - Domino effect and cascade failure
  - HTTP/2 multiplexing and persistent connections
  - HTTP/3 and QUIC
  - mTLS
  - gRPC streaming modes
INTERVIEW_QS:
  - How do you handle service failures?
  - Why are retries dangerous?
  - How do you prevent cascading failures?
  - How does a load balancer work?
  - What is the difference between round robin and least connections?
  - When would you use IP hash load balancing?
  - How does Aurora manage read replica traffic without client-side changes?
  - How does a circuit breaker prevent a domino effect?
SERIES_ORDER:    2
PREV_CHAPTER:    ds-01-fundamentals
NEXT_CHAPTER:    ds-03-consistency
```

### Chapter 3
```
CHAPTER_NUMBER:  3
CHAPTER_TITLE:   Consistency and Replication
TOPICS:
  - Leader-follower replication
  - Multi-leader replication
  - Leaderless replication
  - Strong consistency
  - Eventual consistency
  - Read-after-write consistency
  - Causal consistency
  - Linearizability
  - Sequential consistency
  - Quorum reads and writes
  - Replication lag
  - Conflict resolution
  - Read repair
  - Write repair
INTERVIEW_QS:
  - What happens when replicas disagree?
  - How does eventual consistency work?
  - How do quorum reads and writes work?
  - Explain strong consistency vs eventual consistency.
  - How would you design a distributed counter?
SERIES_ORDER:    3
PREV_CHAPTER:    ds-02-communication
NEXT_CHAPTER:    ds-04-transactions
```

### Chapter 4
```
CHAPTER_NUMBER:  4
CHAPTER_TITLE:   Distributed Transactions
TOPICS:
  - ACID transactions
  - Distributed transactions
  - Two-phase commit (2PC)
  - Three-phase commit (3PC)
  - Saga pattern
  - Choreography vs orchestration
  - Transaction isolation
  - Deadlocks
  - Optimistic concurrency control
  - Pessimistic locking
  - Multi-version concurrency control (MVCC)
  - Distributed locks
  - Transactional Outbox
  - Change Data Capture (CDC)
  - Idempotency at the database level
INTERVIEW_QS:
  - How do you maintain consistency across microservices?
  - How do you implement a payment workflow?
  - Why is 2PC problematic?
  - How does the Saga pattern work?
  - How do you prevent duplicate payments?
SERIES_ORDER:    4
PREV_CHAPTER:    ds-03-consistency
NEXT_CHAPTER:    ds-05-messaging
```

### Chapter 5
```
CHAPTER_NUMBER:  5
CHAPTER_TITLE:   Messaging and Event-Driven Systems
TOPICS:
  - Message brokers
  - Kafka architecture
  - Topics and partitions
  - Consumer groups
  - Partition keys
  - Message ordering (within partition only)
  - At-most-once delivery
  - At-least-once delivery
  - Exactly-once semantics
  - Idempotent consumers
  - Retry topics
  - Dead-letter queues
  - Kafka offsets
  - Consumer lag
  - Backpressure
  - Log compaction
  - Event sourcing
  - CQRS
  - Schema evolution
  - Pub/Sub alternatives (RabbitMQ, SQS/SNS, Google Pub/Sub)
  - Push vs pull consumer model
INTERVIEW_QS:
  - How do you handle duplicate Kafka messages?
  - How do you guarantee ordering?
  - How do you handle failed consumers?
  - What happens when consumers are slower than producers?
  - How do you design an event-driven architecture?
SERIES_ORDER:    5
PREV_CHAPTER:    ds-04-transactions
NEXT_CHAPTER:    ds-06-coordination
```

### Chapter 6
```
CHAPTER_NUMBER:  6
CHAPTER_TITLE:   Distributed Coordination
TOPICS:
  - Consensus
  - Leader election
  - Clock synchronization
  - Distributed deadlocks
  - Distributed locks
  - Lease-based locks
  - Heartbeats
  - Fencing tokens
  - Split-brain scenarios
  - Consensus algorithms
  - Raft
  - Paxos
  - Quorum
  - ZooKeeper
  - etcd
INTERVIEW_QS:
  - How does leader election work?
  - What happens when two nodes believe they are leaders?
  - Why are distributed locks difficult?
  - Explain Raft at a high level.
  - How does etcd maintain consistency?
SERIES_ORDER:    6
PREV_CHAPTER:    ds-05-messaging
NEXT_CHAPTER:    ds-07-storage
```

### Chapter 7
```
CHAPTER_NUMBER:  7
CHAPTER_TITLE:   Distributed Storage and Databases
TOPICS:
  - SQL vs NoSQL
  - Database replication
  - Sharding
  - Partitioning
  - Consistent hashing
  - Hot partitions
  - Database indexes
  - B-tree
  - LSM trees
  - Write-ahead logs
  - Compaction
  - Distributed databases
  - DynamoDB architecture
  - Cassandra architecture
  - Redis clustering
  - Data locality
  - OLTP vs OLAP
  - Column-oriented databases (ClickHouse, BigQuery, Redshift)
  - Time-series databases (InfluxDB, TimescaleDB)
  - NewSQL and distributed SQL (CockroachDB, Google Spanner)
  - Object storage (S3-like systems)
  - Connection pooling (PgBouncer)
INTERVIEW_QS:
  - How would you shard a database?
  - What happens when a shard becomes overloaded?
  - Explain consistent hashing.
  - How do you handle hot keys?
  - How would you scale PostgreSQL?
  - When would you choose a column-oriented database over a row-oriented one?
  - How does Google Spanner achieve global consistency?
  - How do you manage database connections at scale?
SERIES_ORDER:    7
PREV_CHAPTER:    ds-06-coordination
NEXT_CHAPTER:    ds-08-caching
```

### Chapter 8
```
CHAPTER_NUMBER:  8
CHAPTER_TITLE:   Distributed Caching
TOPICS:
  - Cache-aside
  - Write-through
  - Write-back
  - Write-around
  - Cache invalidation
  - Cache stampede
  - Cache penetration
  - Cache avalanche
  - TTL strategies
  - Redis replication
  - Redis Cluster
  - Distributed cache consistency
  - Hot keys
  - Local vs distributed cache
INTERVIEW_QS:
  - How do you prevent cache stampede?
  - How do you invalidate distributed caches?
  - How would you design a distributed cache?
  - How do you handle Redis failure?
SERIES_ORDER:    8
PREV_CHAPTER:    ds-07-storage
NEXT_CHAPTER:    ds-09-reliability
```

### Chapter 9
```
CHAPTER_NUMBER:  9
CHAPTER_TITLE:   Reliability and Resilience Engineering
TOPICS:
  - SLI, SLO, SLA
  - Error budgets
  - Fault injection
  - Chaos engineering
  - Graceful degradation
  - Retry storms
  - Cascading failures
  - Rate limiting algorithms (token bucket, leaky bucket, fixed window, sliding window log, sliding window counter)
  - Distributed rate limiting with Redis
  - Load shedding
  - Health checks
  - Disaster recovery
  - Multi-region architecture
  - Recovery Point Objective (RPO)
  - Recovery Time Objective (RTO)
  - Distributed tracing (OpenTelemetry, Jaeger, Zipkin)
  - Trace context propagation
  - Structured logging and log aggregation
  - Metrics collection (Prometheus, Grafana)
  - P50 / P99 / P999 latency and why averages lie
INTERVIEW_QS:
  - Explain the difference between SLI, SLO, and SLA.
  - How does the token bucket algorithm work?
  - How do you implement distributed rate limiting?
  - How do you trace a request across 10 microservices?
  - What is the difference between metrics and traces?
  - How do you set an error budget?
SERIES_ORDER:    9
PREV_CHAPTER:    ds-08-caching
NEXT_CHAPTER:    ds-10-advanced
```

### Chapter 10
```
CHAPTER_NUMBER:  10
CHAPTER_TITLE:   Advanced Distributed Systems
TOPICS:
  - Exactly-once processing
  - Global ordering
  - CRDTs
  - Vector clocks
  - Distributed snapshots
  - Merkle trees
  - Gossip protocols
  - Anti-entropy
  - Multi-region replication
  - Active-active systems
  - Active-passive systems
  - Byzantine fault tolerance
  - Distributed scheduling
INTERVIEW_QS:
  - What is a CRDT and when would you use one?
  - How do gossip protocols spread information without a central coordinator?
  - What is Byzantine fault tolerance and when does it matter?
  - How does active-active replication differ from active-passive?
SERIES_ORDER:    10
PREV_CHAPTER:    ds-09-reliability
NEXT_CHAPTER:    ds-11-time
```

### Chapter 11
```
CHAPTER_NUMBER:  11
CHAPTER_TITLE:   Time in Distributed Systems
TOPICS:
  - Clock drift and NTP limitations
  - Why wall-clock time is unreliable across nodes
  - Lamport timestamps (logical clocks)
  - Vector clocks (track causality across nodes)
  - Hybrid Logical Clocks (HLC)
  - True Time (Google Spanner)
  - Monotonic vs wall-clock time
  - Ordering events without a global clock
INTERVIEW_QS:
  - Why can't you rely on system clocks in a distributed system?
  - What is the difference between Lamport clocks and vector clocks?
  - How does Google Spanner use TrueTime to achieve external consistency?
  - How do you determine which event happened first across two nodes?
SERIES_ORDER:    11
PREV_CHAPTER:    ds-10-advanced
NEXT_CHAPTER:    ds-12-realtime
```

### Chapter 12
```
CHAPTER_NUMBER:  12
CHAPTER_TITLE:   Real-time Communication Patterns
TOPICS:
  - Short polling
  - Long polling
  - Server-Sent Events (SSE)
  - WebSockets
  - When to use each pattern
  - Presence systems (online/offline detection)
  - Heartbeats and connection keepalive
  - Reconnection and backoff strategies
  - Scaling WebSocket connections
INTERVIEW_QS:
  - What is the difference between polling, SSE, and WebSockets?
  - How do you scale a WebSocket server to millions of connections?
  - How do you implement a presence system?
  - How do you handle reconnections gracefully?
SERIES_ORDER:    12
PREV_CHAPTER:    ds-11-time
NEXT_CHAPTER:    ds-13-cdn-dns
```

### Chapter 13
```
CHAPTER_NUMBER:  13
CHAPTER_TITLE:   CDN and DNS
TOPICS:
  - How DNS works (resolution, recursion, caching)
  - DNS TTL and its implications for deployments
  - DNS-based load balancing (GeoDNS)
  - Anycast routing
  - How CDNs work
  - CDN push vs pull model
  - Edge caching and cache invalidation at the edge
  - Origin shield
  - CDN failover
INTERVIEW_QS:
  - How does a CDN reduce latency?
  - How do you invalidate CDN cache for a specific file?
  - Why is a low DNS TTL dangerous?
  - How does Anycast work?
SERIES_ORDER:    13
PREV_CHAPTER:    ds-12-realtime
NEXT_CHAPTER:    ds-14-probabilistic
```

### Chapter 14
```
CHAPTER_NUMBER:  14
CHAPTER_TITLE:   Probabilistic Data Structures
TOPICS:
  - Bloom filter (membership testing with no false negatives)
  - Counting Bloom filter (supports deletes)
  - HyperLogLog (approximate cardinality estimation)
  - Count-Min Sketch (approximate frequency counting)
  - MinHash (similarity estimation)
  - Where these are used in real systems (Cassandra, Redis, BigQuery)
INTERVIEW_QS:
  - How does a Bloom filter work and what are its trade-offs?
  - How would you count unique visitors without storing each user?
  - How does HyperLogLog achieve near-constant memory regardless of input size?
  - When would you use a Count-Min Sketch?
SERIES_ORDER:    14
PREV_CHAPTER:    ds-13-cdn-dns
NEXT_CHAPTER:    ds-15-api-design
```

### Chapter 15
```
CHAPTER_NUMBER:  15
CHAPTER_TITLE:   API Design Patterns
TOPICS:
  - Cursor-based pagination vs offset pagination
  - Idempotency keys (safe retries for POST/PUT)
  - API versioning strategies (URL path, header, query param)
  - Webhook delivery and retry strategies
  - Webhook fan-out at scale
  - Request deduplication
  - Partial failures in bulk APIs
  - Long-running operations (polling vs callback vs streaming)
INTERVIEW_QS:
  - Why is offset pagination a problem at scale?
  - How do you make a payment API safe to retry?
  - How do you design a webhook delivery system with at-least-once guarantees?
  - How do you handle partial failures in a bulk insert API?
SERIES_ORDER:    15
PREV_CHAPTER:    ds-14-probabilistic
NEXT_CHAPTER:    ds-16-deployment
```

### Chapter 16
```
CHAPTER_NUMBER:  16
CHAPTER_TITLE:   Deployment and Operational Patterns
TOPICS:
  - Blue-green deployment
  - Canary releases and traffic splitting
  - Rolling deployments
  - Feature flags
  - Shadow traffic and dark launches
  - Zero-downtime database migrations
  - Backward-compatible schema changes
  - Backfills and long-running migrations
  - Graceful shutdown
  - Drain and restart patterns
INTERVIEW_QS:
  - How do you deploy a new version without downtime?
  - How do you roll back a bad deploy safely?
  - How do you migrate a database column in a live system with millions of rows?
  - What is the difference between a blue-green and a canary deployment?
SERIES_ORDER:    16
PREV_CHAPTER:    ds-15-api-design
NEXT_CHAPTER:    ds-17-estimation
```

### Chapter 17
```
CHAPTER_NUMBER:  17
CHAPTER_TITLE:   Back-of-Envelope Calculations
TOPICS:
  - Common reference numbers (L1/L2/RAM/SSD/HDD/network latency)
  - 1 Gbps network throughput
  - Average HTTP request and DB row sizes
  - Typical read QPS per DB instance
  - Redis ops/sec per node
  - Estimation process (QPS, peak QPS, storage, bandwidth)
  - Worked examples (URL shortener, video platform, tweet storage)
INTERVIEW_QS:
  - Estimate the QPS and storage for a URL shortener with 100M DAU.
  - How much bandwidth does a video platform need for 1M concurrent streams at 720p?
  - Estimate how many servers you need to handle 1M requests per second.
  - How much storage does a Twitter-scale system need for tweets per year?
SERIES_ORDER:    17
PREV_CHAPTER:    ds-16-deployment
NEXT_CHAPTER:    ds-18-jargon
```

### Chapter 18
```
CHAPTER_NUMBER:  18
CHAPTER_TITLE:   Key Jargon Reference
TOPICS:
  - Full glossary from the distributed-systems.md jargon table
  - Availability, Reliability, Durability, Robustness, Bottleneck, SPOF
  - Domino effect, Cascade failure, Circuit breaker, Backpressure
  - Replication lag, Request timeout, Retries, SLA/SLO/SLI
  - Idempotency, Consensus, Leader election, Distributed deadlock
  - Clock skew, Network partition, Fencing token, Quorum, Fan-out, Hot key
INTERVIEW_QS:
  - Define: idempotency, fencing token, quorum, backpressure.
  - What is the difference between a cascade failure and a domino effect?
  - What is clock skew and why does it matter?
SERIES_ORDER:    18
PREV_CHAPTER:    ds-17-estimation
NEXT_CHAPTER:    ds-19-serialization
```

### Chapter 19
```
CHAPTER_NUMBER:  19
CHAPTER_TITLE:   Serialization and Schema Evolution
TOPICS:
  - JSON vs Protocol Buffers vs Apache Avro vs Apache Thrift vs MessagePack
  - Why binary over JSON (payload size, speed, schema enforcement)
  - Schema registry (Confluent Schema Registry)
  - Backward compatibility
  - Forward compatibility
  - Full compatibility
  - Breaking changes (removing required fields, changing field types, reusing field numbers)
INTERVIEW_QS:
  - Why would you use Protobuf over JSON for a high-throughput API?
  - How does a schema registry prevent breaking changes in a Kafka pipeline?
  - What is the difference between backward and forward compatibility?
  - How do you safely add a new field to a Protobuf message in production?
SERIES_ORDER:    19
PREV_CHAPTER:    ds-18-jargon
NEXT_CHAPTER:    ds-20-security
```

### Chapter 20
```
CHAPTER_NUMBER:  20
CHAPTER_TITLE:   Security in Distributed Systems
TOPICS:
  - mTLS (mutual TLS)
  - SPIFFE / SPIRE (service identity framework)
  - Certificate rotation without downtime
  - JWT for service-to-service auth
  - OAuth2 client credentials flow
  - API keys (trade-offs)
  - Secrets management (Vault, AWS Secrets Manager, GCP Secret Manager)
  - Zero-trust networking
  - Encryption at rest and in transit
  - Principle of least privilege
INTERVIEW_QS:
  - How do two microservices authenticate each other without a user involved?
  - What is the difference between mTLS and a JWT token for service auth?
  - How do you rotate a database password in a live system without downtime?
  - What is zero-trust networking and why does it matter?
SERIES_ORDER:    20
PREV_CHAPTER:    ds-19-serialization
NEXT_CHAPTER:    ds-21-task-queues
```

### Chapter 21
```
CHAPTER_NUMBER:  21
CHAPTER_TITLE:   Task Queues and Job Scheduling
TOPICS:
  - Task queues vs message queues
  - Worker pool model
  - Popular systems (Sidekiq, Celery, BullMQ, Faktory)
  - Job deduplication
  - Priority queues
  - Scheduled jobs and distributed cron (leader election needed)
  - At-least-once job execution
  - Job visibility timeout (SQS model)
  - Dead-letter queue for jobs
  - Backpressure in job queues
INTERVIEW_QS:
  - How would you design a system to send 10 million emails?
  - How do you prevent a job from running twice when using at-least-once delivery?
  - How do you implement distributed cron without duplicate execution?
  - What happens to a job that keeps failing?
SERIES_ORDER:    21
PREV_CHAPTER:    ds-20-security
NEXT_CHAPTER:    ds-22-search
```

### Chapter 22
```
CHAPTER_NUMBER:  22
CHAPTER_TITLE:   Search Systems
TOPICS:
  - Inverted index
  - TF-IDF
  - BM25
  - Elasticsearch architecture (shards, replicas, coordinator, data, master nodes)
  - Near-real-time indexing
  - Relevance tuning
  - Full-text search vs vector search
  - Vector databases (pgvector, Pinecone, Weaviate)
  - ANN algorithms (HNSW, IVF)
  - Search vs database trade-offs
INTERVIEW_QS:
  - How does an inverted index work?
  - How would you design a search autocomplete system?
  - How does Elasticsearch shard a large index?
  - When would you use vector search instead of full-text search?
SERIES_ORDER:    22
PREV_CHAPTER:    ds-21-task-queues
NEXT_CHAPTER:    ds-23-microservices
```

### Chapter 23
```
CHAPTER_NUMBER:  23
CHAPTER_TITLE:   Microservices Patterns
TOPICS:
  - Monolith vs microservices (when to split)
  - Strangler fig pattern
  - BFF (Backend for Frontend)
  - API composition and aggregator pattern
  - Anti-corruption layer
  - Service decomposition strategies (business capability, subdomain DDD, team ownership)
  - Inter-service communication (sync vs async)
  - Shared database anti-pattern
  - Data consistency across services
INTERVIEW_QS:
  - When would you NOT use microservices?
  - How do you migrate a monolith to microservices without downtime?
  - What is a BFF and when does it help?
  - How do you query data that spans three different services?
SERIES_ORDER:    23
PREV_CHAPTER:    ds-22-search
NEXT_CHAPTER:    ds-24-service-mesh
```

### Chapter 24
```
CHAPTER_NUMBER:  24
CHAPTER_TITLE:   Service Mesh
TOPICS:
  - Sidecar proxy pattern (Envoy)
  - Control plane vs data plane (Istio, Linkerd vs Envoy)
  - What a mesh provides without code changes (mTLS, retries, timeouts, circuit breaking, tracing, metrics)
  - Traffic management (canary and A/B via weight splitting)
  - When NOT to use a service mesh
  - Alternatives (Hystrix, Resilience4j library-based approach)
INTERVIEW_QS:
  - What problem does a service mesh solve that an API gateway does not?
  - How does a sidecar proxy intercept traffic without changing application code?
  - How would you implement canary deployments using a service mesh?
SERIES_ORDER:    24
PREV_CHAPTER:    ds-23-microservices
NEXT_CHAPTER:    ds-25-networking
```

### Chapter 25
```
CHAPTER_NUMBER:  25
CHAPTER_TITLE:   Networking Fundamentals
TOPICS:
  - TCP vs UDP trade-offs
  - TCP three-way handshake
  - HTTP/1.1 head-of-line blocking
  - HTTP/2 multiplexing and HPACK header compression
  - HTTP/3 and QUIC (UDP-based, 0-RTT)
  - Keep-alive and connection reuse
  - Ephemeral port exhaustion
  - NAT traversal (STUN, TURN)
  - TLS handshake cost and session resumption
INTERVIEW_QS:
  - Why is HTTP/2 faster than HTTP/1.1?
  - What problem does HTTP/3 solve that HTTP/2 does not?
  - What is head-of-line blocking?
  - How would you reduce connection overhead for a high-QPS internal API?
SERIES_ORDER:    25
PREV_CHAPTER:    ds-24-service-mesh
NEXT_CHAPTER:    ds-26-interview-questions
```

### Chapter 26
```
CHAPTER_NUMBER:  26
CHAPTER_TITLE:   Popular Interview Questions
TOPICS:
  - Full set of interview questions organized by category from distributed-systems.md chapter 26
  - Fundamentals and Concepts
  - Consistency and Replication
  - Distributed Transactions
  - Messaging and Kafka
  - Distributed Coordination
  - Databases and Storage
  - Caching
  - Reliability and Resilience
  - Networking and Communication
  - API Design
  - Security
  - Commonly asked scenario questions (the 10 walkthroughs)
INTERVIEW_QS: (all questions from chapter 26 in distributed-systems.md)
SERIES_ORDER:    26
PREV_CHAPTER:    ds-25-networking
NEXT_CHAPTER:    none
```
