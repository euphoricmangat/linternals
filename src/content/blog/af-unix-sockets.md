---
title: 'AF_UNIX sockets'
description: 'Local IPC over the socket API — stream, datagram, and abstract namespace paths.'
pubDate: 2026-08-02
topic: networking
difficulty: intermediate
tags: ['unix', 'socket', 'ipc', 'af_unix']
---

Not every socket goes to the network. **`AF_UNIX`** (aka local / Unix domain) connects processes on the same machine with the familiar socket API and lower overhead than TCP loopback.

## Flavors

```mermaid
mindmap
  root((AF_UNIX))
    SOCK_STREAM
      connection
      byte stream
    SOCK_DGRAM
      datagrams
      no connect required
    SOCK_SEQPACKET
      sequenced records
```

## Connect path (stream)

```mermaid
sequenceDiagram
  participant S as Server
  participant K as Kernel
  participant C as Client
  S->>K: socket + bind path + listen
  C->>K: socket + connect path
  K-->>S: accept returns connected fd
  C->>K: send / recv
  S->>K: send / recv
```

## Pathnames vs abstract

- **Filesystem path** — e.g. `/run/app.sock`; permissions matter; leftover files need cleanup.
- **Abstract** — name starts with a NUL byte; no inode; visible in `/proc/net/unix`.

## Source landmarks

| Piece | Where |
| --- | --- |
| Core | `net/unix/` |
| Man | `man 7 unix` |
| Related | pipes, `socketpair(2)` |

## Lab — See local sockets

<div class="lab">

### Lab — List AF_UNIX endpoints

```bash
# Who is listening locally?
ss -xln | head -20
# Or classic:
cat /proc/net/unix | head -15
```

**Expect:** paths under `/run` or `@abstract` names, with inode / ref columns.

</div>

## Keep reading

- [Sockets and the networking stack](/linternals/blog/sockets-and-the-networking-stack/)
- [Syscalls: crossing the boundary](/linternals/blog/syscalls-crossing-the-boundary/)
- [man 7 unix](https://man7.org/linux/man-pages/man7/unix.7.html)
