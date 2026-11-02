import config from "virtual:blog-core/config";
import { slugify, type SeoSite } from "@blog-factory/seo-kit";
import type { Author, Category } from "../config/schema.ts";

export { config };

export const seoSite: SeoSite = {
  name: config.name,
  url: config.url,
  lang: config.lang,
  locale: config.locale,
  ...(config.twitterHandle ? { twitterHandle: config.twitterHandle } : {}),
};

const { routes } = config;

export const urls = {
  home: (): string => "/",
  post: (id: string): string => `/${id}/`,
  category: (slug: string): string => `/${routes.category}/${slug}/`,
  tag: (tag: string): string => `/${routes.tag}/${slugify(tag)}/`,
  author: (slug: string): string => `/${routes.author}/${slug}/`,
  search: (): string => `/${routes.search}/`,
  og: (id: string): string => `/og/${id}.png`,
  rss: (): string => "/rss.xml",
} as const;

export const getCategory = (slug: string): Category => {
  const found = config.categories.find((c) => c.slug === slug);
  if (!found) {
    const known = config.categories.map((c) => c.slug).join(", ");
    throw new Error(`Catégorie « ${slug} » absente de site.config.ts (connues : ${known}).`);
  }
  return found;
};

export const getAuthor = (slug: string | undefined): Author => {
  const [first] = config.authors;
  if (!first) throw new Error("site.config.ts doit déclarer au moins un auteur.");
  if (!slug) return first;
  const found = config.authors.find((a) => a.slug === slug);
  if (!found) throw new Error(`Auteur « ${slug} » absent de site.config.ts.`);
  return found;
};

export const seoAuthor = (author: Author) => ({
  name: author.name,
  url: urls.author(author.slug),
  jobTitle: author.role,
  sameAs: author.sameAs,
});
