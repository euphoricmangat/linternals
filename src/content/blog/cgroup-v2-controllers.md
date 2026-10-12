---
title: 'cgroup v2 controllers'
description: 'cpu, memory, io, and pids — how unified hierarchy limits show up under /sys/fs/cgroup.'
pubDate: 2026-10-01
topic: containers
difficulty: intermediate
tags: ['cgroup', 'cgroupv2', 'memory', 'cpu']
---

**cgroup v2** is a single hierarchy. Controllers plug into directories under `/sys/fs/cgroup`; writing interface files applies limits to a process tree.

## Hierarchy sketch

```mermaid
flowchart TB
  Root["/sys/fs/cgroup"]
  Root --> Sys[system.slice]
  Root --> User[user.slice]
  Root --> Cont["container.slice / runtime"]
  Cont --> JobA[app.scope]
  Cont --> JobB[other.scope]
```

## Controllers you will meet

```mermaid
mindmap
  root((cgroup v2))
    cpu
      cpu.max
      cpu.weight
    memory
      memory.max
      memory.current
    io
      io.max
      io.weight
    pids
      pids.max
```

| File (examples) | Meaning |
| --- | --- |
| `cgroup.procs` | PIDs in this cgroup |
| `memory.current` / `memory.max` | Usage / hard cap |
| `cpu.max` | Quota / period |
| `pids.max` | Fork bomb brake |

Exact files depend on enabled controllers (`cgroup.controllers`).

## Source landmarks

| Piece | Where |
| --- | --- |
| Core | `kernel/cgroup/` |
| Memory | `mm/memcontrol.c` |
| Docs | `Documentation/admin-guide/cgroup-v2.rst` |

## Lab — Read your cgroup

<div class="lab">

### Lab — Where am I?

```bash
# v2 path for this shell (format varies slightly)
cat /proc/$$/cgroup
# If on a unified hierarchy:
CG=$(awk -F: '$1=="0"{print $3}' /proc/$$/cgroup)
echo "cgroup path: $CG"
ls /sys/fs/cgroup$CG 2>/dev/null | head -20
```

**Expect:** a path under `/sys/fs/cgroup` and controller files like `memory.current` when available.

</div>

## Keep reading

- [Namespaces and cgroups](/linternals/blog/namespaces-and-cgroups/)
- [PID namespaces (deep)](/linternals/blog/pid-namespaces-deep/)
- [Memory reclaim and OOM](/linternals/blog/memory-reclaim-and-oom/)
