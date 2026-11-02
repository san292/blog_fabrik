---
title: "Tester le comportement avec RTL et MSW, pas le code"
description: "Des requêtes par rôle, des données mockées au niveau réseau et des tests courts qui survivent aux refactorings de vos composants React."
pubDate: 2026-09-15
category: tests
tags: ["testing library", "msw"]
cover: ./covers/tester-comportement-rtl-msw.jpg
coverAlt: "Cercles roses concentriques évoquant une cible de test"
---

Un bon test casse quand le comportement change, pas quand on renomme une variable. React Testing Library et MSW poussent naturellement dans cette direction.

## Chercher par rôle

`getByRole("button", { name: /s'inscrire/i })` teste ce que voit l'utilisateur, et vérifie l'accessibilité au passage : un bouton sans nom accessible fait échouer le test.

## Mocker le réseau

MSW intercepte les requêtes au niveau réseau. Le composant ne sait pas qu'il est testé, et les tests ne cassent pas quand le client HTTP change.

```ts
const server = setupServer(
  http.get("/api/posts", () => HttpResponse.json([{ id: "1", title: "Hooks" }])),
);
```

## Des tests courts

Un test, un comportement. Arrange, act, assert, en moins de quinze lignes. Si un test demande trente lignes de préparation, le composant fait probablement trop de choses.

## Ce qu'on ne teste pas

Les détails internes : l'état d'un hook, le nombre de rendus, le nom d'une classe CSS. Ils changeront, et le test avec eux, sans que l'utilisateur ne voie la différence.
