/**
 * Turns an issue's rendered HTML into something an email client can show:
 * absolute URLs, plain images at a sensible size, link cards as text links,
 * no iframes, no site-only class or style hooks.
 */
type Options = {
  site: string;
  link: string;
  heroSrc: string;
  heroAlt: string;
};

export function renderForEmail(html: string, opts: Options): string {
  let out = html;

  // Link cards become a plain link with the description after it.
  out = out.replace(
    /<a href="([^"]+)" class="link-card"[^>]*>[\s\S]*?<span class="link-card-title">([^<]*)<\/span>(?:\s*<span class="link-card-desc">([^<]*)<\/span>)?[\s\S]*?<\/a>/g,
    (_m, href: string, title: string, desc?: string) =>
      `<p><a href="${href}">${title}</a>${desc ? ` ${desc}` : ""}</p>`
  );

  // Pick a mid-size candidate from srcset so photos aren't 2000px wide.
  out = out.replace(
    /<img\b([^>]*)\bsrcset="([^"]*)"([^>]*)>/g,
    (_m, before: string, srcset: string, after: string) => {
      const candidates = srcset
        .split(",")
        .map(c => c.trim().split(/\s+/))
        .map(([url, w]) => ({ url, w: parseInt(w ?? "0", 10) }))
        .filter(c => c.url)
        .sort((a, b) => a.w - b.w);
      const pick = candidates.find(c => c.w >= 640) ?? candidates.at(-1);
      const attrs = (before + after).replace(/\bsrc="[^"]*"/, "");
      return pick
        ? `<img src="${pick.url}"${attrs}>`
        : `<img${before}${after}>`;
    }
  );

  // Absolute URLs for every image and link.
  out = out.replace(
    /\b(src|href)="\/(?!\/)([^"]*)"/g,
    (_m, attr: string, path: string) =>
      `${attr}="${new URL(path, opts.site).href}"`
  );

  // Embedded videos can't play in email; link to them instead.
  out = out.replace(
    /<iframe[^>]*\bsrc="([^"]+)"[^>]*>(?:\s*<\/iframe>)?/g,
    (_m, src: string) => {
      const watch = src.replace(
        /https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/([\w-]+).*/,
        "https://www.youtube.com/watch?v=$1"
      );
      return `<p><a href="${watch}">Watch the video</a></p>`;
    }
  );

  // Responsive and layout attributes mean nothing in email, and intrinsic
  // width/height would make phone photos overflow the message.
  out = out.replace(
    /\s(sizes|loading|decoding|fetchpriority|width|height|class|style|target|rel|data-[\w-]+)="[^"]*"/g,
    ""
  );

  return [
    `<p><img src="${opts.heroSrc}" alt="${escapeAttr(opts.heroAlt)}"></p>`,
    out.trim(),
    `<p><a href="${opts.link}">Read this issue on the site</a></p>`,
  ].join("\n");
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
