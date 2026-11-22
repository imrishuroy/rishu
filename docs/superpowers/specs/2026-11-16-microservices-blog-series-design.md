# Design: Microservices Architecture Interview Questions Blog Series

**Date:** 2026-11-16
**Author:** Rishu Kumar (portfolio site)

---

## Intent and Why

Write a 3-part blog series covering microservices architecture from beginner to senior level.
Target audience: software engineers preparing for technical interviews or leveling up on
distributed systems. The series lives on rishu.kumar's personal portfolio blog (Next.js 15, MDX).

The existing blog post on Kafka idempotency sets the tone: real-world Go code, working
implementations, plain English, no marketing language, no em-dashes.

---

## Goals

- Cover 72+ microservices interview questions organized into Beginner, Intermediate, and Senior
- Each post stands alone but links to the previous as a prerequisite
- Working Go code for every concept that benefits from code
- ASCII diagrams for architecture and flow concepts
- Each post includes a prerequisites section explaining assumed knowledge
- Each post ends with study recommendations (what to read, build, and practice)
- No em-dashes anywhere
- Language matches the Kafka post: concrete, direct, no inflated claims
- All content consistent with Rishu Kumar's actual engineering background

---

## Non-Goals

- Not a comprehensive distributed systems textbook
- Not covering specific cloud provider implementations (AWS ECS, GCP GKE) in depth
- Not covering frontend or mobile microservices (service mesh for client apps, etc.)
- Not covering database internals beyond what a service engineer needs to know

---

## Anti-Goals

- Do not add fake metrics, benchmarks, or throughput numbers
- Do not use Node.js code from the source material; rewrite everything in Go
- Do not use the word "leverage" or marketing speak
- Do not add em-dashes (CLAUDE.md hard rule)

---

## Constraints

- MDX format: `content/blogs/` with frontmatter (title, date, tags, summary, readTime, draft)
- Code blocks use `title="filename.go"` syntax as seen in the Kafka post
- Diagrams are ASCII only (no image dependencies)
- `PostMeta.date` must be a valid ISO date string
- Maximum MDX file size: no hard limit, but Kafka post at ~28 min read is a good ceiling per post
- Each post is a separate `.mdx` file with its own slug

---

## Approaches Considered

**A. 3 posts by level (Beginner / Intermediate / Senior)** — CHOSEN
Each post covers all relevant topics for that experience level. Clear learning arc.
Easy to link to the right post for a given reader. Chosen because it matches the
user's framing and creates an explicit prerequisite chain.

**B. 5 posts by topic** (Foundations, Communication, Data, Resilience, Operations)
Better topic clustering but no explicit level progression. Reader cannot easily
assess their starting point.

**C. 3 level posts + 1 cheat sheet reference**
Adds a reference card. Deferred because scope is already substantial.
Can be added as a 4th post later.

---

## Post Structure

### Post 1: `ms-architecture-interview-01-beginner.mdx`

**Title:** Microservices Architecture Interview Questions: Beginner
**Tags:** ["Microservices", "Go", "Distributed Systems", "Architecture"]
**Estimated read time:** 25 min

**Prerequisites section explains:**
- What is an HTTP request and response (with Go net/http example)
- What is a database (relation to service data ownership)
- What is a process (relation to service deployment)
- What is a network call (latency, failure modes)

