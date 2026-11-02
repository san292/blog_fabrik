import { defineSiteConfig } from "@blog-factory/core/config";

/**
 * Configuration du site. Le build échoue avec un message clair si une valeur
 * ne respecte pas les garde-fous SEO (longueur des descriptions, slugs…).
 */
export default defineSiteConfig({
  name: "__SITE_NAME__",
  tagline: "Remplacez cette phrase par la promesse du blog, en une ligne.",
  description:
    "Décrivez la niche du blog en une à deux phrases : sujet, public visé et ce que le lecteur y trouve. Entre 70 et 160 caractères.",
  url: "https://__SITE_DOMAIN__",
  lang: "__SITE_LANG__",
  locale: "__SITE_LOCALE__",
  logoMark: "__SITE_MARK__",
  publisher: { name: "__SITE_NAME__" },
  authors: [
    {
      slug: "auteur",
      name: "Prénom Nom",
      role: "Votre rôle ou expertise",
      bio: "Bio de l'auteur : expérience concrète sur le sujet, années de pratique, projets menés. C'est un signal de confiance important pour Google.",
      sameAs: [],
    },
  ],
  categories: [
    {
      slug: "general",
      label: "Général",
      description:
        "Présentez la catégorie comme une page pilier : ce qu'elle couvre et pour qui. Ce texte sert aussi de meta description.",
    },
  ],
  theme: {
    accent: "__SITE_ACCENT__",
    fonts: {
      display: "bricolage-grotesque",
      body: "figtree",
      reading: "source-serif-4",
      mono: "jetbrains-mono",
    },
  },
  layout: { postList: "grid-2", sidebar: "right", header: "left", featuredPost: true },
});
