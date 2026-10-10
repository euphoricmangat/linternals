---
title: 'Interrupts, softirqs, and bottom halves'
description: 'Hard IRQs must be short — softirqs and workqueues finish the job.'
pubDate: 2026-04-19
topic: interrupts
difficulty: intermediate
tags: ['irq', 'softirq', 'napi', 'bottom-half']
---

Devices interrupt the CPU. The top half acknowledges hardware quickly; deferred work runs later in a safer context.

## Split the work

```mermaid
sequenceDiagram
  participant HW as Device
  participant Top as Hard IRQ handler
  participant Soft as Softirq / NAPI
  participant Thread as Threaded IRQ / workqueue
  HW->>Top: IRQ line
  Top->>Top: ack + minimal work
  Top->>Soft: schedule softirq
  Soft->>Thread: optional heavier work
```

## Why it matters

- Hard IRQ context: no sleeping, keep it tiny
- Softirqs / NAPI: batch packet processing
- Threaded IRQs & workqueues: can sleep, use locks normally

## Inspect live

```bash
cat /proc/interrupts | head
# softirq counters
cat /proc/softirqs
```

## Keep reading

- [Timers and timekeeping](/linternals/blog/timers-and-timekeeping/)
- [kernel.org — IRQ](https://docs.kernel.org/core-api/genericirq.html)
- Related: [Locks: spinlocks, mutexes, RCU](/linternals/blog/locks-spinlocks-mutexes-rcu/)
