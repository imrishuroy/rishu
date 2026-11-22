

Fundamentals of Distributed Systems**

  * **Definition & Core Concept:**
      * A distributed system consists of multiple components running across multiple physical or virtual machines.
      * If all components run on a single machine, it is not distributed; local communications avoid network latency and partitioning challenges.
      * From a high-level ("bird's eye view"), a system with dozens of underlying microservices should appear as a single coherent service to external users.
  * **Key Advantages:**
      * **Horizontal Scalability:** Theoretically no limit to adding more machines.
      * **Reliability:** If individual servers fail, other instances take over the load.
      * **Performance:** Allows handling massive scale beyond the memory and CPU limits of a single vertically scaled instance.
  * **Major Trade-offs & Drawbacks:**
      * **Higher Latency:** Every inter-service communication requires a network call, increasing response time compared to monolithic architecture.
      * **Observability Challenges:** Monitoring CPU, memory, network calls, inter-service metrics, and alerts across thousands of servers is complex.
  * **Fundamental Theoretical Problems:**
      * **Consensus:** Agreement among nodes (e.g., voting on a new primary/master database when a master crashes).
      * **Data Consistency:** Resolving conflicts when nodes report differing state values.
      * **Synchronization & Coordination:** Handling clock synchronization, leader election, and distributed locks.
  * **Core Principles of Designing Distributed Systems:**
      * **Rule of Thumb:** Assume every single API call, machine, cache, or database query will fail.
      * **Incremental Design:** Take small steps ("baby steps") and avoid assigning excessive responsibilities to a single component.

-----

### **3. System Failure Modes & Circuit Breakers**

  * **Cascading Failures:**
      * In poorly designed systems, a single bottleneck (e.g., an overloaded profile database) causes high latencies that back up calling services, choking worker threads, depleting memory, and crashing unrelated services in a domino effect.
  * **Circuit Breaker Pattern:**
      * **Concept:** When downstream failure rates or response times cross a threshold, fail fast immediately instead of forwarding requests to an already struggling service.
      * **Mechanism:** Uses a flag/state handler to break the execution chain, serving fallback dummy data, shedding load, or stopping queue processing.
      * **Use Cases:**
        1.  Allows a lagging database read replica time to catch up with master replication lag.
        2.  Allows existing connections to drain smoothly before conducting rebooting, destructive actions, re-deployments, or database snapshots.
      * **Implementation:** Often controlled via feature flags or dynamic config systems like Redis keys.

-----

### **4. Load Balancers: Architecture & Types**

  * **Primary Role:**
      * Acts as a single ingress authority/address for clients, balancing traffic across identical backend API servers to prevent single points of failure and server overload.
  * **Placement Options:**
      * Placed in front of any tier abstracting identical instances.
      * **External/Internet-Facing Load Balancers:** Sits on the edge of the network, accepting internet traffic into a VPC.
      * **Internal Load Balancers:** Sits inside private VPCs between microservices, databases, or cache clusters.
      * **Database Load Balancing Example (AWS Aurora):** Provides a single read endpoint abstracting multiple read replicas, allowing horizontal scaling of read replicas without changing application connection strings.
  * **Types of Load Balancers:**
      * **Software Load Balancer:** Application code running on servers (e.g., NGINX, HAProxy).
      * **Hardware Load Balancer:** Dedicated physical appliances routing physical cabling/network connections.
      * **Layer 4 (L4):** Operates at the Transport Layer (TCP/UDP). It routes raw TCP packets without inspecting application-level payload or HTTP headers.
      * **Layer 7 (L7):** Operates at the Application Layer (HTTP/HTTPS). It can inspect HTTP headers, cookies, URL paths, and body payloads to make intelligent routing choices.

-----

### **5. Routing & Load Balancing Algorithms**

  * **Round Robin:** Sequentially routes requests across available instances ($1 \\rightarrow 2 \\rightarrow 3 \\rightarrow 1$).
  * **Weighted Round Robin:** Distributes requests based on pre-assigned server capacities/weights (e.g., $2:1:1$).
  * **Least Connections:** Forwards traffic to the instance with the fewest active connections. Ideal when API response times have large variations (e.g., 1-second vs. 5-minute requests) to avoid overloading unlucky servers.
  * **IP Hash:** Hashes client IP addresses to enforce server stickiness, directing a specific client to the same server for localized caching benefits.
  * **URL Hash / Prefix Matching:** Hashes the request path (e.g., routing `/payments` to Payment Service and `/profile` to Profile Service). Commonly used in API Gateways.

-----

