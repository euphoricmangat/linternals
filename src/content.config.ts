import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).default([]),
			topic: z
				.enum([
					'boot',
					'process',
					'memory',
					'filesystem',
					'networking',
					'kernel',
					'syscalls',
					'tools',
					'interrupts',
					'sync',
					'containers',
					'drivers',
					'elf',
					'security',
				])
				.optional(),
			difficulty: z.enum(['intro', 'intermediate', 'deep']).default('intro'),
		}),
});

export const collections = { blog };
