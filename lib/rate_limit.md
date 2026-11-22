// package main

// import (
//     "fmt"
//     "sync"
//     "time"
// )

// type Bucket struct {
//     tokens     float64
//     lastRefill time.Time
// }

// type RateLimiter struct {
//     mu sync.Mutex

//     // Maximum number of tokens the bucket can hold.
//     capacity float64

//     // Number of tokens added per second.
//     refillRate float64

//     // Each client has its own token bucket.
//     buckets map[string]*Bucket
// }

// func NewRateLimiter(capacity int, refillRate float64) *RateLimiter {
//     return &RateLimiter{
//         capacity:   float64(capacity),
//         refillRate: refillRate,
//         buckets:    make(map[string]*Bucket),
//     }
// }

// // Allow reports whether a request from the client can proceed.
// func (r *RateLimiter) Allow(clientID string) bool {
//     r.mu.Lock()
//     defer r.mu.Unlock()

//     now := time.Now()

//     bucket, exists := r.buckets[clientID]

//     // A new client starts with a full bucket.
//     if !exists {
//         bucket = &Bucket{
//             tokens:     r.capacity,
//             lastRefill: now,
//         }

//         r.buckets[clientID] = bucket
//     }

//     // Calculate how much time has passed since the last refill.
//     elapsed := now.Sub(bucket.lastRefill).Seconds()

//     // Refill tokens according to the elapsed time.
//     bucket.tokens += elapsed * r.refillRate

//     // Never allow the bucket to exceed its maximum capacity.
//     if bucket.tokens > r.capacity {
//         bucket.tokens = r.capacity
//     }

//     bucket.lastRefill = now

//     // Reject the request if no token is available.
//     if bucket.tokens < 1 {
//         return false
//     }

//     // Consume one token for the accepted request.
//     bucket.tokens--

//     return true
// }

// func main() {
//     limiter := NewRateLimiter(3, 1)

//     for i := 1; i <= 5; i++ {
//         if limiter.Allow("client-A") {
//             fmt.Println("Request", i, "allowed")
//         } else {
//             fmt.Println("Request", i, "rejected")
//         }
//     }
// }

// /*

// How this implementation works

// The algorithm has four steps:

// 1. Find or create the client’s bucket.
// 2. Calculate the elapsed time since the previous refill.
// 3. Replenish tokens, without exceeding capacity.
// 4. Accept the request if at least one token is available, then consume a token.

// For the initial burst of five requests, with capacity three and no meaningful delay between requests, three should be accepted and two rejected.

// Complexity

// With an ordinary Go map:

// * Time: O(1) average per request.
// * Space: O(number of tracked clients).

// The memory cost matters. If the limiter sees millions of distinct client identifiers, its map can grow without bound unless expired buckets are removed or another bounded storage strategy is used.

