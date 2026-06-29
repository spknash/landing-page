# Project Overview

> Living source of truth for the company landing page. Keep this current as the project evolves (see `.cursor/rules/maintain-overview.mdc`). This file records **what exists and why**; the rules in `.cursor/rules/` enforce **how** to build.

## What this is

A small, **thesis-first** umbrella site for the company — separate from any single product, built to survive product pivots. It does exactly three things:

1. **States the mission / thesis** — what we believe and the bet we're making now.
2. **Houses our writings** — an ownable home for long-form pieces (currently scattered across X and Substack).
3. **Points to the current product** — an outlink to whatever we're actively shipping (today: **Fluxx**, https://fluxx.sh; **Linus** next).

Deliberately minimal and artistic, not a generic SaaS landing page. The aesthetic is the differentiator.

**Non-goals:** pricing, feature grids, product screenshots, lead-capture funnels, dashboards.

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 6 (AstroPaper v6 base) |
| Theme engine | AstroPaper (`satnaing/astro-paper`) — used as engine, not look |
| Styling | Tailwind CSS 4 + custom token layer |
| Fonts | Self-hosted via Fontsource (Cormorant Garamond, Literata, JetBrains Mono) |
| Content | Markdown / MDX via Astro content collections |
| Search | Pagefind (bundled) |
| Deploy | Vercel — **sahilandsuhaas.com** |

AstroPaper provides routing, content collections, search, RSS, and sitemap. Its default visual layer has been stripped and replaced with our own art direction.

### Commands

- `npm run dev` — local dev server.
- `npm run build` — `astro check` + build + Pagefind index. (Set `ASTRO_TELEMETRY_DISABLED=1` in restricted sandboxes.)

## Routes & structure

```
/                 Home — hero, latest-writings teaser
/mission          Mission / thesis (copy from `site.mission` in config)
/hero-preview     Stack of hero painting candidates (dev/evaluation)
/writings         Index of all writings
/writings/[slug]  Individual post
```

- Nav: **Mission** + **Writings** + **Get Fluxx** (→ https://fluxx.sh).

- Posts: `src/content/posts/` (collection still named `posts` internally; public URLs are `/writings/...`).
- Post URL generation: `src/utils/getPostPaths.ts`.
- Site / social / feature config: `astro-paper.config.ts`.
- Fonts: `fonts` array in `astro.config.ts`.
- Design tokens: `src/styles/theme.css`. Global utilities: `src/styles/global.css`. Prose: `src/styles/typography.css`.
- Layouts: `src/layouts/`. Reusable components: `src/components/`.

## Design direction (summary)

Quiet, nostalgic, painterly — see `.cursor/rules/design.mdc` for the enforced version.

- **Hero:** one full-bleed public-domain painting with only the **centered company name** over it. The home hero **rotates daily** through `heroRotationSlugs` in `src/data/hero-candidates.ts` (site timezone). Override with `?hero=slug` or compare all at `/hero-preview`.
- **Header:** a centered **liquid-glass pill** (near-transparent fill + heavy blur) with Writings + a **Get Fluxx** CTA (bark/forest accent).
- **Hero → content:** a **brush-stroke dissolve** at the bottom of the painting — strokes sampled from the hero image blend into the page background (no hard edge or decorative divider).
- **Home links:** removed; mission is in the nav pill only.
- **Theme:** light only for now (cream background, dark ink text). Dark palette remains in CSS if we re-enable it later.
- **Grain:** ever-present fine canvas/paper grain overlay across the whole site.
- **Palette:** forest green / brown / blue, cooled off-white (`#E8EAE0`, not warm cream).
- **Type:** Cormorant Garamond (display) · Literata (body) · mono (utility).
- **Motion:** none for now (the load/scroll reveals were removed to keep the scaffold minimal).

## Content model

- **Canonical = this site.** Distribution = Substack (cross-post with a `canonicalURL` back here).
- Preserve original publish dates when porting. See `.cursor/rules/content.mdc`.

## Decisions

- **Astro over Next.js** — content + marketing site, not an app; ships ~zero JS, content is first-class, RSS/sitemap/image optimization built in.
- **AstroPaper as engine, not look** — keep the content/routing/search/RSS machinery; restyle everything visible.
- **Canonical-here content model** — own the URL/SEO; Substack is distribution only.
- **`/writings` route** — AstroPaper's `posts` collection is surfaced at `/writings` (collection name kept internally to minimize churn).
- **Self-hosted fonts (Fontsource)** — instead of Astro's Google font provider, so the build works without network and avoids render-blocking `<link>`s.
- **Static OG image** — disabled AstroPaper's satori/dynamic OG (off-brand template, depended on the removed Google font config). `public/default-og.jpg` is generated from the hero painting. A bespoke per-post OG is a future option.
- **Vite pinned to 7** — `overrides.vite: ^7` in `package.json`; npm otherwise pulls Vite 8, which Astro 6 doesn't support.
- **Trimmed nav + features** — archives/tags removed from nav; share links trimmed to X + email, to keep the surface tiny.
- **Minimal home + chrome** — hero is only the centered company name; thesis lives on `/mission`; header is a centered liquid-glass pill (Writings + Get Fluxx only); search icon, theme toggle, and mobile hamburger removed; load/scroll animations removed.

## Current status

Build milestones (from the brief):

- [x] Scaffold AstroPaper into the repo, deps installed
- [x] Cursor rules (`design`, `project`, `content`, `maintain-overview`) + this overview
- [x] Config: site metadata, social links (X ×2, Substack), `/writings` route, RSS
- [x] Token layer: palette, self-hosted fonts, grain overlay
- [x] Strip AstroPaper default styling, apply art direction
- [x] Home page: hero + latest-writings teaser (Mission + Get Fluxx in nav)
- [x] Mission page (`/mission`)
- [x] Writings: index + post reading layout
- [x] About page removed; product outlink lives in nav as **Get Fluxx**
- [x] Replace placeholder company name (`companyName` in `astro-paper.config.ts`)
- [x] Port first three Substack writings (Fluxx, Software Factories, Soft Pivot)
- [ ] Final polish + quality floor (§9: Lighthouse, reduced-motion audit), deploy to Vercel

Hero candidates in `src/data/hero-candidates.ts`. Default/fallback: **Childe Hassam, _Poppies, Isles of Shoals_ (1891)**. Home rotates daily across all four bundled paintings (timezone: `site.timezone` in config).

## Open questions / placeholders

- Company name: `site.companyName` in `astro-paper.config.ts` (currently **Fluxx**).
- Production domain: **sahilandsuhaas.com** (`site.url` in `astro-paper.config.ts`).
