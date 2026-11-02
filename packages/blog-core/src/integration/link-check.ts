import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const INTERNAL_URL = /\s(?:href|src)="(\/(?!\/)[^"#?]*)/g;

const listHtmlFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".html"))
    .map((e) => join(e.parentPath, e.name));
};

const exists = async (path: string): Promise<boolean> =>
  stat(path).then(
    () => true,
    () => false,
  );

const targetFile = (outDir: string, urlPath: string): string => {
  const decoded = decodeURIComponent(urlPath);
  return decoded.endsWith("/") ? join(outDir, decoded, "index.html") : join(outDir, decoded);
};

export interface BrokenLink {
  readonly page: string;
  readonly href: string;
}

/** Vérifie que chaque lien interne du build pointe vers un fichier existant. */
export const findBrokenLinks = async (outDir: string): Promise<BrokenLink[]> => {
  const files = await listHtmlFiles(outDir);
  const checked = new Map<string, boolean>();
  const broken: BrokenLink[] = [];

  for (const file of files) {
    const html = await readFile(file, "utf8");
    for (const match of html.matchAll(INTERNAL_URL)) {
      const href = match[1];
      if (!href) continue;
      const known = checked.get(href);
      const ok = known ?? (await exists(targetFile(outDir, href)));
      checked.set(href, ok);
      if (!ok) broken.push({ page: `/${relative(outDir, file)}`, href });
    }
  }
  return broken;
};
