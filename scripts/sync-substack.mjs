/**
 * Mirrors every Substack post from `substack-sources.mjs` into
 * `src/content/posts/*.md`, downloading images into `src/assets/writings/`.
 *
 *   node scripts/sync-substack.mjs [--dry-run]
 *
 * Substack is the source of truth for mirrored posts: a re-run overwrites the
 * markdown it manages, so edits belong upstream on Substack, not here. Files
 * without a `substackUrl` in their frontmatter are never touched.
 */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";
import TurndownService from "turndown";
import * as prettier from "prettier";
import {
  SUBSTACK_SOURCES,
  SKIP_SLUGS,
  DEFAULT_TAGS,
  OVERRIDES,
} from "./substack-sources.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = path.join(ROOT, "src/content/posts");
const IMAGES_DIR = path.join(ROOT, "src/assets/writings");
/** Relative prefix from a file in POSTS_DIR to IMAGES_DIR, for markdown srcs. */
const IMAGE_HREF_PREFIX = "../../assets/writings";

const DRY_RUN = process.argv.includes("--dry-run");

/* -------------------------------------------------------------------------- */
/* Feed                                                                       */
/* -------------------------------------------------------------------------- */

async function fetchFeed(source) {
  const url = `${source.publication}/feed`;
  const response = await fetch(url, {
    headers: { "user-agent": "sahilandsuhaas.com mirror" },
  });
  if (!response.ok) {
    throw new Error(`${url} responded ${response.status}`);
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    cdataPropName: "__cdata",
    // Substack wraps most text in CDATA; merge it back into a plain string.
    tagValueProcessor: (_name, value) => value,
  });
  const feed = parser.parse(await response.text());
  const items = feed?.rss?.channel?.item ?? [];
  return Array.isArray(items) ? items : [items];
}

/** fast-xml-parser hands back either a string or `{ __cdata }`. */
function text(node) {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (typeof node.__cdata === "string") return node.__cdata;
  if (typeof node["#text"] === "string") return node["#text"];
  return "";
}

