/** Prefix a path with Astro's BASE_URL (needed for GitHub project Pages). */
export function withBase(path = ''): string {
	const base = import.meta.env.BASE_URL;
	if (!path || path === '/') return base;
	const clean = path.replace(/^\//, '');
	return `${base}${clean}`.replace(/\/{2,}/g, '/').replace(':/', '://');
}
