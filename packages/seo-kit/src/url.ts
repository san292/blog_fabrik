/** Transforme un chemin en URL absolue, en conservant les URL déjà absolues. */
export const absoluteUrl = (pathOrUrl: string, siteUrl: string): string =>
  new URL(pathOrUrl, siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`).href;

/** Garantit un slash final sur un chemin de page (hors fichiers avec extension). */
export const withTrailingSlash = (path: string): string => {
  if (path.endsWith("/")) return path;
  const last = path.split("/").pop() ?? "";
  return last.includes(".") ? path : `${path}/`;
};
