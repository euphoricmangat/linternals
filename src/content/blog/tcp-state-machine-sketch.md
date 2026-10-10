---
title: 'TCP state machine sketch'
description: 'How Linux tracks a TCP connection — states, sk_buff queues, and where to look in the source.'
pubDate: 2026-09-05
topic: networking
difficulty: intermediate
tags: ['tcp', 'socket', 'sk_buff', 'net']
---

TCP is a **state machine** wrapped around reliable byte streams. The kernel keeps that machine in `struct sock` / `tcp_sock` and moves segments through `sk_buff` queues.

## High-level states

```mermaid
stateDiagram-v2
  [*] --> CLOSED
  CLOSED --> SYN_SENT: connect
  CLOSED --> LISTEN: listen
  LISTEN --> SYN_RECV: SYN
  SYN_SENT --> ESTABLISHED: SYN+ACK / ACK
  SYN_RECV --> ESTABLISHED: ACK
  ESTABLISHED --> FIN_WAIT_1: close
  ESTABLISHED --> CLOSE_WAIT: peer FIN
  FIN_WAIT_1 --> FIN_WAIT_2: ACK
  FIN_WAIT_1 --> CLOSING: FIN
  FIN_WAIT_2 --> TIME_WAIT: FIN
  CLOSE_WAIT --> LAST_ACK: close
  LAST_ACK --> CLOSED: ACK
  TIME_WAIT --> CLOSED: timeout
```

## Data path (established)

```mermaid
sequenceDiagram
  participant App
  participant TCP as tcp_sendmsg / tcp_recvmsg
  participant Q as write / receive queues
  participant IP as IP + NIC
  App->>TCP: sendmsg
  TCP->>Q: enqueue sk_buff
  Q->>IP: xmit when window allows
  IP-->>Q: RX sk_buff
  Q-->>TCP: deliver to socket
  TCP-->>App: recvmsg
```

## Mental model

| Idea | Kernel reality |
| --- | --- |
| Connection | `struct sock` + TCP-specific fields |
| Segment | `sk_buff` on write/read/retransmit queues |
| Congestion / RTT | algorithms under `net/ipv4/` (and friends) |
| Observability | `ss -ti`, `/proc/net/tcp`, BPF |

You do not need every RFC edge case on day one. Learn **who owns the queues** and **which function names show up in traces**.

## Source landmarks

| Piece | Where |
| --- | --- |
| Core TCP | `net/ipv4/tcp*.c` |
| Output | `tcp_output.c` |
| Input | `tcp_input.c` |
| Docs | `Documentation/networking/` |

## Lab — Watch states

<div class="lab">

### Lab — `ss` state column

```bash
# Listening and established TCP
ss -tan | head -25
# Extra TCP info (cwnd, rtt, …) when supported
ss -ti sport = :22 | head -20
```

**Expect:** `LISTEN`, `ESTAB`, maybe `TIME-WAIT`. Extra lines show congestion / RTT fields when available.

</div>

## Keep reading

- [Sockets and the networking stack](/linternals/blog/sockets-and-the-networking-stack/)
- [AF_UNIX sockets](/linternals/blog/af-unix-sockets/)
- [Interrupts, softirqs, and tasklets](/linternals/blog/interrupts-softirqs-and-tasklets/)
---
