import type { CollectionEntry } from "astro:content";

function stripMarkdown(line: string): string {
  return line
    .replace(/^#{1,6}\s+/, "")
    .replace(/^>\s*/, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

function getFirstLineFromBody(body: string | undefined): string | undefined {
  if (!body) return undefined;

  for (const line of body.split(/\r?\n/)) {
    const text = stripMarkdown(line);
    if (text) return text;
  }

  return undefined;
}

export function getPostPreview(
  post: Pick<CollectionEntry<"posts">, "data" | "body">
): string | undefined {
  return post.data.description ?? getFirstLineFromBody(post.body);
}
