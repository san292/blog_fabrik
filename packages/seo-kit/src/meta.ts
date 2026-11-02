import type { LinkTag, MetaTag, PageMeta, PageMetaInput } from "./types.ts";
import { absoluteUrl, withTrailingSlash } from "./url.ts";

const ROBOTS_INDEX = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const ROBOTS_NOINDEX = "noindex, follow";

/** Titre de page : « Titre | Site », ou le nom seul sur l'accueil. */
export const formatTitle = (title: string, siteName: string): string =>
  title.trim() === siteName.trim() ? siteName : `${title} | ${siteName}`;

const tag = (attr: MetaTag["attr"], key: string, content: string | undefined): MetaTag[] =>
  content ? [{ attr, key, content }] : [];

/**
 * Construit l'ensemble des balises SEO d'une page : canonical, robots,
 * Open Graph, Twitter, et liens de pagination.
 */
export const buildPageMeta = (input: PageMetaInput): PageMeta => {
  const { site } = input;
  const title = formatTitle(input.title, site.name);
  const canonical = absoluteUrl(withTrailingSlash(input.canonicalPath ?? input.path), site.url);
  const robots = input.noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX;
  const type = input.type ?? "website";
  const image = input.image
    ? { ...input.image, url: absoluteUrl(input.image.url, site.url) }
    : undefined;

  const meta: MetaTag[] = [
    ...tag("name", "description", input.description),
    ...tag("name", "robots", robots),
    ...tag("property", "og:type", type),
    ...tag("property", "og:site_name", site.name),
    ...tag("property", "og:locale", site.locale),
    ...tag("property", "og:title", input.title),
    ...tag("property", "og:description", input.description),
    ...tag("property", "og:url", canonical),
    ...tag("property", "og:image", image?.url),
    ...tag("property", "og:image:width", image ? String(image.width) : undefined),
    ...tag("property", "og:image:height", image ? String(image.height) : undefined),
    ...tag("property", "og:image:alt", image?.alt),
    ...tag("name", "twitter:card", image ? "summary_large_image" : "summary"),
    ...tag("name", "twitter:site", site.twitterHandle),
    ...tag("name", "twitter:title", input.title),
    ...tag("name", "twitter:description", input.description),
    ...tag("name", "twitter:image", image?.url),
  ];

  if (type === "article") {
    meta.push(
      ...tag("property", "article:published_time", input.publishedTime?.toISOString()),
      ...tag(
        "property",
        "article:modified_time",
        (input.modifiedTime ?? input.publishedTime)?.toISOString(),
      ),
      ...tag("property", "article:author", input.authorName),
      ...tag("property", "article:section", input.section),
      ...(input.tags ?? []).flatMap((t) => tag("property", "article:tag", t)),
    );
  }

  const links: LinkTag[] = [{ rel: "canonical", href: canonical }];
  if (input.prevPath) links.push({ rel: "prev", href: absoluteUrl(input.prevPath, site.url) });
  if (input.nextPath) links.push({ rel: "next", href: absoluteUrl(input.nextPath, site.url) });

  return { title, description: input.description, canonical, robots, meta, links };
};
