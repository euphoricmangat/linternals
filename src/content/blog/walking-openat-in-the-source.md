---
title: 'Source walk: openat'
description: 'A guided pass through do_sys_openat2 — from syscall entry to VFS path walk.'
pubDate: 2026-06-21
updatedDate: 2026-10-23
topic: filesystem
difficulty: deep
tags: ['openat', 'source-walk', 'namei', 'SYSCALL_DEFINE']
---

This note is a **reading script**, not a full annotated listing. Open a kernel tree and follow the stops in order. Current kernels call the middle function `do_file_open`. Older trees call it `do_filp_open`.

## Why openat

`openat` is common in `strace` output and ties syscalls → VFS → filesystems together.

```mermaid
flowchart TD
  SC[SYSCALL_DEFINE openat / openat2] --> Do[do_sys_openat2]
  Do --> Build[build open_flags]
  Build --> Filp[do_file_open]
  Filp --> Path[path_openat / namei]
  Path --> Done[fd_install]
```

## Stops (≈45–60 minutes)

### 1. Find the syscall entry

Search for `SYSCALL_DEFINE` + `openat` (or `openat2`). Note arguments: `dfd`, `filename`, `flags`, `mode`.

**Ask:** which flags are validated early vs later?

### 2. Land in `do_sys_openat2`

Usually in `fs/open.c`. Skim:

- how `struct open_flags` is filled
- get unused fd / error paths
- call into `do_file_open` (not `do_filp_open`; that name is gone here)

### 3. Path walk (`fs/namei.c`)

Follow into path lookup / `path_openat` territory:

- `LOOKUP_*` flags
- symlink handling (at a high level)
- final `vfs` permission checks

```mermaid
sequenceDiagram
  participant S as sys_openat
  participant O as do_sys_openat2
  participant N as namei / path_openat
  participant I as inode / FOPS
  S->>O: args
  O->>N: pathname + flags
  N->>I: lookup + may_open
  I-->>O: struct file
  O-->>S: fd
```

### 4. Return path

Back in `do_sys_openat2`, `FD_ADD` publishes the `struct file` into the fd table and returns the number. If `do_file_open` failed, nothing is installed.

## Lab — Trace then grep

<div class="lab">

### Lab — From strace to symbol

1. Capture one open:
   ```bash
   strace -e openat ls /etc/hosts 2>&1 | head
   ```
2. In a kernel tree, search `do_sys_openat2`, then `do_file_open` (or `do_filp_open` on an older tree).
3. Write five bullets: entry file, three callees, one error path you noticed.

</div>

## Keep reading

- [Syscalls: crossing the boundary](/linternals/blog/syscalls-crossing-the-boundary/)
- [VFS and the open path](/linternals/blog/vfs-and-the-open-path/)
- [Reading kernel source](/linternals/blog/reading-kernel-source/)
