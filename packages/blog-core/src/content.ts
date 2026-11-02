import { glob } from "astro/loaders";
import { z } from "astro/zod";
import type { SchemaContext } from "astro:content";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Garde-fous SEO : le build échoue si un article ne les respecte pas. */
const seoTitle = z
  .string()
  .min(20, { message: "Titre trop court (20 caractères minimum)." })
  .max(60, { message: "Titre trop long : 60 caractères maximum pour éviter la troncature." });

const seoDescription = z
  .string()
  .min(120, { message: "Meta description trop courte (120 caractères minimum)." })
  .max(160, { message: "Meta description trop longue (160 caractères maximum)." });

export const postSchema = ({ image }: SchemaContext) =>
  z.object({
    title: seoTitle,
    description: seoDescription,
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Slug d'une catégorie déclarée dans site.config.ts. */
    category: z.string().regex(slugPattern),
    tags: z.array(z.string().min(2)).max(8).default([]),
    /** Slug d'un auteur déclaré dans site.config.ts ; par défaut le premier. */
    author: z.string().regex(slugPattern).optional(),
    cover: image(),
    coverAlt: z
      .string()
      .min(10, { message: "Texte alternatif de la cover obligatoire (10 caractères min)." }),
    draft: z.boolean().default(false),
    noindex: z.boolean().default(false),
    /** URL canonique externe si l'article est republié ailleurs en premier. */
    canonical: z.url().optional(),
  });

export const pageSchema = z.object({
  title: z.string().min(5).max(60),
  description: z.string().min(70).max(160),
  updatedDate: z.coerce.date().optional(),
  noindex: z.boolean().default(false),
  /** Afficher le lien dans le pied de page. */
  footer: z.boolean().default(true),
});

/** Articles : src/content/posts/<slug>.md(x). Le nom du fichier devient l'URL. */
export const postsLoader = () => glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" });

/** Pages fixes : à propos, contact, mentions légales… */
export const pagesLoader = () => glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" });
