import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getPosts } from "../lib/posts.ts";
import { config } from "../lib/site.ts";

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();
  return rss({
    title: config.name,
    description: config.description,
    site: context.site ?? config.url,
    trailingSlash: true,
    customData: `<language>${config.lang}</language>`,
    items: posts.slice(0, 30).map((post) => ({
      title: post.title,
      description: post.description,
      link: post.url,
      pubDate: post.date,
      categories: [post.categoryInfo.label, ...post.tags],
      author: post.author.name,
    })),
  });
};
