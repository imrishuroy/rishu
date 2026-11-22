# Microservices Architecture Interview Questions Blog Series Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write three standalone MDX blog posts covering microservices interview questions at Beginner, Intermediate, and Senior levels.

**Architecture:** Three independent MDX files in `content/blogs/`. Each post is standalone (no series frontmatter, no SeriesNav). Each post follows the style of `kafka-idempotent-events.mdx`: plain English, working Go code with `title="file.go"` annotations, ASCII diagrams, no em-dashes.

**Tech Stack:** MDX, Go (all code examples), ASCII diagrams, Next.js 15 MDX pipeline

**Spec:** `docs/superpowers/specs/2026-11-16-microservices-blog-series-design.md`

## Global Constraints

- No em-dashes anywhere — use a comma, period, or rephrase
- All code examples in Go; no Node.js, no pseudocode for things Go can express
- Code blocks use `title="filename.go"` syntax matching the Kafka post
- No fake metrics, no invented benchmarks, no inflated claims
- Frontmatter `date` must be a valid ISO 8601 string (`"YYYY-MM-DD"`)
- Heading hierarchy in MDX: `##` for top-level sections, `###` for subsections, `####` for sub-subsections
- Each post links to the next at the bottom ("Next in this series:")
- Post 1 prerequisite: none. Post 2 prerequisite: Post 1. Post 3 prerequisite: Posts 1 and 2
- Simple language; no marketing speak

## Review Focus

1. **Em-dash check** — grep each file for `—` before shipping; a single one is a CLAUDE.md violation
2. **Go code compiles** — every Go snippet must be syntactically valid; run a mental parse or `gofmt` check on each block
3. **Frontmatter date validity** — `new Date("YYYY-MM-DD")` must not be NaN; always use ISO format
4. **Broken cross-links** — "Next in this series" links reference correct slugs: `ms-architecture-interview-02-intermediate` and `ms-architecture-interview-03-senior`
5. **Heading depth** — no `#` (h1) inside MDX body; `##` is the highest level used in post body

---

### Task 1: Beginner Post

**Files:**
- Create: `content/blogs/ms-architecture-interview-01-beginner.mdx`

**Interfaces:**
- Produces: post at slug `ms-architecture-interview-01-beginner`, linked from Post 2's prerequisites section

**Frontmatter:**
```yaml
title: "Microservices Architecture Interview Questions: Beginner"
date: "2026-11-16"
tags: ["Microservices", "Go", "Distributed Systems", "Architecture"]
summary: "What microservices are, how to draw service boundaries, and why the choice between monolith and microservices is an organizational decision as much as a technical one. With working Go examples and ASCII diagrams."
readTime: 25
draft: false
```

- [ ] **Step 1: Create the file with frontmatter and section stubs**

Create `content/blogs/ms-architecture-interview-01-beginner.mdx` with the frontmatter above and empty `##` headings for each section listed in Step 2. No content yet.

- [ ] **Step 2: Run build to verify frontmatter parses**

Run: `npm run build`
Expected: build succeeds, post appears at `/blogs/ms-architecture-interview-01-beginner`

- [ ] **Step 3: Write the Prerequisites section**

Section heading: `## Before You Start`

Explain four concepts, each with a short Go snippet:
1. HTTP request/response — show a minimal `net/http` server and a `http.Get` call
2. What a database is — one paragraph; no code needed
3. What a process is — relate to "one binary = one process = one service"
4. Network call latency and failure — show `http.Get` with a timeout via `http.Client{Timeout: 2 * time.Second}` and explain why the call can fail

- [ ] **Step 4: Write Q1-Q5: Monolith vs Microservices**

Section heading: `## Monolith vs Microservices`

Cover in order:
1. Define monolith and microservices (Q1) — Go code: a single `main.go` with `/users`, `/orders`, `/email` handlers all in one binary; then show the same split into three separate `main.go` files
2. Comparison table (Q2) — markdown table: Deploy / Scaling / Database / Team coupling / Local dev / Ops complexity / Failure mode / Refactoring
3. When to choose a monolith (Q3) — bullet list: team under 20, product finding fit, no ops expertise
4. When to choose microservices (Q4) — bullet list: independent deploys, different scaling profiles, different reliability needs
5. Distributed monolith (Q5) — ASCII diagram showing two "services" sharing a DB and deploying together; bullet list of tell-tale signs; fix strategies

