---
title: 'Time namespaces'
description: 'Offsetting CLOCK_MONOTONIC / BOOTTIME for containers — checkpoint/restore and nested clocks.'
pubDate: 2026-10-20
topic: containers
difficulty: deep
tags: ['time', 'namespaces', 'criu', 'clock']
---

**Time namespaces** let a process tree see shifted **monotonic** and **boottime** clocks. Useful for checkpoint/restore and testing without lying about wall-clock `CLOCK_REALTIME` globally.

## What shifts

```mermaid
flowchart TD
  Host[Host clocks] --> Real[CLOCK_REALTIME — usually shared]
  Host --> Mono[CLOCK_MONOTONIC + offsets]
  Host --> Boot[CLOCK_BOOTTIME + offsets]
  Mono --> NS[Time namespace view]
  Boot --> NS
```

## Use cases

```mermaid
mindmap
  root((time_ns))
    CRIU
      restore monotonic
    Testing
      accelerate clocks
    Nesting
      offsets add up
```

| Clock | Typical time-ns behavior |
| --- | --- |
| `CLOCK_REALTIME` | Not offset by time ns (settime rules elsewhere) |
| `CLOCK_MONOTONIC` | Offset per namespace |
| `CLOCK_BOOTTIME` | Offset per namespace |

Exact semantics follow `man 7 time_namespaces` — read before relying on them.

## Source landmarks

| Piece | Where |
| --- | --- |
| Core | `kernel/time/namespace.c` |
| Man | `time_namespaces(7)` |
| Related | [Timers and timekeeping](/linternals/blog/timers-and-timekeeping/) |

## Lab — Check support

<div class="lab">

### Lab — time ns inode

```bash
ls -l /proc/$$/ns/time 2>/dev/null || echo "time ns not in this kernel/userspace"
man 7 time_namespaces 2>/dev/null | head -15 || true
```

**Expect:** a `time:[…]` ns symlink on kernels with `CONFIG_TIME_NS`.

</div>

## Keep reading

- [Namespaces and cgroups](/linternals/blog/namespaces-and-cgroups/)
- [Timers and timekeeping](/linternals/blog/timers-and-timekeeping/)
- [vDSO and vsyscall](/linternals/blog/vdso-and-vsyscall/)
