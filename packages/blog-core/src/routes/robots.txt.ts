import type { APIRoute } from "astro";
import { absoluteUrl } from "@blog-factory/seo-kit";
import { config } from "../lib/site.ts";

export const GET: APIRoute = () =>
  new Response(
    [
      "User-agent: *",
      "Allow: /",
      `Disallow: /${config.routes.search}/`,
      "Disallow: /pagefind/",
      "",
      `Sitemap: ${absoluteUrl("/sitemap.xml", config.url)}`,
      "",
    ].join("\n"),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
