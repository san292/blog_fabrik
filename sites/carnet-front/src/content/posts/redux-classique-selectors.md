---
title: "Redux classique en 2026 : selectors et state minimal"
description: "Pas de Redux Toolkit, pas de magie : des reducers purs, des selectors composés et un store qui ne stocke que l'essentiel de votre application."
pubDate: 2026-09-30
category: react
tags: ["redux", "architecture"]
cover: ./covers/redux-classique-selectors.jpg
coverAlt: "Points violets dispersés évoquant un état applicatif"
---

Redux classique reste un excellent choix quand l'équipe veut un flux explicite et lisible. La condition : un store minimal et des selectors bien conçus.

## Stocker moins

Tout ce qui se dérive se calcule dans un selector. Le store garde les entités normalisées et les identifiants sélectionnés, rien de plus.

## Composer les selectors

```ts
const selectPostsById = (s: RootState) => s.posts.byId;
const selectFilter = (s: RootState) => s.ui.filter;
const selectVisible = createSelector([selectPostsById, selectFilter], filterPosts);
```

La mémoïsation évite les rendus inutiles : le composant ne se met à jour que si le résultat change réellement.

## Pas d'effets dans les reducers

Les appels API vivent dans un middleware ou dans un hook. Le reducer reste une fonction pure, testable en une ligne : un état et une action en entrée, un état en sortie.

## Local d'abord

Avant d'ajouter une clé au store, une question : un autre écran en a-t-il besoin ? Si non, `useState` ou `useReducer` dans le composant suffit.
