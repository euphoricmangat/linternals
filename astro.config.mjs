// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// GitHub Pages: for a project site at https://<user>.github.io/linternals/
// set site + base as below. For a user site (username.github.io repo), use base: '/'.
const GITHUB_USER = 'euphoricmangat';
const REPO_NAME = 'linternals';

// https://astro.build/config
export default defineConfig({
	site: `https://${GITHUB_USER}.github.io`,
	base: `/${REPO_NAME}`,
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			theme: 'github-light',
			wrap: true,
		},
	},
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'IBM Plex Sans',
			cssVariable: '--font-sans',
			weights: [400, 500, 600, 700],
			styles: ['normal'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'IBM Plex Mono',
			cssVariable: '--font-mono',
			weights: [400, 500, 600],
			styles: ['normal'],
			fallbacks: ['ui-monospace', 'monospace'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Source Serif 4',
			cssVariable: '--font-display',
			weights: [600, 700],
			styles: ['normal'],
			fallbacks: ['Georgia', 'serif'],
		},
	],
});
