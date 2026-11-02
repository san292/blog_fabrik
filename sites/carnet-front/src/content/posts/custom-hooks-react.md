---
title: "Custom hooks React : extraire la logique sans monstres"
description: "Un hook par responsabilité, une API de retour stable et des dépendances explicites : la règle simple qui garde vos composants React lisibles."
pubDate: 2026-10-21
category: react
tags: ["hooks", "architecture"]
cover: ./covers/custom-hooks-react.jpg
coverAlt: "Cercles concentriques bleus symbolisant des couches de logique"
---

Un composant de 300 lignes qui mélange fetch, filtrage, pagination et rendu finit toujours par casser au mauvais endroit. Chaque modification touche trois responsabilités, et les tests deviennent impossibles à écrire sans tout mocker.

## Le symptôme

On le reconnaît vite : des `useEffect` enchaînés, des états dérivés stockés dans `useState`, et un JSX qui contient des conditions sur quatre niveaux. La logique et la vue sont mélangées.

## Une responsabilité par hook

On sépare la récupération des données, la dérivation et l'état d'interface. Chaque hook renvoie un objet typé et nommé.

```tsx
const { posts, status } = usePosts(category);
const visible = useFilteredPosts(posts, query);
const page = usePagination(visible, 6);
```

Le composant ne fait plus qu'assembler. Il se lit en dix secondes, et chaque hook se teste seul.

## Stabiliser l'API

Les callbacks exposés passent par `useCallback` et les valeurs dérivées par `useMemo`. Le composant consommateur peut alors être mémoïsé sans surprise, et les dépendances des effets restent courtes.

### Nommer le retour

Un objet nommé (`{ posts, status }`) vieillit mieux qu'un tableau positionnel. On peut ajouter un champ sans casser les appels existants.

## Quand s'arrêter

Si un hook n'est utilisé qu'une fois et ne fait que trois lignes, il reste dans le composant. Extraire pour extraire, c'est déplacer la complexité sans la réduire. La bonne question : est-ce que ce hook a un nom métier clair ?