function slugFromLink(link) {
  return link.split("/p/")[1]?.replace(/\/+$/, "").split(/[?#]/)[0] ?? "";
}

/**
 * Comment count for the "discuss on Substack" CTA. Baked into frontmatter so
 * the site build itself never depends on Substack being reachable; it goes
 * stale between syncs, which is why the CTA never renders a bare number.
 */
async function fetchCommentCount(publication, slug) {
  try {
    const response = await fetch(`${publication}/api/v1/posts/${slug}`, {
      headers: { "user-agent": "sahilandsuhaas.com mirror" },
    });
    if (!response.ok) return undefined;
    const count = (await response.json())?.comment_count;
    return Number.isInteger(count) ? count : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Substack's `<description>` is the post subtitle, but it is often empty or a
 * lone emoji. Only keep it when it reads like a real sentence, otherwise let
 * `getPostPreview` derive one from the body.
 */
function usableSubtitle(raw) {
  const plain = decodeEntities(raw.replace(/<[^>]+>/g, "")).trim();
  if (plain.length < 20) return undefined;
  if (!/[a-z]/i.test(plain)) return undefined;
  return plain;
}

/* -------------------------------------------------------------------------- */
/* Images                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Substack serves images through a resizing proxy whose path ends in the
 * URL-encoded original, e.g.
 *   .../image/fetch/$s_!ab!,w_424,f_webp/https%3A%2F%2F...%2Ffoo.png
 * Recover that original so we archive full-resolution files, not CDN variants.
 */
function originalImageUrl(url) {
  const marker = url.lastIndexOf("/https%3A%2F%2F");
  if (marker === -1) return url;
  try {
    return decodeURIComponent(url.slice(marker + 1));
  } catch {
    return url;
  }
}

function collectImageUrls(html) {
  const urls = new Set();
  for (const [, url] of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    urls.add(originalImageUrl(decodeEntities(url)));
  }
  for (const [, url] of html.matchAll(
    /<a[^>]+class="[^"]*image-link[^"]*"[^>]+href="([^"]+)"/g
  )) {
    urls.add(originalImageUrl(decodeEntities(url)));
  }
  return [...urls].filter(url => /^https?:\/\//.test(url));
}

const EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"]);

async function downloadImages(slug, urls) {
  /** @type {Map<string, string>} original URL -> markdown-relative path */
  const map = new Map();
  if (urls.length === 0) return map;

  const dir = path.join(IMAGES_DIR, slug);
  if (!DRY_RUN) await mkdir(dir, { recursive: true });

  for (const [index, url] of urls.entries()) {
    const rawExt = path.extname(new URL(url).pathname).toLowerCase();
    const ext = EXTENSIONS.has(rawExt) ? rawExt : ".png";
    const name = `${index + 1}${ext}`;
    map.set(url, `${IMAGE_HREF_PREFIX}/${slug}/${name}`);

    const dest = path.join(dir, name);
    if (DRY_RUN || existsSync(dest)) continue;

    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`  ! image ${response.status}: ${url}`);
      map.delete(url);
      continue;
    }
    await writeFile(dest, Buffer.from(await response.arrayBuffer()));
    console.log(`  + image ${slug}/${name}`);
  }

  return map;
}

/* -------------------------------------------------------------------------- */
/* HTML -> Markdown                                                           */
/* -------------------------------------------------------------------------- */

function createTurndown(imageMap) {
  const turndown = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "_",
    strongDelimiter: "**",
  });

  // Substack injects subscribe forms, share buttons, paywall prompts and inline
  // SVG icons into the feed HTML. None of it belongs in the mirror.
  turndown.remove(["form", "button", "svg", "style", "script"]);
  turndown.addRule("substackWidgets", {
    filter: node =>
      /subscription-widget|button-wrapper|paywall|digest-post-embed|subscribe-widget|footerOnly/i.test(
        node.getAttribute?.("class") ?? ""
      ),
    replacement: () => "",
  });

  turndown.addRule("localImages", {
    filter: "img",
    replacement: (_content, node) => {
      const src = imageMap.get(originalImageUrl(node.getAttribute("src") ?? ""));
      if (!src) return "";
      const alt = (node.getAttribute("alt") ?? "").replace(/[[\]]/g, "");
      return `\n\n![${alt}](${src})\n\n`;
    },
  });

  // Keep the caption, drop the zoom-link wrapper Substack puts around figures.
  turndown.addRule("figure", {
    filter: "figure",
    replacement: (_content, node) => {
      const image = node.querySelector("img");
      const src = image
        ? imageMap.get(originalImageUrl(image.getAttribute("src") ?? ""))
        : undefined;
      const caption = (node.querySelector("figcaption")?.textContent ?? "").trim();
      if (!src) return caption ? `\n\n_${caption}_\n\n` : "";
      const alt = caption || (image.getAttribute("alt") ?? "");
      return `\n\n![${alt.replace(/[[\]]/g, "")}](${src})\n\n${
        caption ? `_${caption}_\n\n` : ""
      }`;
    },
  });

  // Substack wraps every `<li>` body in a `<p>`, which turndown would render as
  // a loose list padded to four columns. Tighten it back to `- item`.
  turndown.addRule("tightListItem", {
    filter: "li",
    replacement: (content, node, options) => {
      const body = content
        .replace(/^\n+/, "")
        .replace(/\n+$/, "")
        .replace(/\n{2,}/g, "\n")
        .replace(/\n/gm, "\n  ");
      const parent = node.parentNode;
      const marker =
        parent.nodeName === "OL"
          ? `${Array.prototype.indexOf.call(parent.children, node) + 1}. `
          : `${options.bulletListMarker} `;
      return `${marker}${body}${node.nextSibling ? "\n" : ""}`;
    },
  });

  return turndown;
}

/* -------------------------------------------------------------------------- */
/* Cross-post links                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Substack rewrites in-post links between our own essays to its own domain
 * (`/p/slug`, or an opaque `substack.com/home/post/p-<id>`). Point those at the
 * local copy so readers stay on the site.
 */
function createLinkRewriter(localBySubstackUrl) {
  const resolved = new Map();

  async function canonical(url) {
    if (!/^https:\/\/substack\.com\/home\/post\/p-\d+/.test(url)) return url;
    if (!resolved.has(url)) {
      try {
        const response = await fetch(url, { redirect: "follow" });
        resolved.set(url, response.url);
      } catch {
        resolved.set(url, url);
      }
    }
    return resolved.get(url);
  }

  return async function rewrite(markdown) {
    const matches = [...markdown.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)];
    let output = markdown;
    for (const [, url] of matches) {
      const target = localBySubstackUrl.get(
        (await canonical(url)).replace(/[?#].*$/, "").replace(/\/+$/, "")
      );
      if (target) output = output.split(`](${url})`).join(`](${target})`);
    }
    return output;
  };
}

function decodeEntities(value) {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };
  return value
    .replace(/&#(\d+);/g, (_m, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, code) =>
      String.fromCodePoint(parseInt(code, 16))
    )
    .replace(/&([a-z]+);/gi, (m, name) => named[name.toLowerCase()] ?? m);
}

