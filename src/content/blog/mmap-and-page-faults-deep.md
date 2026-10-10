---
title: 'mmap and page faults (deep)'
description: 'Creating VMAs with mmap, then paying for pages on first touch via handle_mm_fault.'
pubDate: 2026-07-05
topic: memory
difficulty: deep
tags: ['mmap', 'vma', 'fault', 'handle_mm_fault']
---

`read` copies into a buffer. **`mmap`** maps a file (or anonymous memory) into the address space so the CPU faults pages in on demand.

## Creating a mapping

```mermaid
sequenceDiagram
  participant App
  participant Sys as mmap syscall
  participant MM as mm / mmap.c
  App->>Sys: mmap(addr, len, prot, flags, fd, off)
  Sys->>MM: do_mmap / mmap_region
  MM->>MM: find gap, merge VMAs
  MM-->>App: mapped address
```

Nothing guarantees the pages are resident yet — that comes on **first touch**.

## Fault outcomes

```mermaid
stateDiagram-v2
  [*] --> Touch: CPU load/store
  Touch --> Hit: PTE present
  Touch --> Fault: PTE missing / perm
  Hit --> [*]
  Fault --> Anon: anonymous
  Fault --> File: file-backed
  Fault --> Cow: write to shared/COW
  Fault --> Sigbus: error
  Anon --> Mapped
  File --> Mapped
  Cow --> Mapped
  Mapped --> [*]
  Sigbus --> [*]
```

## Source landmarks

| Piece | Where |
| --- | --- |
| mmap | `mm/mmap.c` |
| fault | `mm/memory.c` (`handle_mm_fault`) |
| filemap fault | `mm/filemap.c` |
| VMA types | `include/linux/mm_types.h` |

## Lab — Map a file and watch RSS

<div class="lab">

### Lab — Demand paging in `/proc`

1. Create a small file and map it with a one-liner (Python):
   ```bash
   dd if=/dev/zero of=/tmp/mm.bin bs=1M count=8 status=none
   python3 - <<'PY'
   import mmap, os, time
   f = open('/tmp/mm.bin','r+b')
   m = mmap.mmap(f.fileno(), 0)
   print('mapped', len(m), 'pid', os.getpid())
   time.sleep(30)  # inspect /proc/<pid>/smaps in another shell
   m.close(); f.close()
   PY
   ```
2. In another terminal, while it sleeps:
   ```bash
   # replace PID
   grep -A2 mm.bin /proc/<PID>/smaps | head
   ```
3. Touch pages (add `m[0]=1` before sleep in a second run) and compare Rss.

**Expect:** a VMA for `/tmp/mm.bin`; RSS grows after you dirty/read pages.

</div>

## Keep reading

- [Virtual memory walkthrough](/linternals/blog/virtual-memory-walkthrough/)
- [Page tables and the TLB](/linternals/blog/page-tables-and-tlb/)
- [userfaultfd and remote faults](/linternals/blog/userfaultfd-and-remote-faults/)
- [Page cache and writeback](/linternals/blog/page-cache-and-writeback/)
- [ELF loading and dynamic linking](/linternals/blog/elf-loading-and-dynamic-linking/)
