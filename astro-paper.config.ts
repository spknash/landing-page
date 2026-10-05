import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://sahilandsuhaas.com/",
    companyName: "Sahil & Suhaas",
    mission: [
      "Humans have always had a natural drive to make things. For most of history, almost no one got to build what they truly believed in. Most of our time and energy went towards earning a living, leaving little or no time remaining for the things we actually want to build.",
      "AI presents the opportunity to change this. The capability is already here; but the killer interface still hasn't arrived yet. A very small percent of the world is leveraging this new technology.",
      "The PC unleashed software for everyone. The browser unleashed the internet for everyone.",
      "We're building what unleashes machine intelligence for everyone. So anyone can create what they believe in.",
    ],
    description:
      "What we believe, what we're writing, and a weekly newsletter on what we've been up to.",
    author: "Suhaas & Sahil",
    profile: "",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "America/New_York",
    dir: "ltr",
  },
  posts: {
    perPage: 8,
    perIndex: 3,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: false,
    // Disabled: AstroPaper's satori OG template is off-brand and depended on the
    // removed Google font config. We ship a static, on-brand default-og.jpg.
    dynamicOgImage: false,
    // Keep the surface area tiny: no archives/tags clutter in the umbrella site.
    showArchives: false,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "x", url: "https://x.com/suhaaspk", linkTitle: "Suhaas on X" },
    { name: "x", url: "https://x.com/sahilmdkr", linkTitle: "Sahil on X" },
    { name: "substack", url: "https://substack.com/@suhaaspk" },
  ],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});