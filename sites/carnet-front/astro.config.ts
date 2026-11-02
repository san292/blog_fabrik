import { defineConfig } from "astro/config";
import blogCore from "@blog-factory/core";
import siteConfig from "./site.config.ts";

// Tout le reste (routes, SEO, polices, sitemap, recherche) vient de blog-core.
export default defineConfig({
  integrations: [blogCore(siteConfig)],
});
