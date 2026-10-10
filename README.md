# Linternals

Personal static site for learning **Linux internals** — kernel paths, Mermaid diagrams, and open notes — built with [Astro](https://astro.build) and ready for free [GitHub Pages](https://pages.github.com/) hosting.

**Live (after you enable Pages):** https://euphoricmangat.github.io/linternals/

## Quick start

```bash
cd linternals
npm install
npm run dev
```

Open http://localhost:4321/linternals/

## Write a note

1. Add `src/content/blog/my-topic.md`
2. Frontmatter:

```yaml
---
title: 'My topic'
description: 'One-line summary'
pubDate: 2026-04-01
topic: kernel   # boot | process | memory | filesystem | networking | kernel | syscalls | tools
difficulty: intro  # intro | intermediate | deep
tags: ['mm', 'faults']
---
```

3. Use Mermaid in the body:

````markdown
```mermaid
flowchart LR
  A[Userspace] --> B[Kernel]
```
````

## Deploy to GitHub Pages (free)

1. Repo: [euphoricmangat/linternals](https://github.com/euphoricmangat/linternals) (already configured in `astro.config.mjs` / `src/consts.ts`).
2. Push this project to `main`.
3. In the repo: **Settings → Pages → Source → GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push.

### User site instead of project site

If the repo is `username.github.io`, set in `astro.config.mjs`:

```js
site: 'https://username.github.io',
base: '/',
```

## Scripts

| Command           | Action                          |
| ----------------- | ------------------------------- |
| `npm run dev`     | Local dev server                |
| `npm run build`   | Production build → `dist/`      |
| `npm run preview` | Preview the production build    |

## License

Content and site code: use freely for your own learning notes. Kernel trademarks and penguin mascot belong to their respective owners — this project does not bundle the Tux artwork.
