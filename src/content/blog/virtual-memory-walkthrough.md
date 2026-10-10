---
title: 'Virtual memory walkthrough'
description: 'Pages, page tables, and faults — how a process address space is wired to physical RAM.'
pubDate: 2026-03-22
topic: memory
difficulty: intermediate
tags: ['mm', 'page-tables', 'faults', 'mmap']
---

Every userspace pointer is **virtual**. The MMU and the kernel’s memory manager translate it to physical frames — or decide the access should fault.

## Layers

```mermaid
flowchart TD
  VA[Virtual address] --> PT[Page tables]
  PT -->|hit| PA[Physical frame]
  PT -->|miss / invalid| PF[Page fault handler]
  PF -->|allocate / map / SIGSEGV| VA
```

## Address space pieces

A process `mm_struct` tracks regions (`vm_area_struct` / VMAs): text, heap, stacks, `mmap` mappings, and so on.

```mermaid
flowchart LR
  subgraph AS[Process address space]
    T[text / rodata]
    H[heap]
    M[mmap regions]
    S[stack]
  end
  AS --> MM[mm_struct]
  MM --> PG[page tables]
```

## Page fault = opportunity

Faults are not only crashes. They implement:

- **demand paging** — load a page on first touch
- **copy-on-write** after `fork`
- **file-backed mmap** — bring file pages into RAM
- **stack growth** (within limits)

```mermaid
flowchart TD
  Touch[CPU touches page] --> Walk[Walk page tables]
  Walk -->|present| Done[Access succeeds]
  Walk -->|not present| Fault[do_page_fault]
  Fault --> Decide{Why missing?}
  Decide -->|anon / demand| Alloc[Allocate frame]
  Decide -->|file mmap| Read[Read from file]
  Decide -->|COW| Copy[Copy page]
  Decide -->|bad access| Kill[SIGSEGV]
  Alloc --> Map[Install PTE]
  Read --> Map
  Copy --> Map
  Map --> Done
```

## Inspect your own map

```bash
# VMAs for the current shell
cat /proc/$$/maps | head

# Deeper: smaps has RSS / PSS per region
head -n 40 /proc/$$/smaps
```

<div class="lab">

### Lab — Read your own address space

**Goal:** Recognize text, heap, stack, and library mappings.

1. List maps for the current shell:
   ```bash
   cat /proc/$$/maps | head -30
   ```
2. Find the stack and libc (names vary by distro):
   ```bash
   grep -E '\[stack\]|libc' /proc/$$/maps | head
   ```
3. Compare RSS for a region via smaps:
   ```bash
   awk '/^[[:xdigit:]]/{p=$0} /Rss:/{print p,$0}' /proc/$$/smaps | head -15
   ```
**Expect:** executable mappings with `r-xp`, a `[stack]` line, and nonzero RSS on hot regions.

</div>

## Source landmarks

- `mm/memory.c` — fault handling core
- `mm/mmap.c` — creating and merging VMAs
- `include/linux/mm_types.h` — `mm_struct`, page types

## Keep reading

- [Page cache and writeback](/linternals/blog/page-cache-and-writeback/)
- [kernel.org — Memory Management](https://docs.kernel.org/mm/index.html)
