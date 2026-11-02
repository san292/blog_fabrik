---
title: "MUI sans alourdir le bundle : imports et îlots client"
description: "Imports par chemin, thème créé une seule fois et composants client limités aux zones interactives : garder MUI sans sacrifier les Core Web Vitals."
pubDate: 2026-08-25
category: performance
tags: ["mui", "bundle"]
cover: ./covers/mui-bundle-leger.jpg
coverAlt: "Points violets dispersés évoquant des modules JavaScript"
---

MUI accélère le développement, mais chaque composant hydraté coûte du JavaScript. La clé : savoir où il est vraiment utile.

## Mesurer d'abord

L'analyse du bundle montre souvent qu'une icône importée depuis l'index tire des centaines de Ko. L'import par chemin règle le problème.

```ts
import SearchIcon from "@mui/icons-material/Search";
```

## Créer le thème une fois

Le thème se crée au niveau module, pas dans un composant. Sinon, il est recalculé à chaque rendu.

## Isoler le client

Le layout et la typographie restent rendus côté serveur, sans JavaScript. MUI ne s'hydrate que dans les zones interactives : menu, recherche, formulaires.

## Quand s'en passer

Pour un site de contenu comme un blog, des styles CSS natifs et quelques îlots React légers suffisent souvent. Le gain sur l'INP est mesurable, surtout sur mobile.
