import { defineSiteConfig } from "@blog-factory/core/config";

export default defineSiteConfig({
  name: "Guide numérique",
  tagline: "Notes de terrain sur React, TypeScript et les interfaces qui tiennent en production.",
  description:
    "Guide numérique : articles pratiques sur React, TypeScript, la performance web, l'accessibilité et les tests, écrits par un développeur frontend.",
  url: "https://carnet-front.fr",
  lang: "fr",
  locale: "fr_FR",
  logoMark: "</>",
  publisher: { name: "Guide numérique" },
  authors: [
    {
      slug: "alain-do",
      name: "Alain Do",
      role: "Développeur frontend",
      bio: "Développeur frontend spécialisé React et TypeScript, il conçoit des applications de gestion de flotte et partage ici ce qui fonctionne vraiment en production.",
      sameAs: [],
    },
  ],
  categories: [
    {
      slug: "react",
      label: "React",
      description:
        "Hooks, architecture de composants et gestion d'état avec React : des patterns simples et maintenables pour les applications en production.",
    },
    {
      slug: "typescript",
      label: "TypeScript",
      description:
        "Typage strict, contrats d'API et zéro any : comment TypeScript sécurise une base de code frontend et fullstack au quotidien.",
    },
    {
      slug: "performance",
      label: "Performance",
      description:
        "Core Web Vitals, poids du bundle, images et polices : des mesures concrètes pour rendre une interface plus rapide.",
    },
    {
      slug: "accessibilite",
      label: "Accessibilité",
      description:
        "Navigation clavier, ARIA, contrastes et lecteurs d'écran : rendre une interface utilisable par tout le monde, sans surcoût.",
    },
    {
      slug: "nextjs",
      label: "Next.js",
      description:
        "App Router, rendu statique, ISR et SSR : choisir la bonne stratégie de rendu pour chaque page d'une application Next.js.",
    },
    {
      slug: "tests",
      label: "Tests",
      description:
        "Jest, Vitest, React Testing Library, MSW et Cypress : écrire des tests qui vérifient le comportement et survivent aux refactorings.",
    },
  ],
  theme: {
    accent: "#2f5be9",
    accentDark: "#6b8cff",
    fonts: {
      display: "bricolage-grotesque",
      body: "figtree",
      reading: "source-serif-4",
      mono: "jetbrains-mono",
    },
  },
  layout: { postList: "grid-2", sidebar: "left", header: "center", featuredPost: true },
  postsPerPage: 6,
});
