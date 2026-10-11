---
title: 'Kernel modules and the device model'
description: 'Loadable modules, sysfs, and how devices bind to drivers.'
pubDate: 2026-05-17
topic: drivers
difficulty: intro
tags: ['module', 'sysfs', 'driver', 'platform']
---

Most driver code can live in a **module**: loaded after boot, bound through the driver model, visible under `/sys`.

## Bind path

```mermaid
flowchart TD
  Bus[Bus / firmware] --> Dev[struct device]
  Mod[module_init] --> Drv[struct device_driver]
  Dev --> Match[bus match]
  Drv --> Match
  Match --> Probe[probe]
  Probe --> Sysfs[/sys entries]
```

## Try on a machine

```bash
lsmod | head
modinfo ext4 | head
ls /sys/bus
```

## Keep reading

- [DMA API sketch](/linternals/blog/dma-api-sketch/)
- [kernel.org — driver model](https://docs.kernel.org/driver-api/driver-model/)
- Related: [Reading kernel source](/linternals/blog/reading-kernel-source/)
