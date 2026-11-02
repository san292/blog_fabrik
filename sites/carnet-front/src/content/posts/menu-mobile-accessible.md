---
title: "Un menu mobile vraiment accessible au clavier"
description: "aria-expanded, gestion du focus, touche Échap et retour au bouton déclencheur : les quatre points qu'on oublie toujours sur un menu mobile."
pubDate: 2026-10-07
category: accessibilite
tags: ["clavier", "aria"]
cover: ./covers/menu-mobile-accessible.jpg
coverAlt: "Grille de carrés verts évoquant une navigation structurée"
---

Un menu burger qui s'ouvre à la souris n'est pas un menu accessible. Au clavier et au lecteur d'écran, quatre détails font toute la différence.

## Annoncer l'état

Le bouton porte `aria-expanded` et pointe vers le panneau avec `aria-controls`. Son libellé change entre « Ouvrir le menu » et « Fermer le menu ».

## Déplacer le focus

À l'ouverture, le focus va sur le premier lien. Sans ça, l'utilisateur clavier doit tabuler à travers toute la page avant d'atteindre le menu.

## Échap et clic extérieur

Deux écouteurs, ajoutés seulement quand le menu est ouvert, et nettoyés dans le retour du `useEffect`.

```tsx
useEffect(() => {
  if (!open) return undefined;
  const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
  document.addEventListener("keydown", onKey);
  return () => document.removeEventListener("keydown", onKey);
}, [open, close]);
```

## Rendre le focus

À la fermeture par Échap, le focus revient sur le bouton déclencheur. C'est le point le plus souvent oublié, et le plus désorientant pour l'utilisateur.

## Côté SEO

Les liens du menu doivent exister dans le HTML initial, même menu fermé. Un menu rendu uniquement en JavaScript prive les robots de votre maillage principal.
