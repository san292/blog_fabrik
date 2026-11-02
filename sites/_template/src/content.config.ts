import { defineCollection } from "astro:content";
import { pageSchema, pagesLoader, postSchema, postsLoader } from "@blog-factory/core/content";

export const collections = {
  posts: defineCollection({ loader: postsLoader(), schema: postSchema }),
  pages: defineCollection({ loader: pagesLoader(), schema: pageSchema }),
};
