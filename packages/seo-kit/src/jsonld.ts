import type { JsonObject, SeoAuthor, SeoImage, SeoPublisher, SeoSite } from "./types.ts";
import { absoluteUrl } from "./url.ts";

const CONTEXT = "https://schema.org";

const compact = (obj: Record<string, JsonObject[string] | undefined>): JsonObject =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as JsonObject;

export const websiteId = (site: SeoSite): string => `${absoluteUrl("/", site.url)}#website`;
export const publisherId = (site: SeoSite): string => `${absoluteUrl("/", site.url)}#publisher`;
export const personId = (author: SeoAuthor, site: SeoSite): string =>
  `${absoluteUrl(author.url, site.url)}#person`;

export const websiteLd = (site: SeoSite, description: string): JsonObject => ({
  "@type": "WebSite",
  "@id": websiteId(site),
  url: absoluteUrl("/", site.url),
  name: site.name,
  description,
  inLanguage: site.lang,
  publisher: { "@id": publisherId(site) },
});

export const publisherLd = (site: SeoSite, publisher: SeoPublisher): JsonObject =>
  compact({
    "@type": "Organization",
    "@id": publisherId(site),
    name: publisher.name,
    url: absoluteUrl(publisher.url, site.url),
    logo: publisher.logo
      ? { "@type": "ImageObject", url: absoluteUrl(publisher.logo, site.url) }
      : undefined,
  });

export const personLd = (author: SeoAuthor, site: SeoSite): JsonObject =>
  compact({
    "@type": "Person",
    "@id": personId(author, site),
    name: author.name,
    url: absoluteUrl(author.url, site.url),
    jobTitle: author.jobTitle,
    image: author.image ? absoluteUrl(author.image, site.url) : undefined,
    sameAs: author.sameAs && author.sameAs.length > 0 ? [...author.sameAs] : undefined,
  });

export interface BreadcrumbItem {
  readonly name: string;
  readonly path: string;
}

export const breadcrumbLd = (items: readonly BreadcrumbItem[], site: SeoSite): JsonObject => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path, site.url),
  })),
});

export interface BlogPostingInput {
  readonly site: SeoSite;
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly image: SeoImage;
  readonly published: Date;
  readonly modified?: Date;
  readonly author: SeoAuthor;
  readonly section?: string;
  readonly tags?: readonly string[];
  readonly wordCount?: number;
}

export const blogPostingLd = (input: BlogPostingInput): JsonObject => {
  const url = absoluteUrl(input.path, input.site.url);
  return compact({
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: input.title,
    description: input.description,
    image: {
      "@type": "ImageObject",
      url: absoluteUrl(input.image.url, input.site.url),
      width: input.image.width,
      height: input.image.height,
    },
    datePublished: input.published.toISOString(),
    dateModified: (input.modified ?? input.published).toISOString(),
    inLanguage: input.site.lang,
    author: { "@id": personId(input.author, input.site) },
    publisher: { "@id": publisherId(input.site) },
    isPartOf: { "@id": websiteId(input.site) },
    articleSection: input.section,
    keywords: input.tags && input.tags.length > 0 ? input.tags.join(", ") : undefined,
    wordCount: input.wordCount,
  });
};

/** Regroupe plusieurs nœuds dans un seul graphe JSON-LD. */
export const ldGraph = (...nodes: readonly JsonObject[]): JsonObject => ({
  "@context": CONTEXT,
  "@graph": [...nodes],
});

/** Sérialise un JSON-LD sans risque d'injection dans une balise <script>. */
export const serializeJsonLd = (data: JsonObject): string =>
  JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
