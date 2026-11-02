import { getPosts, getTags, type Post } from "./posts.ts";
import { chunk, paginationInfo, type PaginationInfo } from "./pure.ts";
import { config, urls } from "./site.ts";

export interface Listing {
  readonly posts: readonly Post[];
  readonly pagination: PaginationInfo;
  readonly total: number;
}

const listing = (all: readonly Post[], basePath: string, page: number): Listing => {
  const pages = chunk(all, config.postsPerPage);
  return {
    posts: pages[page - 1] ?? [],
    pagination: paginationInfo(basePath, page, pages.length, config.routes.page),
    total: all.length,
  };
};

/** Paramètre de route « rest » : undefined pour la page 1, « page/2 » ensuite. */
export const restParam = (page: number): string | undefined =>
  page <= 1 ? undefined : `${config.routes.page}/${page}`;

export const pageFromRest = (rest: string | undefined): number => {
  if (!rest) return 1;
  const value = Number(rest.split("/").pop());
  return Number.isInteger(value) && value > 1 ? value : 1;
};

export const homeListing = async (
  page: number,
): Promise<Listing & { featured: Post | undefined }> => {
  const posts = await getPosts();
  const featured = config.layout.featuredPost ? posts[0] : undefined;
  return { ...listing(featured ? posts.slice(1) : posts, urls.home(), page), featured };
};

export const homePageCount = async (): Promise<number> => (await homeListing(1)).pagination.total;

export const categoryListing = async (slug: string, page: number): Promise<Listing> =>
  listing(
    (await getPosts()).filter((p) => p.category === slug),
    urls.category(slug),
    page,
  );

export const tagListing = async (
  tagSlug: string,
  page: number,
): Promise<Listing & { label: string }> => {
  const tag = (await getTags()).find((t) => t.slug === tagSlug);
  if (!tag) throw new Error(`Étiquette inconnue : ${tagSlug}`);
  return { ...listing(tag.posts, urls.tag(tag.label), page), label: tag.label };
};

export const isTagIndexable = (count: number): boolean => count >= config.tagIndexThreshold;