**Topics covered (from source Q1-Q12 + extensions):**
- Monolith vs Microservices (definitions, comparison table, when to use each)
- Distributed monolith (what it is and why it's bad)
- Domain-Driven Design intro: bounded contexts, aggregates
- Service decomposition strategies and granularity
- Strangler fig migration pattern
- Communication overview: sync vs async (high level only)
- Basic inter-service HTTP call in Go

**Go code examples:**
- Simple Go HTTP server (the "monolith" version: users, orders, email in one binary)
- Extracted service with its own HTTP handler
- Basic HTTP client call from one service to another with timeout

**ASCII diagrams:**
- Monolith vs microservices side by side
- Bounded context diagram for e-commerce domain
- Strangler fig migration steps

**Study recommendations:**
- Build a simple 2-service Go app: a user service and an order service that calls user via HTTP
- Read: "What is DDD" by Martin Fowler (free on martinfowler.com)
- Practice: draw a bounded context diagram for a food delivery app

---

### Post 2: `ms-architecture-interview-02-intermediate.mdx`

**Title:** Microservices Architecture Interview Questions: Intermediate
**Tags:** ["Microservices", "Go", "gRPC", "Kafka", "Resilience", "Distributed Systems"]
**Estimated read time:** 35 min

**Prerequisites section explains:**
- Go goroutines and channels (brief intro with example; needed for understanding concurrency in service design)
- What a message broker is (Kafka/RabbitMQ at a high level)
- What SQL transactions are (needed for outbox pattern)

**Topics covered (from source Q11-Q46 + extensions):**
- Communication: REST vs gRPC (with protobuf definition in Go)
- API Gateway and BFF pattern
- Service discovery: how Kubernetes DNS solves this
- Circuit breaker: states, Go implementation using a simple state machine
- Timeouts and retries with exponential backoff + jitter
- Bulkhead pattern: separate goroutine pools per downstream
- Rate limiting: token bucket in Go
- Sagas: orchestration vs choreography (with Go orchestrator example)
- Compensating transactions
- Dual write problem
- Transactional outbox pattern (Go + Postgres)
- Inbox pattern
- Change Data Capture overview
- Eventual consistency: what it means in practice
- Idempotency: idempotency keys, server-side implementation in Go

**Go code examples:**
- HTTP client with timeout, retry, and exponential backoff
- Circuit breaker as a Go struct with state machine
- Token bucket rate limiter in Go
- Outbox pattern: single Postgres transaction for data + event record
- Idempotency key handler middleware in Go

**ASCII diagrams:**
- Circuit breaker state machine (CLOSED -> OPEN -> HALF-OPEN)
- Saga: orchestration flow vs choreography event chain
- Outbox pattern: DB transaction + relay process + broker
- Dual write problem failure scenario

**Study recommendations:**
- Build the circuit breaker from scratch (don't use a library)
- Build a saga with compensations using two services and a Postgres outbox
- Read: "Designing Data-Intensive Applications" by Martin Kleppmann, chapters 7-9
- Practice: implement a rate limiter and test it with concurrent goroutines

---

### Post 3: `ms-architecture-interview-03-senior.mdx`

**Title:** Microservices Architecture Interview Questions: Senior
**Tags:** ["Microservices", "Go", "OpenTelemetry", "CQRS", "Kubernetes", "Service Mesh"]
**Estimated read time:** 35 min

**Prerequisites section explains:**
- What Kubernetes does (pods, services, deployments in one paragraph)
- What a container image is (relation to independent deployment)
- What a distributed trace is (high level, expanded in observability section)

**Topics covered (from source Q32-Q72 + extensions):**
- Event-driven architecture: events vs commands
- CQRS: write model vs read model, when to use it
- Event sourcing: event log as state, replay, tradeoffs
- Observability: logs, metrics, traces (the three pillars)
- Distributed tracing with OpenTelemetry in Go
- Structured logging with Go's slog
- RED and USE metric methods
- Consumer-driven contract tests (Pact concept)
- Chaos testing overview
- API versioning strategies (URL, header, schema additive)
- Deployment patterns: rolling, blue-green, canary (with Kubernetes YAML)
- Feature flags
- Service mesh: what Envoy/Istio does, when to adopt
- Common anti-patterns: distributed monolith, chatty services, shared DB, nano-services
- Fallacies of distributed computing
- When NOT to use microservices

**Go code examples:**
- OpenTelemetry tracer setup and span creation in Go
- Structured logging with slog: JSON output with trace_id field
- gRPC server with proto definition
- Simple CQRS write handler (command) and read handler (query) in Go

**ASCII diagrams:**
- Distributed trace tree: gateway -> orders -> payments + inventory (with timing)
- Service mesh: sidecar proxy pattern
- CQRS write/read model split
- Event sourcing: event log vs current state

**Study recommendations:**
- Add OpenTelemetry to an existing Go service and view traces in Jaeger (free, run locally)
- Read: "Building Microservices" by Sam Newman (2nd edition)
- Practice: deploy two services to a local k3s cluster, add a canary rollout
- Watch: "GOTO 2019: Small is Beautiful" by Sam Newman
- Books for deeper understanding: "Release It!" by Michael Nygard (resilience patterns)

---

## Decisions Resolved During Design

**Series structure:** Standalone. Not part of the existing Distributed Systems series.
Slugs are `ms-architecture-interview-01-beginner`, `-02-intermediate`, `-03-senior`.
DS series chapters 23-24 can link to these posts as further reading later.

**SeriesNav:** Not used. No series index page needed; avoids broken links.
Can be added later if the series grows.

**Blog listing:** Three individual post cards. SeriesGroupCard not wired in for now.

**Source material:** 72 questions provided by the user in the conversation; all content
is Go rewrites of the original Node.js examples plus extensions.

## What the Builder Decides

- Exact Go package names (use `main` for inline examples, named packages where layout matters)
- Exact MDX frontmatter dates (use dates near 2026-11-16)
- Whether to use `title="filename.go"` or plain code blocks (match the Kafka post style: use title)
- Internal cross-links between the three posts (add "Part 1 of 3" headers)
- Whether each post starts with a "hook" paragraph like the Kafka post's elevator button intro
- Exact read time values (count after writing)
- Whether to split a post if it exceeds ~35 min
