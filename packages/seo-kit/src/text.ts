const MARKDOWN_NOISE =
  /```[\s\S]*?```|`[^`]*`|<[^>]+>|!\[[^\]]*\]\([^)]*\)|\[([^\]]*)\]\([^)]*\)|[#>*_~|-]/g;

/** Texte brut approximatif d'un contenu Markdown/MDX (code et balises retirés). */
export const toPlainText = (markdown: string): string =>
  markdown.replace(MARKDOWN_NOISE, (_match, linkText: string | undefined) => linkText ?? " ");

export const countWords = (markdown: string): number =>
  toPlainText(markdown)
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;

/** Temps de lecture en minutes, au minimum 1. */
export const readingTime = (markdown: string, wordsPerMinute = 230): number =>
  Math.max(1, Math.round(countWords(markdown) / wordsPerMinute));

/** Slug ASCII stable : « Accessibilité & Tests » → « accessibilite-tests ». */
export const slugify = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
