---
title: 'Locks: spinlocks, mutexes, RCU'
description: 'When the kernel waits, spins, or publishes lock-free reads — picking the right sync primitive.'
pubDate: 2026-04-26
topic: sync
difficulty: deep
tags: ['spinlock', 'mutex', 'rcu', 'locking']
---

Concurrency is everywhere in the kernel. The wrong lock in the wrong context = deadlock or soft lockup.

## Quick chooser

```mermaid
flowchart TD
  Q{Can I sleep?}
  Q -->|no IRQ / atomic| Spin[spinlock]
  Q -->|yes process context| Sleep[mutex / rwsem]
  ReadHeavy[Many readers rare writers] --> RCU[RCU]
```

## Mental notes

- **spinlock** — busy-wait; never sleep while holding
- **mutex** — can sleep; process context only
- **RCU** — readers run lock-free; writers publish carefully

```mermaid
sequenceDiagram
  participant R as Reader
  participant W as Writer
  R->>R: rcu_read_lock
  R->>R: traverse published structure
  R->>R: rcu_read_unlock
  W->>W: copy / update
  W->>W: rcu_assign_pointer
  W->>W: synchronize_rcu / call_rcu
```

## Keep reading

- [kernel.org — locking](https://docs.kernel.org/locking/)
- [kernel.org — RCU](https://docs.kernel.org/RCU/)
