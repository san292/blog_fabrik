---
title: "SSG, ISR ou SSR : quel rendu pour chaque page d'un blog"
description: "L'accueil et les articles en statique revalidé, la recherche côté client : un tableau de décision simple pour choisir le rendu de chaque page."
pubDate: 2026-09-22
category: nextjs
tags: ["rendu", "app router"]
cover: ./covers/ssg-isr-ssr-blog.jpg
coverAlt: "Bandes diagonales bleues symbolisant des étapes de rendu"
---

Un blog n'a presque jamais besoin de rendu serveur à chaque requête. Le statique, éventuellement revalidé, couvre l'essentiel et donne les meilleurs temps de réponse.

## Articles

`generateStaticParams` pour les slugs connus et une revalidation à l'heure. Une nouvelle publication déclenche une revalidation ciblée de la page et de l'accueil.

## Archives et catégories

Même stratégie, avec la pagination dans l'URL (`/categorie/react/page/2/`) pour que chaque page soit indexable et partageable.

## Recherche

Un index statique généré au build et chargé à la demande. Aucun serveur sollicité pendant la saisie.

## Le tableau de décision

| Page      | Rendu     | Pourquoi              |
| --------- | --------- | --------------------- |
| Article   | SSG + ISR | Contenu stable, SEO   |
| Catégorie | SSG + ISR | Page pilier indexable |
| Recherche | Client    | Dépend de la saisie   |
| Compte    | SSR       | Données personnelles  |

## Et sans Next.js ?

Astro produit du HTML statique sans JavaScript par défaut. Pour un blog, c'est souvent la solution la plus rapide à servir.
