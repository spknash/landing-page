import type { ImageMetadata } from "astro";
import heroMansfield from "@/assets/images/hero-mansfield-mountain.jpg";
import heroPoppies from "@/assets/images/hero-poppies.jpg";
import heroTwachtman from "@/assets/images/hero-twachtman-spring.jpg";
import heroWashington from "@/assets/images/hero-washington-delaware.jpg";

export type HeroCandidate = {
  slug: string;
  src: ImageMetadata;
  title: string;
  artist: string;
  year?: number;
  source: string;
  notes?: string;
};

/** Paintings to compare against the current global theme tokens. */
export const heroCandidates: HeroCandidate[] = [
  {
    slug: "poppies",
    src: heroPoppies,
    title: "Poppies, Isles of Shoals",
    artist: "Childe Hassam",
    year: 1891,
    source: "National Gallery of Art (public domain)",
  },
  {
    slug: "twachtman-spring",
    src: heroTwachtman,
    title: "Spring Landscape",
    artist: "John Henry Twachtman",
    source: "Public domain",
  },
  {
    slug: "washington-delaware",
    src: heroWashington,
    title: "Washington Crossing the Delaware",
    artist: "Emanuel Leutze",
    year: 1851,
    source: "The Metropolitan Museum of Art (CC0)",
  },
  {
    slug: "mansfield-mountain",
    src: heroMansfield,
    title: "The Belated Party on Mansfield Mountain",
    artist: "Jerome B. Thompson",
    year: 1858,
    source: "The Metropolitan Museum of Art (CC0)",
  },
];

/** Original default hero and fallback when rotation is off. */
export const defaultHeroSlug = "poppies";

/** Pin the home hero (skips daily rotation). Set to `null` to rotate again. */
export const pinnedHeroSlug: string | null = null;

/** Home hero rotation pool (one painting per calendar day, site timezone). */
export const heroRotationSlugs = heroCandidates.map(candidate => candidate.slug);

export function getHeroCandidate(slug: string | null | undefined) {
  return (
    heroCandidates.find(candidate => candidate.slug === slug) ??
    heroCandidates.find(candidate => candidate.slug === defaultHeroSlug)!
  );
}
