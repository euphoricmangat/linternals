/** Suggested reading order for prev/next navigation (not publish date). */
export const CURRICULUM_ORDER = [
	'how-the-kernel-boots',
	'anatomy-of-a-linux-process',
	'signals-and-process-lifecycle',
	'syscalls-crossing-the-boundary',
	'virtual-memory-walkthrough',
	'page-cache-and-writeback',
	'block-layer-and-bio',
	'mmap-and-page-faults-deep',
	'memory-reclaim-and-oom',
	'scheduler-cfs-and-eevdf',
	'elf-loading-and-dynamic-linking',
	'vfs-and-the-open-path',
	'walking-openat-in-the-source',
	'sockets-and-the-networking-stack',
	'interrupts-softirqs-and-tasklets',
	'locks-spinlocks-mutexes-rcu',
	'futexes-userspace-to-kernel',
	'kernel-modules-and-device-model',
	'namespaces-and-cgroups',
	'procfs-and-observability',
	'bpf-and-tracing-intro',
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
