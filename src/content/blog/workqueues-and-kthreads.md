---
title: 'Workqueues and kthreads'
description: 'Deferred work outside hard IRQ — system workqueues, dedicated kthreads, and when to use each.'
pubDate: 2026-09-25
topic: kernel
difficulty: intermediate
tags: ['workqueue', 'kthread', 'deferred', 'concurrency']
---

Hard IRQ context is tiny and non-sleepable. Much real driver and subsystem work lands on **workqueues** or **kernel threads** that can block, allocate, and take mutexes.

## Placement

```mermaid
flowchart TD
  IRQ[Hard IRQ] --> Soft[Softirq / tasklet]
  Soft --> WQ[Workqueue]
  Soft --> KT[kthread]
  Syscall[Syscall / process context] --> WQ
  Syscall --> KT
```

## Workqueues

```mermaid
sequenceDiagram
  participant Drv as Driver
  participant WQ as workqueue
  participant Worker as worker kthread
  Drv->>WQ: queue_work / schedule_work
  WQ->>Worker: run work function
  Worker->>Worker: may sleep
```

| API flavor | Idea |
| --- | --- |
| `schedule_work` | System-wide queue |
| `alloc_workqueue` | Dedicated queue / attributes |
| `queue_delayed_work` | Run after a delay |

Concurrency, CPU affinity, and reclaim behavior are tunable — start with the system queues unless you need isolation.

## kthreads

A **`kthread_create` / `kthread_run`** loop is a named kernel thread (`kworker`, `kswapd`, driver threads). Prefer workqueues for short deferred jobs; prefer a kthread when you need a long-lived event loop or custom scheduling.

## Source landmarks

| Piece | Where |
| --- | --- |
| Workqueues | `kernel/workqueue.c` |
| kthreads | `kernel/kthread.c` |
| Docs | `Documentation/core-api/workqueue.rst` |

## Lab — Spot workers

<div class="lab">

### Lab — List kernel threads

```bash
ps -eLo pid,tid,comm | grep -E 'kworker|kthread|kswapd' | head -25
# Or:
ls /proc/*/comm 2>/dev/null | head -5
ps -eo pid,comm | awk '$2 ~ /^\[/' | head -20
```

**Expect:** many `[kworker/*]` and other bracketed kernel threads.

</div>

## Keep reading

- [Interrupts, softirqs, and tasklets](/linternals/blog/interrupts-softirqs-and-tasklets/)
- [Locks: spinlocks, mutexes, RCU](/linternals/blog/locks-spinlocks-mutexes-rcu/)
- [Kernel modules and the device model](/linternals/blog/kernel-modules-and-device-model/)
