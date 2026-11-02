---
title: "Zéro any : typer une API de blog de bout en bout"
description: "Un DTO Nest.js validé, un type partagé côté front et une garde à l'exécution : le contrat d'API ne ment plus, du serveur jusqu'au composant."
pubDate: 2026-09-08
category: typescript
tags: ["types", "api"]
cover: ./covers/zero-any-api-typee.jpg
coverAlt: "Grille de carrés bleus évoquant un contrat de données"
---

`any` est une dette qui se paie toujours en production. Sur une API de blog, trois couches suffisent à garantir un contrat fiable.

## Une seule source de vérité

Le DTO côté serveur est la référence. Le front importe le type depuis un paquet partagé du monorepo, au lieu de le réécrire à la main.

```ts
export class PostDto {
  @IsString() @Length(20, 60) title!: string;
  @IsString() @Length(120, 160) description!: string;
  @IsDateString() pubDate!: string;
}
```

## Valider à la frontière

class-validator côté serveur, une garde légère côté client pour les données qui viennent de l'extérieur. `unknown` plutôt que `any`, toujours : on est obligé de vérifier avant d'utiliser.

## Laisser le compilateur travailler

`strict`, `noUncheckedIndexedAccess` et `exactOptionalPropertyTypes` attrapent les erreurs qu'aucun test n'aurait vues : un tableau vide, un champ optionnel oublié.

## Le bénéfice

Quand le serveur change un champ, le front ne compile plus. L'erreur arrive à la revue de code, pas chez l'utilisateur.
