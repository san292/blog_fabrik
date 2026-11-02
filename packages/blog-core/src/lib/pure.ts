/** Fonctions pures, sans dépendance à Astro : testables unitairement. */

export const chunk = <T>(items: readonly T[], size: number): T[][] => {
  if (items.length === 0) return [[]];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
};

/** Chemin d'une page paginée : la page 1 reste sur l'URL de base. */
export const pagePath = (basePath: string, page: number, pageSegment: string): string =>
  page <= 1 ? basePath : `${basePath}${pageSegment}/${page}/`;

export interface PaginationInfo {
  readonly current: number;
  readonly total: number;
  readonly prevPath: string | undefined;
  readonly nextPath: string | undefined;
  readonly pages: readonly { readonly page: number; readonly path: string }[];
}

export const paginationInfo = (
  basePath: string,
  current: number,
  total: number,
  pageSegment: string,
): PaginationInfo => ({
  current,
  total,
  prevPath: current > 1 ? pagePath(basePath, current - 1, pageSegment) : undefined,
  nextPath: current < total ? pagePath(basePath, current + 1, pageSegment) : undefined,
  pages: Array.from({ length: total }, (_, i) => ({
    page: i + 1,
    path: pagePath(basePath, i + 1, pageSegment),
  })),
});

export interface Relatable {
  readonly id: string;
  readonly category: string;
  readonly tags: readonly string[];
  readonly date: Date;
}

/** Articles liés : même catégorie (+3), étiquette commune (+2 chacune), puis les plus récents. */
export const pickRelated = <T extends Relatable>(target: T, all: readonly T[], limit = 3): T[] =>
  all
    .filter((item) => item.id !== target.id)
    .map((item) => ({
      item,
      score:
        (item.category === target.category ? 3 : 0) +
        item.tags.filter((tag) => target.tags.includes(tag)).length * 2,
    }))
    .sort((a, b) => b.score - a.score || b.item.date.getTime() - a.item.date.getTime())
    .slice(0, limit)
    .map(({ item }) => item);

export interface TocHeading {
  readonly depth: number;
  readonly slug: string;
  readonly text: string;
}

export const tocItems = (headings: readonly TocHeading[]): TocHeading[] =>
  headings.filter((heading) => heading.depth === 2 || heading.depth === 3);

export const formatDate = (date: Date, lang: string): string =>
  new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

export const isoDate = (date: Date): string => date.toISOString().slice(0, 10);
