/**
 * The Substack publications mirrored into `src/content/posts`.
 *
 * Note: the `substack.com/@handle` profile URLs have no feed of their own —
 * only the publication subdomains do, which is what we pull from here.
 */
export const SUBSTACK_SOURCES = [
  {
    author: "Suhaas",
    publication: "https://suhaaspk.substack.com",
    handle: "suhaaspk",
  },
  {
    author: "Sahil",
    publication: "https://sahilmahendrakar.substack.com",
    handle: "sahilmahendrakar",
  },
];

/** Substack slugs never mirrored (placeholders, welcome posts, etc.). */
export const SKIP_SLUGS = new Set(["coming-soon"]);

/** Tag applied to every mirrored post. */
export const DEFAULT_TAGS = ["essays"];

/**
 * Per-slug frontmatter overrides, applied on top of what the feed reports.
 *
 * Substack subtitles are written as a hook under the title and often make poor
 * `<meta name="description">` / OG copy — these are the hand-written ones. Any
 * post without an entry here falls back to its Substack subtitle, or to an
 * excerpt of the body.
 */
export const OVERRIDES = {
  fluxx: {
    description:
      "Why we're building Fluxx: a human interface on top of an agentic software factory.",
  },
  "soft-pivot": {
    description:
      "What we learned talking to 15–20 potential users, and where Fluxx is headed next.",
  },
  "software-factories": {
    description:
      "What does the automation of software creation look like, and what happens after that?",
  },
  "the-guy-with-the-stupid-desk-setup": {
    // Its Substack subtitle is a lone emoji, so without this the card preview
    // falls back to the whole opening paragraph.
    description:
      "A coworker's baffling desk setup, and what it made me notice about the easy things I avoid doing.",
  },
};
