/**
 * Bibliothèque de polices auto-hébergées (fichiers lus depuis node_modules,
 * jamais depuis un CDN). Pour ajouter une police : installer le paquet
 * @fontsource-variable/<nom> dans blog-core et ajouter une entrée ici.
 */
export interface FontPreset {
  readonly family: string;
  readonly packageName: string;
  /** Fichier latin variable (couvre le français, Œ/œ compris). */
  readonly file: string;
  readonly weight: string;
  readonly fallbacks: readonly [string, ...string[]];
}

export const FONT_LIBRARY = {
  "bricolage-grotesque": {
    family: "Bricolage Grotesque",
    packageName: "@fontsource-variable/bricolage-grotesque",
    file: "bricolage-grotesque-latin-wght-normal.woff2",
    weight: "200 800",
    fallbacks: ["sans-serif"],
  },
  figtree: {
    family: "Figtree",
    packageName: "@fontsource-variable/figtree",
    file: "figtree-latin-wght-normal.woff2",
    weight: "300 900",
    fallbacks: ["sans-serif"],
  },
  "source-serif-4": {
    family: "Source Serif 4",
    packageName: "@fontsource-variable/source-serif-4",
    file: "source-serif-4-latin-wght-normal.woff2",
    weight: "200 900",
    fallbacks: ["serif"],
  },
  "jetbrains-mono": {
    family: "JetBrains Mono",
    packageName: "@fontsource-variable/jetbrains-mono",
    file: "jetbrains-mono-latin-wght-normal.woff2",
    weight: "100 800",
    fallbacks: ["monospace"],
  },
} as const satisfies Record<string, FontPreset>;

export type FontKey = keyof typeof FONT_LIBRARY;
export const FONT_KEYS = Object.keys(FONT_LIBRARY) as [FontKey, ...FontKey[]];

/** Rôles typographiques exposés en variables CSS. */
export const FONT_ROLES = {
  display: "--f-display",
  body: "--f-ui",
  reading: "--f-read",
  mono: "--f-mono",
} as const;

export type FontRole = keyof typeof FONT_ROLES;
