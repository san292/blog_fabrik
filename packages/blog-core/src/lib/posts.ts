import { getCollection, type CollectionEntry } from "astro:content";
import { readingTime, slugify } from "@blog-factory/seo-kit";
import type { Author, Category } from "../config/schema.ts";
import { config, getAuthor, getCategory, urls } from "./site.ts";

export type PostEntry = CollectionEntry<"posts">;
export type PageEntry = CollectionEntry<"pages">;

export interface Post {
  readonly id: string;
  readonly url: string;
  readonly entry: PostEntry;
  readonly title: string;
  readonly description: string;
  readonly date: Date;
  readonly updated: Date | undefined;
  readonly category: string;
  readonly categoryInfo: Category;
  readonly tags: readonly string[];
  readonly author: Author;
  readonly readingTime: number;
}

/** Typographie française : espace insécable avant « : ; ! ? » pour éviter les retours à la ligne orphelins. */
const typo = (text: string): string =>
  config.lang.startsWith("fr")
    ? text.replace(/ ([:;!?»])/g, "\u00a0$1").replace(/« /g, "«\u00a0")
    : text;

const toPost = (entry: PostEntry): Post => ({
  id: entry.id,
  url: urls.post(entry.id),
  entry,
  title: typo(entry.data.title),
  description: typo(entry.data.description),
  date: entry.data.pubDate,
  updated: entry.data.updatedDate,
  category: entry.data.category,
  categoryInfo: getCategory(entry.data.category),
  tags: entry.data.tags,
  author: getAuthor(entry.data.author),
  readingTime: readingTime(entry.body ?? ""),
});

const cache: { posts?: Promise<Post[]> } = {};

/** Articles publiés, du plus récent au plus ancien (brouillons visibles en dev uniquement). */
const loadPosts = (): Promise<Post[]> =>
  getCollection("posts", (entry) => import.meta.env.DEV || !entry.data.draft).then((entries) =>
    entries.map(toPost).sort((a, b) => b.date.getTime() - a.date.getTime()),
  );

export const getPosts = (): Promise<Post[]> => {
  if (import.meta.env.DEV) return loadPosts();
  cache.posts ??= loadPosts();
  return cache.posts;
};

export const getPages = (): Promise<PageEntry[]> => getCollection("pages");

export interface TagInfo {
  readonly slug: string;
  readonly label: string;
  readonly posts: readonly Post[];
}

export const getTags = async (): Promise<TagInfo[]> => {
  const posts = await getPosts();
  const map = new Map<string, { label: string; posts: Post[] }>();
  for (const post of posts) {
    for (const label of post.tags) {
      const slug = slugify(label);
      const current = map.get(slug) ?? { label, posts: [] };
      current.posts.push(post);
      map.set(slug, current);
    }
  }
  return [...map.entries()]
    .map(([slug, value]) => ({ slug, ...value }))
    .sort((a, b) => b.posts.length - a.posts.length || a.label.localeCompare(b.label));
};