ASCII diagram for Q1:
```
Monolith:                          Microservices:
+---------------------------+      +---------+  +---------+  +---------+
| /users  /orders  /email   |      |  Users  |  | Orders  |  |  Email  |
| one binary, one DB        |      +---------+  +---------+  +---------+
+---------------------------+          |             |             |
            |                          v             v             v
        [one_db]                  [users_db]   [orders_db]  [email_log]
```

- [ ] **Step 5: Write Q6-Q10: Service Boundaries and Decomposition**

Section heading: `## Service Boundaries and Decomposition`

Cover in order:
1. How to draw boundaries (Q6) — DDD bounded contexts; e-commerce domain list (Catalog, Inventory, Pricing, Cart, Orders, Payments, Shipping, Notifications); ASCII diagram showing the domain split
2. What is a bounded context (Q7) — "Customer" in Sales vs "Customer" in Billing example; Go structs showing different `Customer` types in different packages
3. Aggregates and why they matter (Q8) — Order with line items as an aggregate; Go struct showing `Order` containing `[]LineItem`; explain why aggregates suggest service boundaries
4. Granularity (Q9) — nano-service vs mega-service anti-patterns; heuristic: one bounded context per service
5. Strangler fig migration (Q10) — ASCII diagram showing 3 steps (monolith only, gateway + new service, all services); explain why big-bang rewrites fail

ASCII diagram for strangler fig:
```
Step 1          Step 2                  Step 3
[Monolith]      [Gateway]               [Gateway]
                /        \              /   |   \
         [Monolith]  [New svc]    [Svc1] [Svc2] [Svc3]
```

- [ ] **Step 6: Write Q11-Q12: Communication Overview**

Section heading: `## How Services Talk to Each Other`

Keep this high level (deep dive is Post 2). Cover:
1. Communication options table (Q11) — Synchronous (REST, gRPC) vs Asynchronous (Kafka, RabbitMQ, SQS)
2. Sync vs async decision (Q12) — table: when to use each; Go example of `http.Get` (sync) vs writing to a channel or calling a hypothetical `broker.Publish` (async); explain that sync couples services in time

- [ ] **Step 7: Write Study Recommendations section**

Section heading: `## How to Get Better at This`

Three sub-sections:
- **Build it:** step-by-step instructions to create a 2-service Go app: a `user-service` on port 8080 and an `order-service` on port 8081 that calls the user service via HTTP; include `go.mod` setup and a `main.go` for each
- **Read:** "What is Domain-Driven Design" on martinfowler.com; "Building Microservices" by Sam Newman (intro chapters)
- **Practice:** draw a bounded context diagram for a food delivery app (Rider, Restaurant, Customer, Order, Payment, Notification); identify where the shared "Order" word means different things

- [ ] **Step 8: Add "Next in this series" footer**

At the very end of the file:
```
## Next in This Series

[Microservices Architecture Interview Questions: Intermediate](/blogs/ms-architecture-interview-02-intermediate) covers communication patterns, resilience (circuit breakers, retries, rate limiting), sagas, the outbox pattern, and idempotency.
```

- [ ] **Step 9: Run build and verify**

Run: `npm run build`
Expected: build succeeds with no MDX parse errors

Run: `grep -n "—" content/blogs/ms-architecture-interview-01-beginner.mdx`
Expected: no output (em-dash check)

Run: `grep -n "^# " content/blogs/ms-architecture-interview-01-beginner.mdx`
Expected: no output (no h1 in body; frontmatter title is not a heading)

---

### Task 2: Intermediate Post

**Files:**
- Create: `content/blogs/ms-architecture-interview-02-intermediate.mdx`

