import type { CollectionEntry } from "astro:content";
import config from "@/config";

/**
 * Drafts never reach the live site (so Buttondown never sees them in the
 * feed), but they do render in `astro dev` and on Vercel preview deployments,
 * so an issue can be read in place before it goes out.
 */
const showDrafts = import.meta.env.DEV || process.env.VERCEL_ENV === "preview";

/**
 * Returns publishable newsletter issues, newest issue first. Same scheduling
 * rules as `postFilter()`; drafts are included only where `showDrafts` says.
 */
export function getSortedNewsletters(issues: CollectionEntry<"newsletters">[]) {
  return issues
    .filter(({ data }) => {
      const isPublishTimePassed =
        Date.now() >
        new Date(data.pubDatetime).getTime() - config.posts.scheduledPostMargin;
      const draftOk = showDrafts || !data.draft;
      return draftOk && (import.meta.env.DEV || isPublishTimePassed);
    })
    .sort((a, b) => b.data.issue - a.data.issue);
}
