/** YYYY-MM-DD in the given IANA timezone (e.g. America/New_York). */
export function getDateKey(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Stable daily pick from a slug list — same painting all day in a timezone. */
export function getHeroSlugForDate(
  date: Date,
  timeZone: string,
  slugs: readonly string[]
): string {
  if (slugs.length === 0) return "poppies";

  const dayKey = getDateKey(date, timeZone);
  let hash = 0;
  for (let i = 0; i < dayKey.length; i++) {
    hash = (hash * 31 + dayKey.charCodeAt(i)) >>> 0;
  }

  return slugs[hash % slugs.length]!;
}
