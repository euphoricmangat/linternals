---
title: 'Sockets and the networking stack'
description: 'From socket() to sk_buff — how packets climb the TCP/IP stack inside Linux.'
pubDate: 2026-04-12
topic: networking
difficulty: intermediate
tags: ['socket', 'tcp', 'skb', 'net']
---

Networking in Linux is layered: sockets for apps, protocols in `net/`, and drivers that push frames to hardware.

## Layers

```mermaid
flowchart TD
  App[Userspace socket API] --> Sock[struct socket / sock]
  Sock --> Proto[TCP / UDP / ...]
  Proto --> IP[IPv4 / IPv6]
  IP --> Netdev[netdev + NAPI]
  Netdev --> NIC[Driver / NIC]
```

## Packet carrier: sk_buff

Almost every packet is an `sk_buff` (skb): headers, payload references, and metadata that travel up and down the stack.

```mermaid
flowchart LR
  RX[NIC RX] --> Softirq[NET_RX softirq]
  Softirq --> IP
  IP --> TCP[TCP input]
  TCP --> SockRecv[Socket receive queue]
  SockRecv --> Read[read / recvmsg]
```

## Source landmarks

- `net/socket.c` — syscall side
- `net/ipv4/` — IPv4 / TCP
- `include/linux/skbuff.h` — skb

## Keep reading

- [AF_UNIX sockets](/linternals/blog/af-unix-sockets/)
- [TCP state machine sketch](/linternals/blog/tcp-state-machine-sketch/)
- [NAPI and softnet](/linternals/blog/napi-and-softnet/)
- [epoll and event loops](/linternals/blog/epoll-and-event-loops/)
- [kernel.org — networking docs](https://docs.kernel.org/networking/)
- Related: [Syscalls: crossing the boundary](/linternals/blog/syscalls-crossing-the-boundary/)
