/*
# 4. Problem Three: Implement a Time-Based Task Scheduler

**Difficulty:** Medium
**Key concepts:** Priority queues, goroutines, channels, timers and cancellation

## Interview prompt

This is a practical backend engineering problem.

Imagine you need to execute tasks at specific times.

```text
Task A -> Execute after 2 seconds
Task B -> Execute after 5 seconds
Task C -> Execute after 3 seconds
```

The scheduler must execute tasks when they become due.

If tasks are scheduled for different times, we need an efficient way to determine which task is due next.

## Step 1: Choose a data structure

A min-heap is a natural choice.

Each task stores:

* An identifier.
* An execution time.
* A function to execute.

The task with the earliest execution time stays at the top of the heap.

```text

	   [A]  <- earliest task
	  /   \
	[B]   [C]

```

This lets us retrieve the next task efficiently.

A binary min-heap provides:

* Insertion: $O(\log n)$.
* Removing the earliest task: $O(\log n)$.
* Peeking at the earliest task: $O(1)$.

Go provides the `container/heap` package for implementing heaps.

## Step 2: Understand the scheduler’s main loop

A basic scheduler repeatedly:

1. Checks the task at the top of the heap.
2. Waits until that task’s execution time.
3. Removes it from the heap.
4. Executes the task.
5. Repeats.

However, there’s an important problem.

What happens if a new task arrives with an earlier execution time while the scheduler is waiting?

For example:

```text
Existing task -> Execute in 10 seconds

Scheduler begins waiting for 10 seconds.

New task arrives -> Execute in 1 second
```

If the scheduler simply sleeps for ten seconds, it will execute the new task too late.

Therefore, a practical implementation must wake up when a newly scheduled task changes which task is due next.

This is where a timer and a notification channel are useful.

## Step 3: A simplified Go implementation

The following implementation uses a min-heap and a single scheduler goroutine. It supports scheduling tasks at specific times, concurrent submissions, and graceful shutdown.

It deliberately executes each task in its own goroutine so that a long-running task does not block scheduling other due tasks.

Save this file as `task_scheduler.go` and run it with:

```sh
go run lib/task_scheduler.go
```

Run this file by name because other standalone examples in `lib` also define `main`.
The example waits five seconds, then exits after both scheduled tasks have run.
*/
package main

import (
	"container/heap"
	"context"
	"fmt"
	"sync"
	"time"
)

// Task describes work that becomes eligible to run at executeAt.
type Task struct {
	// id is available for logging or tracking; the demo does not use it.
	id int
	// executeAt is an absolute time, not a delay relative to scheduler startup.
	executeAt time.Time
	// run contains the work dispatched when the task becomes due.
	run func()
}

// TaskHeap is a min-heap ordered by execution time, with the earliest task at index 0.
type TaskHeap []*Task

func (h TaskHeap) Len() int {
	return len(h)
}

func (h TaskHeap) Less(i, j int) bool {
	return h[i].executeAt.Before(h[j].executeAt)
}

func (h TaskHeap) Swap(i, j int) {
	h[i], h[j] = h[j], h[i]
}

func (h *TaskHeap) Push(x any) {
	// heap.Interface Push appends; container/heap restores the ordering afterward.
	*h = append(*h, x.(*Task))
}

func (h *TaskHeap) Pop() any {
	// heap.Interface Pop removes the last element; container/heap moves the root here.
	old := *h
	n := len(old)

	task := old[n-1]
	old[n-1] = nil
	*h = old[:n-1]

	return task
}

// Scheduler owns the pending-task heap and the goroutine that dispatches due tasks.
type Scheduler struct {
	// mu protects tasks and closed. The heap itself is not concurrency-safe.
	mu sync.Mutex

	tasks TaskHeap

	// Wake the scheduler when a new task may change the
	// earliest execution time.
	notify chan struct{}

	// Protects against scheduling new work after shutdown.
	closed bool
}

// NewScheduler creates an empty task queue and its wake-up notification channel.
func NewScheduler() *Scheduler {
	s := &Scheduler{
		tasks:  TaskHeap{},
		notify: make(chan struct{}, 1),
	}

	heap.Init(&s.tasks)

	return s
}

// Schedule adds a task to the heap and wakes Run so it can recalculate its timer.
func (s *Scheduler) Schedule(task *Task) error {
	s.mu.Lock()

	if s.closed {
		s.mu.Unlock()
		return fmt.Errorf("scheduler is closed")
	}

	// Insert under the same lock Run uses when inspecting and removing tasks.
	heap.Push(&s.tasks, task)

	s.mu.Unlock()

	// A buffered notification coalesces multiple submissions.
	// We only need to know that the queue may have changed.
	select {
	case s.notify <- struct{}{}:
	default:
	}

	return nil
}

// Run waits for tasks to become due and dispatches each task in a new goroutine.
// Start Run once. It returns when the context is cancelled or the scheduler is closed.
func (s *Scheduler) Run(ctx context.Context) {
	for {
		s.mu.Lock()

		if s.closed {
			s.mu.Unlock()
			return
		}

		// If there are no tasks, wait for new work or shutdown.
		if len(s.tasks) == 0 {
			s.mu.Unlock()

			// Sleep without polling until work arrives or the context is cancelled.
			select {
			case <-s.notify:
				continue
			case <-ctx.Done():
				return
			}
		}

		// Inspect the task with the earliest execution time.
		next := s.tasks[0]
		delay := time.Until(next.executeAt)

		s.mu.Unlock()

		if delay > 0 {
			timer := time.NewTimer(delay)

			select {
			case <-timer.C:
				// The earliest task is now due.
			case <-s.notify:
				// A new task may now be earliest, so stop waiting and inspect the heap again.
				if !timer.Stop() {
					select {
					case <-timer.C:
					default:
					}
				}
				continue
			case <-ctx.Done():
				if !timer.Stop() {
					select {
					case <-timer.C:
					default:
					}
				}
				return
			}
		}

		s.mu.Lock()

		// Scheduling may have changed the heap while the timer was running.
		// Recheck under the lock before removing a task.
		if len(s.tasks) == 0 ||
			time.Until(s.tasks[0].executeAt) > 0 {
			s.mu.Unlock()
			continue
		}

		task := heap.Pop(&s.tasks).(*Task)
		s.mu.Unlock()

		// Do not hold the scheduler mutex while executing user code.
		go task.run()
	}
}

