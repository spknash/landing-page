# Project Overview

> Living source of truth for the company landing page. Keep this current as the project evolves (see `.cursor/rules/maintain-overview.mdc`). This file records **what exists and why**; the rules in `.cursor/rules/` enforce **how** to build.

## What this is

A small, **thesis-first** umbrella site for the company — separate from any single product, built to survive product pivots. It does exactly three things:

1. **States the mission / thesis** — what we believe and the bet we're making now.
2. **Houses our writings** — an ownable home for long-form pieces (currently scattered across X and Substack).
3. **Hosts our weekly newsletter** — a fun, creative issue each week on what we've been up to (startup work and everything else).

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
/newsletters      Index of newsletter issues (newest first)
/newsletters/[slug] Individual newsletter issue
```

- Nav: **Mission** + **Writings** + **Newsletters**. No product outlink.
- Newsletter issues: `src/content/newsletters/` (copy `_template.md`; `issue` number orders the index).

- Posts: `src/content/posts/` (collection still named `posts` internally; public URLs are `/writings/...`).
- Post URL generation: `src/utils/getPostPaths.ts`.
- Site / social / feature config: `astro-paper.config.ts`.
- Fonts: `fonts` array in `astro.config.ts`.
- Design tokens: `src/styles/theme.css`. Global utilities: `src/styles/global.css`. Prose: `src/styles/typography.css`.
- Layouts: `src/layouts/`. Reusable components: `src/components/`.

## Design direction (summary)

Quiet, nostalgic, painterly — see `.cursor/rules/design.mdc` for the enforced version.

- **Hero:** one full-bleed public-domain painting with only the **centered company name** over it. Currently **pinned** to Leutze's _Washington Crossing the Delaware_ via `pinnedHeroSlug` in `src/data/hero-candidates.ts`. Set that back to `null` to resume the daily rotation through `heroRotationSlugs` (site timezone). Override with `?hero=slug` or compare all at `/hero-preview`.
- **Header:** a centered **liquid-glass pill** (near-transparent fill + heavy blur) with Mission, Writings and Newsletters.
- **Hero → content:** a **plain vertical fade** into the mat (`.hero-fade` in `global.css`), sized as a share of the hero rather than in `vh`. Two painterly attempts were tried and rejected: layered scalloped SVG strokes (read as a cheap "wave divider") and a `feTurbulence`-displaced dry-brush edge (still an uneven line). **Any treatment with a visible irregular edge is off the table** — the even gradient is the decision.
- **Home links:** removed; mission is in the nav pill only.
- **Newsletters:** a plain blog post that reads like a letter. Warm paper ground (`#F7F4EE`, swapped in via `html:has(.newsletter-page)`), Newsreader for everything, italic subheads, full-width images, no ornament. Each issue has a single author. Chosen 2026-10-05 over busier scrapbook/tabloid/retro and structured journal/soft-color directions; the ask was "calm, mostly text with images, like a normal blog".
- **Theme:** light only for now (cream background, dark ink text). Dark palette remains in CSS if we re-enable it later.
- **Grain:** ever-present fine canvas/paper grain overlay across the whole site.
- **Palette:** forest green / brown / blue, cooled off-white (`#E8EAE0`, not warm cream).
- **Type:** Cormorant Garamond (display) · Literata (body) · mono (utility).
- **Motion:** none for now (the load/scroll reveals were removed to keep the scaffold minimal).

## Content model

- **Write on Substack; this site mirrors it.** Both publications are pulled into `src/content/posts/` as full-text markdown:
  - Suhaas — `suhaaspk.substack.com`
  - Sahil — `sahilmahendrakar.substack.com`
