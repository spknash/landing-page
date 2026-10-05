import type { CollectionEntry } from "astro:content";
import config from "@/config";

/**
 * Returns publishable newsletter issues, newest issue first. Same draft and
 * scheduling rules as `postFilter()`.
 */
export function getSortedNewsletters(issues: CollectionEntry<"newsletters">[]) {
  return issues
    .filter(({ data }) => {
      const isPublishTimePassed =
        Date.now() >
        new Date(data.pubDatetime).getTime() - config.posts.scheduledPostMargin;
      return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
    })
    .sort((a, b) => b.data.issue - a.data.issue);
}
