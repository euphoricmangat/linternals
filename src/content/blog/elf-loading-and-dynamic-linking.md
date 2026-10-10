---
title: 'ELF loading and dynamic linking'
description: 'How execve maps an ELF, finds the interpreter, and lets ld.so wire shared libraries.'
pubDate: 2026-05-10
topic: elf
difficulty: intermediate
tags: ['elf', 'execve', 'ld.so', 'mmap']
---

Starting a program is mostly mapping bytes and fixing up symbols — kernel loads the ELF; userspace dynamic linker finishes the job.

## Flow

```mermaid
sequenceDiagram
  participant Shell
  participant Kernel
  participant Ld as ld.so
  participant App as main()
  Shell->>Kernel: execve(binary)
  Kernel->>Kernel: load ELF + PT_INTERP
  Kernel->>Ld: start interpreter
  Ld->>Ld: map libs, relocate
  Ld->>App: jump to entry
```

## Useful commands

```bash
file $(which ls)
readelf -l $(which ls) | head
ldd $(which ls)
```

## Keep reading

- `fs/binfmt_elf.c` in the kernel tree
- Related: [Virtual memory walkthrough](/linternals/blog/virtual-memory-walkthrough/)
