import { z } from "astro/zod";
import { FONT_KEYS } from "./fonts.ts";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message: "Slug invalide : minuscules, chiffres et tirets.",
});
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, { message: "Couleur au format #rrggbb." });
const metaDescription = z
  .string()
  .min(70, { message: "Meta description trop courte (70 caractères minimum)." })
  .max(160, { message: "Meta description trop longue (160 caractères maximum)." });

const link = z.object({ label: z.string().min(1), href: z.string().min(1) });

const author = z.object({
  slug,
  name: z.string().min(2),
  role: z.string().min(2),
  /** Bio affichée sur la page auteur et dans l'encadré : un vrai signal E-E-A-T. */
  bio: z.string().min(80, { message: "Bio auteur trop courte (80 caractères minimum)." }),
  /** Profils publics (LinkedIn, GitHub…) pour le JSON-LD sameAs. */
  sameAs: z.array(z.url()).default([]),
  /** Handle Twitter/X de l'auteur (ex. @alaindo) pour twitter:creator. */
  twitter: z
    .string()
    .regex(/^@[A-Za-z0-9_]{1,15}$/, { message: "Handle Twitter invalide (ex. @alaindo)." })
    .optional(),
});

const category = z.object({
  slug,
  label: z.string().min(2),
  /** Introduction de la page pilier de la catégorie, et sa meta description. */
  description: metaDescription,
});

export const siteConfigSchema = z.object({
  name: z.string().min(2),
  tagline: z.string().min(2),
  description: metaDescription,
  url: z.url(),
  lang: z.string().default("fr"),
  locale: z.string().default("fr_FR"),
  /** 1 à 4 caractères affichés dans le logo carré. */
  logoMark: z.string().min(1).max(4).default("•"),
  twitterHandle: z
    .string()
    .regex(/^@\w+$/)
    .optional(),
  publisher: z.object({
    name: z.string().min(2),
    logo: z.string().optional(),
  }),
  authors: z.array(author).min(1),
  categories: z.array(category).min(1),
  nav: z.array(link).default([]),
  footerLinks: z.array(link).default([]),
  theme: z
    .object({
      accent: hexColor,
      /** Accent en thème sombre ; par défaut, le même que l'accent clair. */
      accentDark: hexColor.optional(),
      fonts: z
        .object({
          display: z.enum(FONT_KEYS),
          body: z.enum(FONT_KEYS),
          reading: z.enum(FONT_KEYS),
          mono: z.enum(FONT_KEYS),
        })
        .default({
          display: "bricolage-grotesque",
          body: "figtree",
          reading: "source-serif-4",
          mono: "jetbrains-mono",
        }),
    })
    .default({
      accent: "#2f5be9",
      fonts: {
        display: "bricolage-grotesque",
        body: "figtree",
        reading: "source-serif-4",
        mono: "jetbrains-mono",
      },
    }),
  layout: z
    .object({
      postList: z.enum(["grid-2", "grid-3", "list"]),
      sidebar: z.enum(["left", "right", "none"]),
      header: z.enum(["left", "center"]),
      featuredPost: z.boolean(),
    })
    .default({ postList: "grid-2", sidebar: "right", header: "left", featuredPost: true }),
  postsPerPage: z.int().min(3).max(30).default(9),
  /** Une page d'étiquette avec moins d'articles que ce seuil passe en noindex. */
  tagIndexThreshold: z.int().min(1).default(3),
  routes: z
    .object({
      category: slug,
      tag: slug,
      author: slug,
      search: slug,
      page: slug,
    })
    .default({
      category: "categorie",
      tag: "tag",
      author: "auteur",
      search: "recherche",
      page: "page",
    }),
  /** Clé IndexNow (8 à 128 caractères hexadécimaux), servie à /<clé>.txt. */
  indexNowKey: z
    .string()
    .regex(/^[a-f0-9]{8,128}$/)
    .optional(),
});

export type SiteConfigInput = z.input<typeof siteConfigSchema>;
export type SiteConfig = z.output<typeof siteConfigSchema>;
export type Author = SiteConfig["authors"][number];
export type Category = SiteConfig["categories"][number];
export type NavLink = SiteConfig["nav"][number];

/** Aide au typage du fichier site.config.ts d'un site. */
export const defineSiteConfig = (config: SiteConfigInput): SiteConfigInput => config;

export const parseSiteConfig = (input: SiteConfigInput): SiteConfig => {
  const result = siteConfigSchema.safeParse(input);
  if (result.success) return result.data;
  const issues = result.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(racine)"} : ${issue.message}`)
    .join("\n");
  throw new Error(`site.config.ts invalide :\n${issues}`);
};
