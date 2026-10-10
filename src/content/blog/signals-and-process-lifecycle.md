---
title: 'Signals and process lifecycle'
description: 'Pending bits, handlers, stop/continue, and how kill becomes kernel work.'
pubDate: 2026-05-24
topic: process
difficulty: intermediate
tags: ['signal', 'kill', 'sigaction', 'zombie']
---

Signals are asynchronous messages to a task: terminate, stop, dump core, or run a handler.

## Delivery sketch

```mermaid
flowchart LR
  Kill[kill / tkill] --> Pending[pending bitmask]
  Pending --> Check[before return to userspace]
  Check -->|default| Action[terminate / core / ignore]
  Check -->|handler| Frame[signal frame on stack]
  Frame --> Handler[userspace handler]
```

## Lifecycle reminder

```mermaid
stateDiagram-v2
  [*] --> Running
  Running --> Sleeping: block on event
  Sleeping --> Running: wake
  Running --> Zombie: exit
  Zombie --> [*]: wait by parent
  Running --> Stopped: SIGSTOP
  Stopped --> Running: SIGCONT
```

## Keep reading

- `kernel/signal.c`
- Related: [Anatomy of a Linux process](/linternals/blog/anatomy-of-a-linux-process/)