**Interfaces:**
- Consumes: slug `ms-architecture-interview-01-beginner` for the prerequisite link
- Produces: post at slug `ms-architecture-interview-02-intermediate`, linked from Post 3's prerequisites section

**Frontmatter:**
```yaml
title: "Microservices Architecture Interview Questions: Intermediate"
date: "2026-11-17"
tags: ["Microservices", "Go", "gRPC", "Kafka", "Resilience", "Distributed Systems"]
summary: "Circuit breakers, retries, sagas, the transactional outbox, and idempotency keys. Everything about inter-service communication and data consistency that trips up engineers moving from monolith to microservices. With working Go examples."
readTime: 35
draft: false
```

- [ ] **Step 1: Create file with frontmatter, prerequisite note, and section stubs**

Create `content/blogs/ms-architecture-interview-02-intermediate.mdx` with the frontmatter above. Add a note at the top of the body:

```
> **Prerequisite:** This post assumes you know the material in [Microservices Architecture Interview Questions: Beginner](/blogs/ms-architecture-interview-01-beginner). Read that first if you are new to microservices.
```

Add empty `##` stubs for each section.

- [ ] **Step 2: Write the Prerequisites section**

Section heading: `## Before You Start`

Explain three concepts with Go snippets:
1. Go goroutines and channels — show a goroutine with `go func(){}()` and a channel send/receive; explain why understanding concurrency matters for bulkhead pattern
2. What a message broker is — one paragraph; relate Kafka/RabbitMQ to a postal system where producers send letters and consumers pick them up asynchronously
3. SQL transactions — show `db.Begin()`, `tx.Exec()`, `tx.Commit()` / `tx.Rollback()` in Go; this is needed to understand the outbox pattern

- [ ] **Step 3: Write Q11-Q14: Communication Patterns**

Section heading: `## Communication Patterns`

Cover in order:
1. REST vs gRPC (Q13) — comparison table (wire format, schema, perf, browser support, streaming, tooling); Go code: a minimal `net/http` REST handler AND a minimal gRPC server with `.proto` definition + generated Go stub showing `pb.RegisterOrdersServer`
2. GraphQL federation (Q14) — explanation only; no Go code (not idiomatic in Go); ASCII diagram showing gateway stitching schemas from two services

- [ ] **Step 4: Write Q15-Q17: API Gateway and BFF**

Section heading: `## API Gateway and BFF`

Cover in order:
1. API gateway (Q15) — ASCII diagram showing mobile/web/partner all hitting a gateway which routes to backend services; bullet list of gateway responsibilities
2. BFF pattern (Q16) — ASCII diagram: iOS BFF, Web BFF, Partner API each routing to same backend; Go code: two separate `http.Handler` routers (one for mobile returning compact JSON, one for web returning richer payload)
3. No business logic in gateway (Q17) — one paragraph explanation

- [ ] **Step 5: Write Q18-Q20: Service Discovery**

Section heading: `## Service Discovery and Load Balancing`

Cover in order:
1. Service discovery (Q18) — server-side vs client-side; Kubernetes DNS explanation; Go code showing `http.Get("http://user-service/users/42")` where `user-service` is a Kubernetes Service DNS name
2. L4 vs L7 load balancing (Q19) — comparison table
3. Client-side load balancing (Q20) — when to use; mention gRPC and service meshes

- [ ] **Step 6: Write Q21-Q26: Resilience Patterns**

Section heading: `## Resilience Patterns`

Cover in order:
1. Circuit breaker (Q21) — ASCII state machine diagram (CLOSED/OPEN/HALF-OPEN with transitions); Go code: a `CircuitBreaker` struct with `state`, `failures`, `threshold`, `resetAt` fields; `Call(fn func() error) error` method that implements the state machine; show how to wrap an HTTP call with it
2. Timeouts (Q22) — Go code: `http.Client{Timeout: 2 * time.Second}` with `context.WithTimeout`; explain TCP defaults and why explicit timeouts are mandatory
3. Retry with backoff (Q23) — Go code: `Retry(fn func() error, maxAttempts int) error` with exponential backoff and jitter (`time.Duration(math.Pow(2, float64(i))) * 100 * time.Millisecond + jitter`); note idempotency requirement
4. Bulkhead (Q24) — Go code: separate `chan struct{}` semaphores for two different downstream services; show how one blocked channel does not affect the other
5. Fallback (Q25) — Go code: `getRecommendations(userID string)` that falls back to `defaultItems()` on error
6. Rate limiting (Q26) — Go code: token bucket implementation as a struct with `tokens float64`, `rate float64`, `lastCheck time.Time`, `Allow() bool` method; show usage in an HTTP middleware

