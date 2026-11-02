/**
 * Notifie Bing, Yandex, Seznam… (protocole IndexNow) des URL du sitemap.
 * À lancer après un déploiement :
 *
 *   pnpm indexnow carnet-front
 *
 * Prérequis : indexNowKey renseigné dans site.config.ts et site buildé.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const ENDPOINT = "https://api.indexnow.org/indexnow";

const fail = (message: string): never => {
  console.error(`✖ ${message}`);
  process.exit(1);
};

const main = async (): Promise<void> => {
  const slug = process.argv[2] ?? fail("Usage : pnpm indexnow <site>");
  const dist = join(ROOT, "sites", slug, "dist");

  const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8").catch(() =>
    fail(`sites/${slug}/dist/sitemap.xml introuvable : lancez d'abord le build.`),
  );
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].flatMap((m) => (m[1] ? [m[1]] : []));
  const first = urls[0] ?? fail("Sitemap vide.");

  const keyFile = (await readdir(dist)).find((f) => /^[a-f0-9]{8,128}\.txt$/.test(f));
  const key =
    keyFile?.replace(/\.txt$/, "") ??
    fail("Aucune clé IndexNow dans le build (indexNowKey dans site.config.ts).");
  const host = new URL(first).host;

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls }),
  });

  if (!response.ok) fail(`IndexNow a répondu ${response.status} ${response.statusText}`);
  console.log(`✔ ${urls.length} URL envoyées à IndexNow pour ${host}.`);
};

await main();
