---
title: 'Namespaces and cgroups'
description: 'Containers are mostly kernel views: isolate with namespaces, limit with cgroups.'
pubDate: 2026-05-03
topic: containers
difficulty: intermediate
tags: ['namespace', 'cgroup', 'container', 'pid']
---

Docker/Podman feel magical until you see the two kernel features underneath: **namespaces** (what you see) and **cgroups** (what you may consume).

## Isolation vs limits

```mermaid
flowchart LR
  subgraph ns [Namespaces]
    Pid[pid]
    Net[net]
    Mnt[mnt]
    Uts[uts]
    User[user]
  end
  subgraph cg [cgroups]
    CPU[cpu]
    Mem[memory]
    IO[io]
  end
  Container[Container] --> ns
  Container --> cg
```

## Experiment

```bash
# Your PID namespace
ls -l /proc/$$/ns
# cgroup membership
cat /proc/$$/cgroup
```

## Source / docs

- `kernel/nsproxy.c`, `kernel/pid_namespace.c`
- [kernel.org — cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

## Keep reading

- Related: [Anatomy of a Linux process](/linternals/blog/anatomy-of-a-linux-process/)