- `npm run sync:substack` (`scripts/sync-substack.mjs`) fetches both RSS feeds, converts the post HTML to markdown, archives images into `src/assets/writings/<slug>/`, rewrites cross-post links to local `/writings/` URLs, records the comment count, and prettier-formats its output. `--dry-run` previews.
- Sources, skipped slugs, and per-slug frontmatter overrides: `scripts/substack-sources.mjs`.
- `.github/workflows/sync-substack.yml` runs the sync daily at 09:20 UTC, builds to verify, and commits any change (which Vercel then deploys).
- A post carrying `substackUrl` is **owned by the sync** — hand edits are overwritten on the next run. Edit on Substack instead.
- **Comments live on Substack.** It has no embeddable comments widget, so `SubstackDiscuss.astro` deep-links to `{substackUrl}/comments` at the end of each mirrored post.
- **No canonical tags** pointing either way; search engines pick between the mirror and Substack.
- Posts carry an `author` (`Suhaas` / `Sahil`), shown as a byline on `/writings` cards and post pages.
- Preserve original publish dates when porting. See `.cursor/rules/content.mdc`.

## Decisions

- **Astro over Next.js** — content + marketing site, not an app; ships ~zero JS, content is first-class, RSS/sitemap/image optimization built in.
- **AstroPaper as engine, not look** — keep the content/routing/search/RSS machinery; restyle everything visible.
- **Substack-first, mirrored here** — replaces the original canonical-here model. Writing and commenting stay where the subscribers are; the site keeps a full-text mirror so we own the reading experience and the archive. Files rather than a live fetch, so Pagefind can index the posts, the build never depends on Substack being up, and the writing has git history on our own domain. No canonical tags either way (decided 2026-07-30).
- **`/writings` route** — AstroPaper's `posts` collection is surfaced at `/writings` (collection name kept internally to minimize churn).
- **Self-hosted fonts (Fontsource)** — instead of Astro's Google font provider, so the build works without network and avoids render-blocking `<link>`s.
- **Static OG image** — disabled AstroPaper's satori/dynamic OG (off-brand template, depended on the removed Google font config). `public/default-og.jpg` is generated from the hero painting. A bespoke per-post OG is a future option.
- **Vite pinned to 7** — `overrides.vite: ^7` in `package.json`; npm otherwise pulls Vite 8, which Astro 6 doesn't support.
- **Trimmed nav + features** — archives/tags removed from nav; share links trimmed to X + email, to keep the surface tiny.
- **Minimal home + chrome** — hero is only the centered company name; thesis lives on `/mission`; header is a centered liquid-glass pill (Mission, Writings, Newsletters); search icon, theme toggle, and mobile hamburger removed; load/scroll animations removed.

## Current status

Build milestones (from the brief):

- [x] Scaffold AstroPaper into the repo, deps installed
- [x] Cursor rules (`design`, `project`, `content`, `maintain-overview`) + this overview
- [x] Config: site metadata, social links (X ×2, Substack), `/writings` route, RSS
- [x] Token layer: palette, self-hosted fonts, grain overlay
- [x] Strip AstroPaper default styling, apply art direction
- [x] Home page: hero + latest-writings teaser
- [x] Mission page (`/mission`)
- [x] Writings: index + post reading layout
- [x] About page removed
- [x] Jungle branding and outlink removed; site is now **Sahil & Suhaas**, home for the weekly newsletter (2026-10-05)
- [x] Newsletters collection + `/newsletters` index + letter-style issue page
- [x] Replace placeholder company name (`companyName` in `astro-paper.config.ts`)
- [x] Port first three Substack writings (Fluxx, Software Factories, Soft Pivot)
- [x] Mirror both Substacks (7 posts), daily sync workflow, Substack comment CTA
- [ ] Final polish + quality floor (§9: Lighthouse, reduced-motion audit), deploy to Vercel

Hero candidates in `src/data/hero-candidates.ts`. Home is **pinned** to **Emanuel Leutze, _Washington Crossing the Delaware_ (1851)** via `pinnedHeroSlug`; `defaultHeroSlug` (Hassam's _Poppies_) remains the fallback, and the daily rotation across all four bundled paintings resumes if the pin is cleared.

## Open questions / placeholders

- Production domain: **sahilandsuhaas.com** (`site.url` in `astro-paper.config.ts`).
- `public/default-og.jpg` was generated from the old Hassam hero, so link previews still show poppies and the old wordmark. Regenerate from the Leutze painting.