function tidy(markdown) {
  return `${markdown
    .replace(/ /g, " ")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()}\n`;
}

/* -------------------------------------------------------------------------- */
/* Frontmatter                                                                */
/* -------------------------------------------------------------------------- */

const yamlString = value => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

function frontmatter({
  title,
  description,
  pubDatetime,
  author,
  substackUrl,
  substackComments,
}) {
  const lines = [
    `title: ${yamlString(title)}`,
    ...(description ? [`description: ${yamlString(description)}`] : []),
    `pubDatetime: ${pubDatetime.toISOString()}`,
    `author: ${yamlString(author)}`,
    `tags: [${DEFAULT_TAGS.map(yamlString).join(", ")}]`,
    `substackUrl: ${yamlString(substackUrl)}`,
    ...(substackComments === undefined
      ? []
      : [`substackComments: ${substackComments}`]),
    `draft: false`,
  ];
  return `---\n${lines.join("\n")}\n---\n\n`;
}

/** Files this script owns — i.e. ones carrying a `substackUrl`. */
async function findManagedPosts() {
  const managed = new Set();
  for (const name of await readdir(POSTS_DIR)) {
    if (!name.endsWith(".md") && !name.endsWith(".mdx")) continue;
    const contents = await readFile(path.join(POSTS_DIR, name), "utf8");
    if (/^substackUrl:/m.test(contents.split("---")[1] ?? "")) managed.add(name);
  }
  return managed;
}

/* -------------------------------------------------------------------------- */
/* Main                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  await mkdir(POSTS_DIR, { recursive: true });
  const previouslyManaged = await findManagedPosts();
  const written = new Set();
  let changed = 0;

  // Pass 1: gather every post first, so cross-post links can be resolved
  // against the full set rather than only the essays seen so far.
  const posts = [];
  for (const source of SUBSTACK_SOURCES) {
    const items = await fetchFeed(source);
    console.log(`\n${source.publication} — ${items.length} item(s)`);

    for (const item of items) {
      const link = text(item.link).trim();
      const slug = slugFromLink(link);
      if (!slug || SKIP_SLUGS.has(slug)) {
        console.log(`  · skip ${slug || link}`);
        continue;
      }
      posts.push({ item, slug, link, author: source.author, source });
    }
  }

  const rewriteLinks = createLinkRewriter(
    new Map(posts.map(({ link, slug }) => [link, `/writings/${slug}`]))
  );

  // Pass 2: convert and write.
  for (const { item, slug, link, author, source } of posts) {
    const html = text(item["content:encoded"]);
    const imageMap = await downloadImages(slug, collectImageUrls(html));
    const body = tidy(
      await rewriteLinks(createTurndown(imageMap).turndown(html))
    );

    const file = `${slug}.md`;
    const dest = path.join(POSTS_DIR, file);
    // Run the output through prettier so `npm run format:check` stays green and
    // a sync never fights the formatter over the same lines.
    const contents = await prettier.format(
      frontmatter({
        title: decodeEntities(text(item.title)).trim(),
        description: usableSubtitle(text(item.description)),
        pubDatetime: new Date(text(item.pubDate)),
        author,
        substackUrl: link,
        substackComments: await fetchCommentCount(source.publication, slug),
        ...OVERRIDES[slug],
      }) + body,
      { filepath: dest }
    );

    written.add(file);
    const existing = existsSync(dest) ? await readFile(dest, "utf8") : null;

    if (existing === contents) {
      console.log(`  = ${file}`);
      continue;
    }
    changed += 1;
    console.log(
      `  ${existing === null ? "+" : "~"} ${file}${DRY_RUN ? " (dry run)" : ""}`
    );
    if (!DRY_RUN) await writeFile(dest, contents);
  }

  // A post deleted or unpublished upstream should disappear here too.
  for (const file of previouslyManaged) {
    if (written.has(file)) continue;
    changed += 1;
    console.log(`\n  - ${file} (gone from Substack)${DRY_RUN ? " (dry run)" : ""}`);
    if (!DRY_RUN) {
      await rm(path.join(POSTS_DIR, file));
      await rm(path.join(IMAGES_DIR, file.replace(/\.mdx?$/, "")), {
        recursive: true,
        force: true,
      });
    }
  }

  console.log(
    `\n${changed === 0 ? "Up to date" : `${changed} post(s) ${DRY_RUN ? "would change" : "changed"}`}.`
  );
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
