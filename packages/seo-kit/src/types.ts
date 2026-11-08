export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  JsonPrimitive | readonly JsonValue[] | { readonly [key: string]: JsonValue };
export type JsonObject = { readonly [key: string]: JsonValue };

export interface SeoSite {
  readonly name: string;
  /** URL absolue du site, ex. https://mon-blog.fr */
  readonly url: string;
  /** Code langue BCP-47, ex. fr */
  readonly lang: string;
  /** Locale Open Graph, ex. fr_FR */
  readonly locale: string;
  readonly twitterHandle?: string;
}

export interface SeoImage {
  /** URL absolue ou chemin relatif au site */
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

export interface SeoAuthor {
  readonly name: string;
  readonly url: string;
  readonly sameAs?: readonly string[];
  readonly jobTitle?: string;
  readonly image?: string;
}

export interface SeoPublisher {
  readonly name: string;
  readonly url: string;
  readonly logo?: string;
}

export interface PageMetaInput {
  readonly site: SeoSite;
  readonly title: string;
  readonly description: string;
  /** Chemin de la page, ex. /mon-article/ */
  readonly path: string;
  readonly type?: "website" | "article" | "profile";
  readonly image?: SeoImage;
  readonly noindex?: boolean;
  readonly publishedTime?: Date;
  readonly modifiedTime?: Date;
  readonly authorName?: string;
  /** Handle Twitter de l'auteur (ex. @alaindo) pour twitter:creator sur les articles. */
  readonly authorTwitter?: string;
  readonly section?: string;
  readonly tags?: readonly string[];
  readonly prevPath?: string;
  readonly nextPath?: string;
  readonly canonicalPath?: string;
}

export interface MetaTag {
  readonly attr: "name" | "property";
  readonly key: string;
  readonly content: string;
}

export interface LinkTag {
  readonly rel: string;
  readonly href: string;
  readonly type?: string;
  readonly title?: string;
}

export interface PageMeta {
  readonly title: string;
  readonly description: string;
  readonly canonical: string;
  readonly robots: string;
  readonly meta: readonly MetaTag[];
  readonly links: readonly LinkTag[];
}
