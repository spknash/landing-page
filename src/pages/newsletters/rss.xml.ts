import rss from "@astrojs/rss";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getCollection, render } from "astro:content";
import { getImage } from "astro:assets";
import mdxRenderer from "@astrojs/mdx/server.js";
import { getSortedNewsletters } from "@/utils/getSortedNewsletters";
import { renderForEmail } from "@/utils/renderForEmail";
import config from "@/config";

/**
 * Newsletter issues only, with the full issue in `content:encoded`. This is
 * the feed Buttondown's RSS-to-email automation watches, so every new item
 * here becomes an email draft. Items are identified by their URL (the guid),
 * so editing an issue never re-sends it; renaming its file would.
 */
export async function GET() {
  const site = config.site.url;
  const issues = getSortedNewsletters(await getCollection("newsletters"));

  const container = await AstroContainer.create();
  container.addServerRenderer({ name: "mdx", renderer: mdxRenderer });

  const items = [];
  for (const issue of issues) {
    const { Content } = await render(issue);
    const html = await container.renderToString(Content, {
      partial: true,
      locals: {},
    });
    const hero = await getImage({
      src: issue.data.heroImage,
      width: 1200,
      format: "jpg",
    });
    const link = new URL(`newsletters/${issue.id}/`, site).href;
    items.push({
      link,
      title: issue.data.title,
      description: issue.data.description,
      pubDate: new Date(issue.data.pubDatetime),
      content: renderForEmail(html, {
        site,
        link,
        heroSrc: new URL(hero.src, site).href,
        heroAlt: issue.data.heroAlt,
      }),
      enclosure: {
        url: new URL(hero.src, site).href,
        type: "image/jpeg",
        length: 0,
      },
    });
  }

  return rss({
    title: `${config.site.companyName} · Newsletter`,
    description: "What we got up to this week.",
    site,
    items,
    customData: `<language>${config.site.lang}</language>`,
  });
}
