---
title: "Gagner 900 ms de LCP avec next/image sur un blog"
description: "Priorité sur l'image à la une, attribut sizes exact et format AVIF : trois réglages next/image mesurés avant et après sur une page de blog."
pubDate: 2026-10-14
category: performance
tags: ["core web vitals", "images"]
cover: ./covers/lcp-images-next.jpg
coverAlt: "Histogramme orange représentant des mesures de performance"
---

Sur mobile 4G, la page article affichait un LCP de 3,4 secondes. L'élément le plus lourd était l'image à la une : 480 Ko, chargée après les polices.

## Mesurer avant de toucher

On part d'un rapport Lighthouse en mode mobile et des données terrain de la Search Console. Le LCP de laboratoire donne la tendance, le terrain donne la vérité.

## Trois réglages

Le premier est `priority` sur l'image au-dessus de la ligne de flottaison : elle passe en `fetchpriority="high"` et n'est plus chargée en différé.

Le deuxième est un attribut `sizes` qui reflète la vraie grille. Sans lui, le navigateur télécharge souvent la plus grande variante.

```tsx
<Image src={post.cover} alt={post.coverAlt} priority sizes="(max-width: 960px) 100vw, 760px" />
```

Le troisième est le format AVIF servi par défaut, avec WebP en repli.

## Résultat

LCP à 2,5 secondes, sans toucher au design. Le reste du gain viendra du préchargement des polices et de la suppression d'un script tiers.

## À retenir

Une seule image prioritaire par page. Si tout est prioritaire, rien ne l'est.