// Close rejects future tasks and wakes Run so it can exit.
// It does not wait for tasks that have already been dispatched.
func (s *Scheduler) Close() {
	// Mark closed before notifying so Schedule cannot accept more work afterward.
	s.mu.Lock()
	s.closed = true
	s.mu.Unlock()

	select {
	case s.notify <- struct{}{}:
	default:
	}
}

func main() {
	scheduler := NewScheduler()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go scheduler.Run(ctx)

	_ = scheduler.Schedule(&Task{
		id:        1,
		executeAt: time.Now().Add(2 * time.Second),
		run: func() {
			fmt.Println("Task 1 executed")
		},
	})

	_ = scheduler.Schedule(&Task{
		id:        2,
		executeAt: time.Now().Add(4 * time.Second),
		run: func() {
			fmt.Println("Task 2 executed")
		},
	})

	time.Sleep(5 * time.Second)

	scheduler.Close()
	cancel()
}

/*
## Important production considerations

This is an interview-oriented scheduler, not a complete production-ready scheduler.

In particular:

* Tasks already dispatched to goroutines are not cancelled by Close.
* The scheduler does not wait for running tasks to finish.
* The example doesn’t implement task persistence, retries or recovery after a process crash.
* A task’s execution function must be safe for concurrent execution if the same underlying resources are shared.
* If multiple tasks become due together, the scheduler may launch them concurrently rather than guarantee strict execution order.

A more robust implementation would add a worker pool, bounded queue, task cancellation, observability, retry policy and explicit shutdown semantics.

### Follow-up 1: Why use a heap instead of a sorted slice?

A sorted slice can be simple, but inserting tasks into the correct position may require O(n) work.

A heap offers O(log n) insertion and removal while still allowing O(1) access to the earliest task.

For a very small number of tasks, a sorted slice might be perfectly adequate. For a larger queue with frequent insertions and removals, a heap is generally more suitable.

### Follow-up 2: What happens if a task takes 30 seconds?

If the scheduler executes a task synchronously, the next task might be delayed for 30 seconds.

There are two common approaches:

1. Execute each task in a goroutine.
2. Dispatch tasks to a worker pool.

A worker pool is often preferable in production because it bounds the number of concurrent tasks.

If you use goroutines without limits, a large burst of due tasks can create excessive concurrency and memory pressure.

### Follow-up 3: How would you schedule millions of tasks?

At that scale, discuss:

* Persisting task metadata in a database or durable queue.
* Partitioning tasks by execution time or key.
* Using multiple scheduler instances.
* Avoiding duplicate execution.
* Recovering overdue tasks after restarts.
* Applying backpressure when workers are saturated.
* Monitoring queue depth and task execution delay.

If tasks must survive a process crash, an in-memory heap alone is insufficient.


# 5. Concurrency questions you should expect

Since the question you shared explicitly mentions concurrency and synchronization, I would prepare these carefully.

## Question 1: What is a race condition?

A race condition occurs when the correctness of a program depends on the timing or interleaving of concurrent operations.

For example:

```go
counter := 0

for i := 0; i < 1000; i++ {
    go func() {
        counter++
    }()
}
```

This is unsafe.

The expression counter++ is a read-modify-write operation. Multiple goroutines can read the same value and overwrite each other’s updates.

A mutex solves this:

```go
var mu sync.Mutex
counter := 0

for i := 0; i < 1000; i++ {
    go func() {
        mu.Lock()
        counter++
        mu.Unlock()
    }()
}
```

For a real program, you should also wait for the goroutines to finish before reading the final value, using a sync.WaitGroup or another synchronization mechanism.

## Question 2: Mutex versus RWMutex?

| Feature | `sync.Mutex` | `sync.RWMutex` |
| --- | --- | --- |
| Multiple simultaneous readers | No | Yes |
| Exclusive writer | Yes | Yes |
| Implementation complexity | Lower | Slightly higher |
| Good use case | General shared mutable state | Read-heavy state with genuinely parallel reads |

Do not assume RWMutex is always faster. Benchmark the workload.

For the LRU cache, Get changes usage order, so it requires exclusive synchronization even though it retrieves a value.


## Question 3: Channels versus mutexes?

A good answer is:

I use a mutex when multiple goroutines need to access shared mutable state and I want to protect an invariant. I use channels when goroutines need to communicate, coordinate work or transfer ownership of data. The choice depends on the problem, and neither approach is automatically superior.

For example:

* LRU cache: A mutex is a natural choice.
* Task scheduler: Channels can notify the scheduler of new work, while a mutex protects the heap.
* Worker pool: Channels are useful for distributing jobs to workers.

It is completely reasonable to use both in the same program.

## Question 4: How would you find race conditions in Go?

Use Go’s race detector:

```sh
go test -race ./...
```

Or run your application:

```sh
go run -race lib/task_scheduler.go
```

It can identify many unsynchronized memory accesses during execution, although it does not prove the absence of all concurrency bugs.
*/
