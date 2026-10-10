---
title: 'VFS and the open path'
description: 'How openat walks dentries, inodes, and file objects before a filesystem driver runs.'
pubDate: 2026-04-05
topic: filesystem
difficulty: intermediate
tags: ['vfs', 'dentry', 'inode', 'open']
---

The Virtual File System is the kernel’s common front door. Whether the file lives on ext4, XFS, or procfs, userspace usually hits the same VFS objects first.

## Objects you meet

```mermaid
flowchart LR
  Path[pathname] --> Dentry[dentry cache]
  Dentry --> Inode[inode]
  Inode --> File[struct file]
  File --> Fops[file_operations]
```

- **dentry** — cached path component → inode mapping
- **inode** — metadata and the object the FS understands
- **struct file** — per-open state (offset, flags, fops)

## Sketch of open

```mermaid
sequenceDiagram
  participant App
  participant VFS
  participant FS as Filesystem
  App->>VFS: openat(path)
  VFS->>VFS: path walk / lookup
  VFS->>FS: inode + permission checks
  FS-->>VFS: ready
  VFS-->>App: fd
```

## Source landmarks

| Piece | Look here |
| --- | --- |
| Path walk | `fs/namei.c` |
| open family | `fs/open.c` |
| VFS types | `include/linux/fs.h` |

## Try this

```bash
# Which filesystem backs a path?
findmnt -T .
stat /
```

## Keep reading

- [kernel.org — VFS](https://docs.kernel.org/filesystems/vfs.html)
- Next: [Sockets and the networking stack](/linternals/blog/sockets-and-the-networking-stack/)