Circuit breaker ASCII diagram:
```
[CLOSED] --(failures >= threshold)--> [OPEN]
                                         |
                                   (cooldown elapsed)
                                         v
                                    [HALF-OPEN]
                                    /           \
                           (success)             (failure)
                               v                      v
                           [CLOSED]               [OPEN]
```

- [ ] **Step 7: Write Q27-Q31: Sagas**

Section heading: `## Sagas and Distributed Workflows`

Cover in order:
1. Why not 2PC (Q27) — explain coordinator failure, lock holding, and availability requirement; bullet list of why 2PC breaks in microservices
2. What is a saga (Q28) — the order saga example (reserve inventory, charge payment, create shipment) with compensations; ASCII diagram showing forward steps and compensation arrows
3. Orchestration vs choreography (Q29) — ASCII diagram for each; comparison table (logic location, coupling, visibility, evolution); Go code: an `OrderOrchestrator` struct with `PlaceOrder(ctx, order)` method that calls inventory, payment, and shipping services in sequence, calling compensations on failure
4. How to implement compensations (Q30) — Go code: `compensateInventoryReservation(ctx, orderID string) error` that is safe to call multiple times
5. Outbox role in saga (Q31) — one paragraph bridging to Q39

- [ ] **Step 8: Write Q37-Q43: Data Consistency**

Section heading: `## Data Consistency`

Cover in order:
1. Service per database rule (Q37) — explain shared DB coupling; bullet: shared release cycle, query interference, re-created monolith
2. Dual write problem (Q38) — ASCII diagram showing write to DB succeeds, Kafka publish fails; Go code showing the broken naive approach
3. Transactional outbox (Q39) — Go code: single `db.Begin()` transaction that inserts into both `orders` table and `outbox` table; separate `relay` goroutine that polls outbox and publishes to broker; this is the core code example for this section
4. Inbox pattern (Q40) — brief explanation; Go code: `processedEvents` table check before handling
5. Change Data Capture (Q41) — explanation only; ASCII diagram: `Postgres WAL -> Debezium -> Kafka -> consumers`
6. Eventual consistency (Q42) — timeline ASCII diagram showing email update propagating across services at T0, T0+50ms, T0+200ms
7. Read-after-write (Q43) — three patterns: route to primary, synchronous wait, optimistic UI update

Outbox Go code should show:
```go title="outbox.go"
func PlaceOrder(ctx context.Context, db *sql.DB, order Order) error {
    tx, err := db.BeginTx(ctx, nil)
    // ... insert into orders
    // ... insert into outbox (event_type, payload, created_at)
    return tx.Commit()
}
```

- [ ] **Step 9: Write Q44-Q46: Idempotency**

Section heading: `## Idempotency`

Cover in order:
1. Why idempotency matters (Q44) — the double-charge example; Go code showing non-idempotent `DecrementStock` vs idempotent version keyed by `orderID` with `EXISTS` check
2. Idempotency keys (Q45) — Go code: HTTP middleware that checks an `Idempotency-Key` header against a `idempotency_keys` table; returns cached response on duplicate; `StoreResponse` and `LoadResponse` interface
3. Exactly-once (Q46) — explain why true exactly-once delivery is impossible; at-least-once + idempotent consumer = effectively-once processing

- [ ] **Step 10: Write Study Recommendations section**

Section heading: `## How to Get Better at This`

