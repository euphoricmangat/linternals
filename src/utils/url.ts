/** Prefix a path with Astro's BASE_URL (needed for GitHub project Pages). */
export function withBase(path = ''): string {
	const rawBase = import.meta.env.BASE_URL || '/';
	const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

	if (!path || path === '/') return base;

	const clean = path.replace(/^\/+/, '').replace(/\/+$/, '');
	// Page routes get a trailing slash (trailingSlash: 'always')
	const isAsset = /\.[a-z0-9]+$/i.test(clean);
	return isAsset ? `${base}${clean}` : `${base}${clean}/`;
}
