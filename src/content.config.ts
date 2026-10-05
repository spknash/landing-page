import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string().optional(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      /**
       * Set by `scripts/sync-substack.mjs` on mirrored posts. Its presence marks
       * a post as owned by the sync, and drives the "discuss on Substack" CTA.
       */
      substackUrl: z.string().optional(),
      /** Comment count at last sync; only used to colour the CTA copy. */
      substackComments: z.number().int().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

/** Weekly newsletter issues, surfaced at `/newsletters/[slug]`. */
export const NEWSLETTER_PATH = "src/content/newsletters";

const newsletters = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${NEWSLETTER_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      issue: z.number().int().positive(),
      pubDatetime: z.date(),
      description: z.string().optional(),
      author: z.string().default(config.site.author),
      /** Headline image shown above the title, on the index, and in link previews. */
      heroImage: image(),
      heroAlt: z.string().default(""),
      /** Optional photo credit shown under the headline image. */
      heroCredit: z.string().optional(),
      heroCreditUrl: z.string().url().optional(),
      draft: z.boolean().optional(),
    }),
});

export const collections = { posts, pages, newsletters };