Three sub-sections:
- **Build it:** Implement the circuit breaker from scratch (no library); then build a two-service saga with compensations using the outbox pattern and a Postgres DB; test by killing the payment service mid-saga and verifying the inventory reservation is released
- **Read:** "Designing Data-Intensive Applications" by Martin Kleppmann, chapters 7-9 (transactions, distributed systems, consistency)
- **Practice:** Identify three places in a codebase you know where a retry would cause a duplicate side effect; design an idempotency key scheme for each

- [ ] **Step 11: Add "Next in this series" footer**

```
## Next in This Series

[Microservices Architecture Interview Questions: Senior](/blogs/ms-architecture-interview-03-senior) covers event-driven architecture, CQRS, event sourcing, observability with OpenTelemetry, testing strategies, deployment patterns, and when microservices are the wrong choice.
```

- [ ] **Step 12: Run build and verify**

Run: `npm run build`
Expected: build succeeds

Run: `grep -n "—" content/blogs/ms-architecture-interview-02-intermediate.mdx`
Expected: no output (em-dash check)

Run: `grep -n "^# " content/blogs/ms-architecture-interview-02-intermediate.mdx`
Expected: no output (no h1 in body)

---

### Task 3: Senior Post

**Files:**
- Create: `content/blogs/ms-architecture-interview-03-senior.mdx`

**Interfaces:**
- Consumes: slugs `ms-architecture-interview-01-beginner` and `ms-architecture-interview-02-intermediate` for prerequisite links
- Produces: post at slug `ms-architecture-interview-03-senior`

**Frontmatter:**
```yaml
title: "Microservices Architecture Interview Questions: Senior"
date: "2026-11-18"
tags: ["Microservices", "Go", "OpenTelemetry", "CQRS", "Kubernetes", "Service Mesh"]
summary: "Event-driven architecture, CQRS, event sourcing, distributed tracing with OpenTelemetry, contract testing, canary deployments, service mesh, and the anti-patterns that turn microservices into a distributed monolith. With working Go examples."
readTime: 35
draft: false
```

- [ ] **Step 1: Create file with frontmatter, prerequisite note, and section stubs**

Create `content/blogs/ms-architecture-interview-03-senior.mdx` with frontmatter above. Add prerequisite note:

```
> **Prerequisite:** This post builds on [Beginner](/blogs/ms-architecture-interview-01-beginner) and [Intermediate](/blogs/ms-architecture-interview-02-intermediate). Both are required reading.
```

Add empty `##` stubs.

- [ ] **Step 2: Write the Prerequisites section**

Section heading: `## Before You Start`

Explain three concepts:
1. Kubernetes basics — one paragraph: pods (a running container), Services (a stable DNS name that load-balances to pods), Deployments (declarative desired state); no code, one ASCII diagram showing pod/service/deployment relationship
2. Container images — relate to `go build` producing a binary; image is binary + OS dependencies; one paragraph
3. What a distributed trace is — preview the OTel section; one paragraph with a simple "request arrives at gateway, calls orders, orders calls payments" narrative

- [ ] **Step 3: Write Q32-Q36: Event-Driven Architecture, CQRS, Event Sourcing**

Section heading: `## Event-Driven Architecture, CQRS, and Event Sourcing`

Cover in order:
1. Event-driven architecture (Q32) — ASCII diagram showing `Orders` publishing `order.created` consumed by Email, Analytics, Inventory; Go code: define an `Event` interface with `Type() string` and `Payload() []byte`; show a simple in-process event bus `Bus` struct with `Subscribe(eventType string, handler func(Event))` and `Publish(e Event)`; explain producer/consumer decoupling
2. Event vs command (Q33) — table: past tense vs imperative, broadcast vs directed, `OrderPlaced` vs `PlaceOrder`; Go code: two structs `OrderPlacedEvent` (event) and `PlaceOrderCommand` (command) showing the naming convention
3. CQRS (Q34) — ASCII diagram showing write side (command -> aggregate -> emits event -> updates read model) and read side (query -> materialized view); Go code: separate `WriteHandler` function that validates and persists, and `ReadHandler` function that queries a denormalized view; explain when to use (wildly different read/write workloads)
4. Event sourcing (Q35) — ASCII diagram showing event log for Order #42 (OrderPlaced, ItemAdded, CouponApplied, OrderShipped); Go code: `OrderEvent` interface, `[]OrderEvent` slice as the store, `Replay(events []OrderEvent) Order` function that folds events into current state; pros/cons table
5. CQRS without event sourcing (Q36) — one paragraph; they are orthogonal; most teams use CQRS with a normal DB

