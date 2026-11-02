---
title: "Tokens de couleur conformes AA en thème clair et sombre"
description: "Construire une palette claire et sombre à partir de tokens nommés par rôle, avec un ratio de contraste vérifié pour chaque paire de couleurs."
pubDate: 2026-09-01
category: accessibilite
tags: ["design tokens", "contraste"]
cover: ./covers/tokens-couleur-contraste-aa.jpg
coverAlt: "Barres jaunes et blanches illustrant des niveaux de contraste"
---

Un thème sombre réussi ne s'obtient pas en inversant les couleurs. Il se construit à partir de tokens nommés par rôle.

## Nommer par rôle

`--fg`, `--muted`, `--accent` plutôt que `--blue-500`. Le thème sombre redéfinit les rôles, jamais les composants.

```css
:root {
  --bg: #f6f7f9;
  --fg: #14161b;
  --muted: #555b67;
}
:root[data-theme="dark"] {
  --bg: #0f1115;
  --fg: #e8eaee;
  --muted: #a1a8b4;
}
```

## Vérifier chaque paire

Texte courant à 4,5:1 minimum, texte large à 3:1, éléments d'interface à 3:1. La couleur d'accent est souvent celle qui échoue en thème sombre : prévoyez une variante plus claire.

## Automatiser

Un test unitaire parcourt les paires de tokens et calcule leur ratio. Une couleur non conforme fait échouer la CI avant d'arriver en production.

## Respecter le choix du système

Sans préférence enregistrée, le site suit `prefers-color-scheme`. Un petit script en tête de page applique le choix mémorisé avant le premier affichage, pour éviter le flash.
