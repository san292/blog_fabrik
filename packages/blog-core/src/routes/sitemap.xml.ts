import type { APIRoute } from "astro";
import { absoluteUrl } from "@blog-factory/seo-kit";
import { isTagIndexable } from "../lib/listing.ts";
import { getPages, getPosts, getTags } from "../lib/posts.ts";
import { isoDate } from "../lib/pure.ts";
import { config, urls } from "../lib/site.ts";

interface SitemapEntry {
  readonly path: string;
  readonly lastmod?: Date | undefined;
}

const escapeXml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const latest = (dates: readonly Date[]): Date | undefined =>
  dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined;

/**
 * Sitemap précis : seules les pages indexables, avec la vraie date de
 * dernière modification (pas la date du build).
 */
export const GET: APIRoute = async () => {
  const [posts, pages, tags] = await Promise.all([getPosts(), getPages(), getTags()]);
  const indexable = posts.filter((p) => !p.entry.data.noindex && !p.entry.data.canonical);
  const lastmod = (list: typeof posts) => latest(list.map((p) => p.updated ?? p.date));

  const entries: SitemapEntry[] = [
    { path: urls.home(), lastmod: lastmod(indexable) },
    ...indexable.map((p) => ({ path: p.url, lastmod: p.updated ?? p.date })),
    ...config.categories
      .map((c) => ({ c, list: indexable.filter((p) => p.category === c.slug) }))
      .filter(({ list }) => list.length > 0)
      .map(({ c, list }) => ({ path: urls.category(c.slug), lastmod: lastmod(list) })),
    ...tags
      .filter((tag) => isTagIndexable(tag.posts.length))
      .map((tag) => ({ path: urls.tag(tag.label), lastmod: lastmod([...tag.posts]) })),
    ...config.authors.map((a) => ({
      path: urls.author(a.slug),
      lastmod: lastmod(indexable.filter((p) => p.author.slug === a.slug)),
    })),
    ...pages
      .filter((p) => !p.data.noindex)
      .map((p) => ({ path: urls.post(p.id), lastmod: p.data.updatedDate })),
  ];

  const body = entries
    .map((e) => {
      const loc = `<loc>${escapeXml(absoluteUrl(e.path, config.url))}</loc>`;
      return `  <url>${loc}${e.lastmod ? `<lastmod>${isoDate(e.lastmod)}</lastmod>` : ""}</url>`;
    })
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
