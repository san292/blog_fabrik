/**
 * Crée un nouveau site à partir de sites/_template.
 *
 *   pnpm new-site mon-blog --domain mon-blog.fr --name "Mon Blog" --accent "#11795f"
 *
 * Ne supprime ni n'écrase jamais rien : le script s'arrête si le dossier existe.
 */
import { cp, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { parseArgs } from "node:util";

interface SiteOptions {
  readonly slug: string;
  readonly domain: string;
  readonly name: string;
  readonly lang: string;
  readonly locale: string;
  readonly accent: string;
  readonly mark: string;
}

const ROOT = resolve(import.meta.dirname, "..");
const TEMPLATE = join(ROOT, "sites", "_template");
const TEXT_EXTENSIONS = new Set([".ts", ".json", ".md", ".mdx", ".svg", ".astro"]);
const SKIP = new Set(["node_modules", "dist", ".astro", ".turbo", ".vercel"]);
const LOCALES: Readonly<Record<string, string>> = {
  fr: "fr_FR",
  en: "en_US",
  de: "de_DE",
  es: "es_ES",
  it: "it_IT",
  pt: "pt_PT",
  nl: "nl_NL",
};

const fail = (message: string): never => {
  console.error(`✖ ${message}`);
  process.exit(1);
};

const titleCase = (slug: string): string =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const parseOptions = (): SiteOptions => {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      domain: { type: "string" },
      name: { type: "string" },
      lang: { type: "string", default: "fr" },
      accent: { type: "string", default: "#2f5be9" },
      mark: { type: "string" },
    },
  });

  const slug =
    positionals[0] ??
    fail("Indiquez le slug du site : pnpm new-site mon-blog --domain mon-blog.fr");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    fail("Slug invalide : minuscules, chiffres et tirets.");
  const domain = values.domain ?? fail("Option --domain obligatoire (ex. --domain mon-blog.fr).");
  if (!/^(?:[a-z0-9-]+\.)+[a-z]{2,}$/.test(domain)) fail(`Domaine invalide : ${domain}`);
  if (!/^#[0-9a-fA-F]{6}$/.test(values.accent)) fail("Couleur --accent au format #rrggbb.");

  const name = values.name ?? titleCase(slug);
  const lang = values.lang;
  return {
    slug,
    domain,
    name,
    lang,
    locale: LOCALES[lang] ?? `${lang}_${lang.toUpperCase()}`,
    accent: values.accent,
    mark: values.mark ?? name.charAt(0).toUpperCase(),
  };
};

const exists = (path: string): Promise<boolean> =>
  stat(path).then(
    () => true,
    () => false,
  );

const listFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries.filter((e) => e.isFile()).map((e) => join(e.parentPath, e.name));
};

const escapeXml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const escapeJson = (value: string): string => JSON.stringify(value).slice(1, -1);

/** Échappe les valeurs selon le format du fichier (SVG, TS/JSON, Markdown). */
const escaperFor = (file: string): ((value: string) => string) => {
  const ext = extname(file);
  if (ext === ".svg") return escapeXml;
  if (ext === ".ts" || ext === ".json") return escapeJson;
  return (value) => value;
};

const replacePlaceholders = (content: string, raw: SiteOptions, file: string): string => {
  const esc = escaperFor(file);
  const o = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, esc(v)])) as Record<
    keyof SiteOptions,
    string
  >;
  return content
    .replaceAll("__SITE_SLUG__", o.slug)
    .replaceAll("__SITE_DOMAIN__", o.domain)
    .replaceAll("__SITE_NAME__", o.name)
    .replaceAll("__SITE_LANG__", o.lang)
    .replaceAll("__SITE_LOCALE__", o.locale)
    .replaceAll("__SITE_ACCENT__", o.accent)
    .replaceAll("__SITE_MARK__", o.mark);
};

const main = async (): Promise<void> => {
  const options = parseOptions();
  const target = join(ROOT, "sites", options.slug);
  if (await exists(target))
    fail(`Le dossier sites/${options.slug} existe déjà : rien n'a été modifié.`);

  await cp(TEMPLATE, target, {
    recursive: true,
    errorOnExist: true,
    force: false,
    filter: (source) => !SKIP.has(source.split(/[\\/]/).pop() ?? ""),
  });

  const files = (await listFiles(target)).filter((f) => TEXT_EXTENSIONS.has(extname(f)));
  await Promise.all(
    files.map(async (file) =>
      writeFile(file, replacePlaceholders(await readFile(file, "utf8"), options, file)),
    ),
  );

  console.log(`✔ Site créé : sites/${options.slug} (${options.name}, https://${options.domain})

Étapes suivantes :
  1. pnpm install
  2. Compléter sites/${options.slug}/site.config.ts (description, auteur, catégories)
  3. Compléter les mentions légales dans sites/${options.slug}/src/content/pages/
  4. pnpm --filter @sites/${options.slug} dev
  5. Sur Vercel : nouveau projet, Root Directory = sites/${options.slug}`);
};

await main();
