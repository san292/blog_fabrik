import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { AstroIntegration } from "astro";
import { fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import * as pagefind from "pagefind";
import { FONT_LIBRARY, FONT_ROLES, type FontKey, type FontRole } from "./config/fonts.ts";
import { parseSiteConfig, type SiteConfig, type SiteConfigInput } from "./config/schema.ts";
import { findBrokenLinks } from "./integration/link-check.ts";

export { defineSiteConfig } from "./config/schema.ts";
export type { SiteConfig, SiteConfigInput } from "./config/schema.ts";

const require = createRequire(import.meta.url);
const VIRTUAL_ID = "virtual:blog-core/config";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

const routeFile = (name: string): string =>
  fileURLToPath(new URL(`./routes/${name}`, import.meta.url));

const fontFamily = (role: FontRole, key: FontKey) => {
  const preset = FONT_LIBRARY[key];
  const file = pathToFileURL(require.resolve(`${preset.packageName}/files/${preset.file}`));
  return {
    provider: fontProviders.local(),
    name: preset.family,
    cssVariable: FONT_ROLES[role],
    fallbacks: [...preset.fallbacks],
    options: {
      variants: [{ src: [file], weight: preset.weight, style: "normal", display: "swap" }],
    },
  };
};

/** Fichiers lus au build par le générateur d'images Open Graph. */
const ogAssets = {
  display:
    require.resolve("@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff"),
  body: require.resolve("@fontsource/figtree/files/figtree-latin-500-normal.woff"),
  resvgWasm: require.resolve("@resvg/resvg-wasm/index_bg.wasm"),
};

const routesFor = (config: SiteConfig) => {
  const r = config.routes;
  const list = [
    { pattern: "/", entrypoint: routeFile("index.astro") },
    { pattern: `/${r.page}/[page]`, entrypoint: routeFile("home-page.astro") },
    { pattern: "/[slug]", entrypoint: routeFile("entry.astro") },
    { pattern: `/${r.category}/[category]/[...page]`, entrypoint: routeFile("category.astro") },
    { pattern: `/${r.tag}/[tag]/[...page]`, entrypoint: routeFile("tag.astro") },
    { pattern: `/${r.author}/[author]`, entrypoint: routeFile("author.astro") },
    { pattern: `/${r.search}`, entrypoint: routeFile("search.astro") },
    { pattern: "/404", entrypoint: routeFile("404.astro") },
    { pattern: "/og/[slug].png", entrypoint: routeFile("og.png.ts") },
    { pattern: "/rss.xml", entrypoint: routeFile("rss.xml.ts") },
    { pattern: "/sitemap.xml", entrypoint: routeFile("sitemap.xml.ts") },
    { pattern: "/robots.txt", entrypoint: routeFile("robots.txt.ts") },
  ];
  return config.indexNowKey
    ? [
        ...list,
        { pattern: `/${config.indexNowKey}.txt`, entrypoint: routeFile("indexnow-key.txt.ts") },
      ]
    : list;
};

/**
 * Thème partagé de l'usine à blogs : routes, SEO, polices, îlots React,
 * index de recherche et vérification des liens au build.
 */
export default function blogCore(input: SiteConfigInput): AstroIntegration {
  const config = parseSiteConfig(input);
  const { fonts } = config.theme;

  return {
    name: "@blog-factory/core",
    hooks: {
      "astro:config:setup": ({ command, updateConfig, injectRoute }) => {
        updateConfig({
          site: config.url,
          // "always" en build (URL canoniques avec slash final) ; "ignore" en dev,
          // sinon le serveur de dev renvoie 404 sur /_image (optimisation des images).
          trailingSlash: command === "build" ? "always" : "ignore",
          build: { format: "directory", inlineStylesheets: "auto" },
          prefetch: { prefetchAll: false, defaultStrategy: "hover" },
          integrations: [react(), mdx()],
          fonts: [
            fontFamily("display", fonts.display),
            fontFamily("body", fonts.body),
            fontFamily("reading", fonts.reading),
            fontFamily("mono", fonts.mono),
          ],
          markdown: {
            shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
          },
          vite: {
            plugins: [
              {
                name: "blog-core-config",
                resolveId: (id: string) => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
                load: (id: string) =>
                  id === RESOLVED_ID
                    ? `export default ${JSON.stringify(config)};\nexport const ogAssets = ${JSON.stringify(ogAssets)};`
                    : undefined,
              },
            ],
          },
        });
        for (const route of routesFor(config)) injectRoute({ ...route, prerender: true });
      },

      // En dev, empêche le navigateur de mettre en cache les images optimisées (/_image).
      // Sans ça, remplacer une image sur disque ne se voit pas : le nom de fichier ne change
      // pas, donc Chrome ressert l'ancienne version. En build/prod, les noms sont hashés.
      "astro:server:setup": ({ server }) => {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.includes("/_image")) {
            // Astro pose un Cache-Control d'un an sur /_image. On intercepte
            // setHeader pour le forcer à no-store, sinon Chrome garde l'ancienne
            // image après un remplacement (même nom de fichier → même URL).
            const original = res.setHeader.bind(res);
            res.setHeader = (name: string, value: string | number | readonly string[]) => {
              if (String(name).toLowerCase() === "cache-control") {
                return original("Cache-Control", "no-store, must-revalidate");
              }
              return original(name, value);
            };
          }
          next();
        });
      },

      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);

        const broken = await findBrokenLinks(outDir);
        if (broken.length > 0) {
          const list = broken.map((b) => `  ${b.page} → ${b.href}`).join("\n");
          throw new Error(`${broken.length} lien(s) interne(s) cassé(s) :\n${list}`);
        }
        logger.info("Liens internes vérifiés : aucun lien cassé.");

        const { index, errors } = await pagefind.createIndex({ forceLanguage: config.lang });
        if (!index) throw new Error(`Pagefind : ${errors.join(", ")}`);
        await index.addDirectory({ path: outDir });
        await index.writeFiles({ outputPath: join(outDir, "pagefind") });
        await pagefind.close();
        logger.info("Index de recherche Pagefind généré.");
      },
    },
  };
}
