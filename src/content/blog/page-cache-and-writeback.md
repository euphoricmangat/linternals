---
title: 'Page cache and writeback'
description: 'How file data sits in RAM, when dirty pages flush, and where to read the mm/fs handoff.'
pubDate: 2026-06-07
topic: memory
difficulty: deep
tags: ['page-cache', 'writeback', 'folio', 'dirty']
---

File I/O rarely hits disk on every `read`/`write`. The **page cache** (folios in modern kernels) holds file contents in RAM; **writeback** pushes dirty pages to storage later.

## Big picture

```mermaid
flowchart LR
  App[read / write] --> VFS[VFS]
  VFS --> Cache[Page cache / folios]
  Cache -->|miss| FS[Filesystem + block I/O]
  Cache -->|hit| App
  Cache -->|dirty| WB[Writeback]
  WB --> FS
```

## Read path (simplified)

1. VFS resolves the inode / mapping.
2. Find or allocate a folio in the address_space page cache.
3. On miss: filesystem fills the folio from disk (often via the block layer).
4. Copy data to userspace (or map it for `mmap`).

## Write path (simplified)

1. Data lands in cache; pages marked **dirty**.
2. Background flusher threads / balance_dirty_pages decide when to writeback.
3. Filesystem turns dirty ranges into bios; storage completes; pages clean again.

```mermaid
sequenceDiagram
  participant App
  participant Cache as Page cache
  participant WB as Writeback
  participant Disk
  App->>Cache: write()
  Cache->>Cache: mark dirty
  WB->>Disk: flush dirty folios
  Disk-->>WB: complete
  WB->>Cache: mark clean
```

## Source landmarks

| Idea | Where |
| --- | --- |
| address_space / mapping | `include/linux/fs.h`, `mm/filemap.c` |
| filemap read | `mm/filemap.c` (`filemap_read`, etc.) |
| writeback | `mm/page-writeback.c`, `fs/fs-writeback.c` |
| folios | `mm/folio-*.c`, docs under `Documentation/mm/` |

## Lab — Watch cache pressure

<div class="lab">

### Lab — Dirty pages and reclaim clues

**Goal:** See the kernel’s view of cached / dirty memory.

1. Snapshot memory overview:
   ```bash
   grep -E '^(MemTotal|MemFree|Cached|Dirty|Writeback)' /proc/meminfo
   ```
2. Generate some file cache (safe in `/tmp`):
   ```bash
   dd if=/dev/zero of=/tmp/linternals-cache.bin bs=1M count=64 status=none
   grep -E '^(Cached|Dirty)' /proc/meminfo
   ```
3. Drop caches if you have root and want a before/after (optional):
   ```bash
   sync
   # sudo sh -c 'echo 3 > /proc/sys/vm/drop_caches'   # careful on shared machines
   ```
**Expect:** `Cached` rises after the `dd`; `Dirty` may spike briefly then fall after writeback.

</div>

## Keep reading

- [Virtual memory walkthrough](/linternals/blog/virtual-memory-walkthrough/)
- [Block layer and bio](/linternals/blog/block-layer-and-bio/)
- [splice and sendfile](/linternals/blog/splice-and-sendfile/)
- [Memory reclaim and OOM](/linternals/blog/memory-reclaim-and-oom/)
- [VFS and the open path](/linternals/blog/vfs-and-the-open-path/)
- [kernel.org — mm](https://docs.kernel.org/mm/index.html)