- [ ] **Step 4: Write Q47-Q51: Observability**

Section heading: `## Observability: Logs, Metrics, and Traces`

Cover in order:
1. Three pillars (Q47) — table: Logs (what happened), Metrics (how is the system), Traces (what was the path)
2. Distributed tracing (Q48) — ASCII trace tree:
```
trace_id=abc123
  span: gateway            200ms total
    span: orders.create    180ms
      span: payments.charge  90ms
      span: inventory.reserve 40ms
```
Go code: OpenTelemetry setup — `import "go.opentelemetry.io/otel"`, `tracer := otel.Tracer("orders")`, `ctx, span := tracer.Start(ctx, "createOrder")`, `defer span.End()`; show setting a span attribute and recording an error
3. Context propagation (Q49) — Go code: `otel.GetTextMapPropagator().Inject(ctx, propagation.HeaderCarrier(req.Header))` on outgoing requests; explain `traceparent` header; show extraction on the receiving side
4. RED metrics (Q50) — explain Rate/Errors/Duration; Go code: Prometheus counter and histogram setup with `prometheus.NewCounterVec` and `prometheus.NewHistogramVec`; USE method for infrastructure
5. Structured logging (Q51) — Go code using `log/slog`: `slog.New(slog.NewJSONHandler(os.Stdout, nil))` with `logger.InfoContext(ctx, "order created", "order_id", id, "trace_id", span.SpanContext().TraceID().String())`

- [ ] **Step 5: Write Q52-Q55: Testing**

Section heading: `## Testing Microservices`

Cover in order:
1. Testing pyramid (Q52) — ASCII pyramid (E2E at top, contract/integration middle, component, unit at base); explain cost and flakiness tradeoffs
2. Consumer-driven contract tests (Q53) — explain Pact concept; Go code: define a `UserServiceContract` struct with `GetUser(id string) (User, error)` and show a contract test that verifies the response shape matches the consumer's expectation; mention Pact Go library
3. Testing message-driven services (Q54) — Go code: use a `FakeBroker` struct with `Publish` and `Subscribe` methods backed by channels; show a test that publishes an event and asserts the handler was called
4. Resilience testing (Q55) — brief explanations of chaos testing (Chaos Mesh, Toxiproxy), game days, load tests past peak; Go code: a `toxiproxy`-style test helper that wraps a TCP listener and injects latency

- [ ] **Step 6: Write Q56-Q58: API Versioning**

Section heading: `## API Versioning and Evolution`

Cover in order:
1. Versioning strategies (Q56) — table (URL versioning, header versioning, schema versioning); Go code: `http.Handle("/v1/users", v1Handler)` and `http.Handle("/v2/users", v2Handler)` router setup
2. Backward-compatible changes (Q57) — safe list (add optional fields, new endpoints, new event types) vs unsafe list (remove/rename field, tighten validation, change type); explain parallel v1/v2 migration
3. Event schema evolution (Q58) — Go code: define `OrderCreatedV1` and `OrderCreatedV2` structs; show a consumer that handles both versions with a type switch; explain schema registry and `BACKWARD` compatibility

- [ ] **Step 7: Write Q59-Q62: Deployment**

Section heading: `## Deployment and Release Patterns`

Cover in order:
1. Independent deploys (Q59) — explain why this is the headline organizational benefit; one paragraph
2. Deployment patterns (Q60) — table: rolling/blue-green/canary/shadow; Kubernetes YAML for a canary deployment using labels:
```yaml
# stable
selector:
  matchLabels:
    app: orders
    track: stable
# canary
selector:
  matchLabels:
    app: orders
    track: canary
```
Explain that traffic split is controlled by replica count ratio
3. Feature flags (Q61) — Go code: `FeatureFlags` interface with `IsEnabled(flag string, userID string) bool`; show usage wrapping a code path; explain decouple deploy from release
4. Polyglot persistence (Q62) — practical advice: standardize on Postgres + Redis; branch out only for genuine need (Elasticsearch for search); explain ops cost

