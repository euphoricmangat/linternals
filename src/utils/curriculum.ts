/** Suggested reading order for prev/next navigation (not publish date). */
export const CURRICULUM_ORDER = [
	'how-the-kernel-boots',
	'anatomy-of-a-linux-process',
	'signals-and-process-lifecycle',
	'syscalls-crossing-the-boundary',
	'vdso-and-vsyscall',
	'virtual-memory-walkthrough',
	'page-tables-and-tlb',
	'slab-allocator-and-kmalloc',
	'page-cache-and-writeback',
	'block-layer-and-bio',
	'mmap-and-page-faults-deep',
	'userfaultfd-and-remote-faults',
	'hugepages-and-thp',
	'memory-reclaim-and-oom',
	'scheduler-cfs-and-eevdf',
	'smp-and-cpu-affinity',
	'timers-and-timekeeping',
	'elf-loading-and-dynamic-linking',
	'vfs-and-the-open-path',
	'walking-openat-in-the-source',
	'ext4-on-disk-sketch',
	'overlayfs-sketch',
	'splice-and-sendfile',
	'fcntl-locks-and-leases',
	'epoll-and-event-loops',
	'io-uring-intro',
	'sockets-and-the-networking-stack',
	'af-unix-sockets',
	'tcp-state-machine-sketch',
	'napi-and-softnet',
	'netfilter-and-hooks-sketch',
	'interrupts-softirqs-and-tasklets',
	'workqueues-and-kthreads',
	'locks-spinlocks-mutexes-rcu',
	'rcu-grace-periods',
	'futexes-userspace-to-kernel',
	'kernel-modules-and-device-model',
	'dma-api-sketch',
	'namespaces-and-cgroups',
	'pid-namespaces-deep',
	'mount-namespaces-and-bind-mounts',
	'netns-and-veth',
	'time-namespaces',
	'cgroup-v2-controllers',
	'capabilities-and-lsm-intro',
	'seccomp-bpf-intro',
	'procfs-and-observability',
	'bpf-and-tracing-intro',
	'perf-events-intro',
	'kprobes-and-ftrace',
	'reading-an-oops',
	'reading-kernel-source',
] as const;

export type CurriculumId = (typeof CURRICULUM_ORDER)[number];

export function curriculumIndex(id: string): number {
	return CURRICULUM_ORDER.indexOf(id as CurriculumId);
}

export function sortByCurriculum<T extends { id: string; data: { pubDate: Date } }>(posts: T[]): T[] {
	return [...posts].sort((a, b) => {
		const ia = curriculumIndex(a.id);
		const ib = curriculumIndex(b.id);
		if (ia === -1 && ib === -1) return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
		if (ia === -1) return 1;
		if (ib === -1) return -1;
		return ia - ib;
	});
}