### **7. System Design Components of a Production-Grade Load Balancer**

  * **Heartbeat / Health Checker:**
      * An independent service that pings configured backend endpoints periodically.
      * Updates registry databases/in-memory state, marking unhealthy servers to remove them from active routing schedules.
  * **Connection Pooling:**
      * Pre-warms TCP connections between the load balancer and backend servers to eliminate three-way handshake overhead on incoming client requests.
  * **Backend Discovery Engine:**
      * Automatically registers new backend instances using broadcast/multicast protocols or internal service discovery mechanisms.
  * **Trigger / Event System:**
      * Publishes lifecycle events (e.g., node addition, node failure, host health changes) to message streams like Kafka, Kinesis, or SQS.
      * Feeds down-stream consumers such as autoscaling groups, alerting channels, and usage-based billing engines.
  * **Stats & Observability Engine:**
      * Exposes time-series telemetry (active TCP sockets, HTTP $4xx/5xx$ rates, CPU, memory, bandwidth usage).
      * **Pull-Based Metrics (Prometheus):** Instead of servers constantly pushing stats and overwhelming monitoring services, Prometheus polls HTTP `/metrics` endpoints at configured intervals.
      * Visualizations built using Grafana dashboards.

-----

### **8. Scaling Load Balancers & DNS Offloading**

  * **Scaling the Load Balancer Tier:**
      * A single load balancer instance can handle hundreds of thousands or millions of concurrent connections, but it remains a single point of failure.
  * **DNS-Based Load Balancing (Route 53 / CoreDNS):**
      * Load balancers themselves are scaled horizontally by registering multiple load balancer IP addresses under a single domain name in DNS.
      * DNS handles the top-tier traffic distribution using weighted routing policies, returning one of the load balancer IPs to the client during DNS resolution.
      * The client directly forms a TCP connection to the resolved load balancer IP.

-----

### **9. Remote Locks & Distributed Lock Managers**

  * **Need for Remote Locks:**
      * Local process locks (e.g., Mutexes) only synchronize threads running within the same machine memory.
      * Distributed systems require a centralized Lock Manager to coordinate execution critical sections across separate servers.
  * **Core Prerequisite — Atomicity:**
      * The fundamental requirement for any database or storage system acting as a Lock Manager is **Atomicity**.
      * Lock manager candidate technologies include Redis, DynamoDB (atomic condition expressions), SQL databases (ACID transactions), and ZooKeeper/Etcd.
  * **Essential Lock Characteristics:**
    1.  **Isolation:** Concurrent callers cannot interfere with the lock state.
    2.  **TTL (Time-To-Live):** Expiration limits must be set on locks to prevent permanent system deadlocks if a process crashes while holding a lock.
  * **Real-World Examples:**
      * **Ticketing Systems (e.g., BookMyShow):** Temporarily locking seat IDs while payment processes.
      * **Distributed Job Schedulers / Crons:** Preventing duplicate parallel workers from executing the same scheduled job.
      * **Queue Consumers (SQS Exactly-Once Simulation):** Locking a queue partition or message ID so that only one worker retrieves and processes a message before deletion \[cite: 3018, 3019, 3021, 3022, 3023, 3026, 3027, 3057, 3071, 3072, 3073, 3076, 3077, 3078, 3079, 3080, 3136, 3137, 3138, 3139, 3143, 3144, 3147, 3148, 3213, 3214, 3215, 3216, 3228, 3229, 3230, 3233, 3234, 3235, 3236\].
      * **Multi-Shard Database Transactions (MongoDB):** MongoDB maintains cross-shard ACID transaction compliance by placing document-level locks via a distributed lock manager.

-----

### **10. The Redlock Algorithm & Distributed Locks**

  * **Single Redis Lock Limitations:**
      * Using a single Redis instance as a lock manager creates a single point of failure. If Redis crashes or loses in-memory data, active locks evaporate.
  * **Atomic Redis Lock Syntax:**
      * Acquiring a lock atomically:
        `SET resource_name client_id NX PX 30000`
          * `NX`: Sets key only if it does not already exist (ensures conditional acquisition).
          * `PX 30000`: Sets automatic TTL expiration (e.g., 30,000 milliseconds).
      * Releasing a lock safely:
          * Must retrieve the key value first and verify that `value == client_id` before deleting.
          * Prevents a slow/delayed process from accidentally releasing a lock held by another process.
  * **Redlock Algorithm Setup:**
      * Uses **$N$ independent Redis master nodes** (typically $N=5$, odd numbers required) without cross-node master-slave replication.
      * **Acquisition Process:**
        1.  The client sequentially requests locks across all 5 nodes using a tight timeout.
        2.  The lock is granted **only if the client acquires the lock on a majority of nodes** (e.g., at least 3 out of 5) within the allocated time.
        3.  If the lock attempt fails (acquiring fewer than 3 nodes), the client proactively sends release/delete commands to all nodes to clean up partial states.
      * Eliminates single points of failure while retaining lock validity across node crashes.
  * **Recommended Literature:**
      * *Distributed Locks with Redis* & Critique by Martin Kleppmann.
      * Google’s *Chubby Lock Service for Loosely-Coupled Distributed Systems* paper.