- [ ] **Step 8: Write Q63-Q65: Service Mesh**

Section heading: `## Service Mesh`

Cover in order:
1. What is a service mesh (Q63) — ASCII diagram:
```
[svc A] -- [envoy A] <---mTLS---> [envoy B] -- [svc B]
```
Explain sidecar proxy, mTLS, automatic retries/timeouts; examples: Istio, Linkerd
2. When to adopt (Q64) — bullet list: many services in many languages, need mTLS, want canary at network layer; bullet list of caution: adds Envoy ops complexity, don't adopt just because Netflix does
3. Mesh vs gateway (Q65) — table: north-south vs east-west, auth/rate-limit vs mTLS/retries, one per env vs sidecar per pod; explain real systems use both

- [ ] **Step 9: Write Q66-Q72: Anti-Patterns and When NOT to Use Microservices**

Section heading: `## Anti-Patterns and When Not to Use Microservices`

Cover in order:
1. Common anti-patterns (Q66) — numbered list with one paragraph each: distributed monolith, chatty services, shared database, nano-services, inconsistent error handling, mock-heavy testing
2. Fallacies of distributed computing (Q67) — numbered list of all 8; one sentence per fallacy explaining what breaks when you assume it
3. Two-pizza team rule (Q68) — one paragraph; relate to service ownership
4. Why distributed transactions are hard (Q69) — one paragraph; point back to Q27-Q31 on sagas
5. When NOT to use microservices (Q70) — bullet list: new product/small team, single deploy cadence, latency-critical, tightly coupled domain, limited ops capacity
6. Right starting point (Q71) — recommend modular monolith; extract when module has different scaling, team, or release cadence
7. Sensible defaults summary (Q72) — bullet list of all defaults from the spec: one bounded context per service, async events by default, outbox pattern, idempotent consumers, timeouts + retries + circuit breakers, distributed tracing from day one, schema additive, canary releases + feature flags

- [ ] **Step 10: Write Study Recommendations section**

Section heading: `## How to Get Better at This`

Three sub-sections:
- **Build it:** Add OpenTelemetry to an existing Go service and view traces in Jaeger running locally (`docker run -p 16686:16686 jaegertracing/all-in-one`); then deploy two Go services to k3s locally and configure a canary rollout
- **Read:** "Building Microservices" by Sam Newman (2nd ed.); "Release It!" by Michael Nygard (resilience patterns); "Designing Data-Intensive Applications" chapters 11-12 (stream processing)
- **Watch/Practice:** "GOTO 2019: Small is Beautiful" by Sam Newman (YouTube); implement CQRS for a simple domain (a task list) with separate command and query models backed by the same Postgres DB

- [ ] **Step 11: Add series footer**

```
## Series Index

- [Microservices Architecture Interview Questions: Beginner](/blogs/ms-architecture-interview-01-beginner)
- [Microservices Architecture Interview Questions: Intermediate](/blogs/ms-architecture-interview-02-intermediate)
- **Microservices Architecture Interview Questions: Senior** (this post)
```

- [ ] **Step 12: Run build and verify**

Run: `npm run build`
Expected: build succeeds

Run: `grep -rn "—" content/blogs/ms-architecture-interview-01-beginner.mdx content/blogs/ms-architecture-interview-02-intermediate.mdx content/blogs/ms-architecture-interview-03-senior.mdx`
Expected: no output (final em-dash check on all three posts)

Run: `grep -rn "^# " content/blogs/ms-architecture-interview-01-beginner.mdx content/blogs/ms-architecture-interview-02-intermediate.mdx content/blogs/ms-architecture-interview-03-senior.mdx`
Expected: no output (no h1 in any post body)
