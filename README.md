# Blog Factory

Usine à blogs Astro orientée SEO : un thème partagé (`packages/blog-core`), une boîte à outils SEO testée (`packages/seo-kit`) et autant de sites que nécessaire dans `sites/`.

## Démarrage

```bash
corepack enable          # active pnpm (version fixée dans package.json)
pnpm install
pnpm --filter @sites/carnet-front dev     # http://localhost:4321
```

Node 22.23.4 ou plus récent (`.nvmrc`).

## Créer un nouveau blog

```bash
pnpm new-site mon-blog --domain mon-blog.fr --name "Mon Blog" --accent "#11795f"
pnpm install
pnpm --filter @sites/mon-blog dev
```

Le script copie `sites/_template`, remplace les valeurs et s'arrête si le dossier existe déjà (rien n'est écrasé). Ensuite :

1. Compléter `site.config.ts` : description, auteur (bio réelle), catégories (pages piliers).
2. Compléter les pages `src/content/pages/` (mentions légales obligatoires en France).
3. Écrire les articles dans `src/content/posts/` (Markdown ou MDX, cover à côté).

## Ce que chaque site reçoit automatiquement

| Domaine             | Détail                                                                                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Performance         | HTML statique, aucun framework JS sur les pages de contenu, polices auto-hébergées préchargées avec fallback métrique (CLS 0), images WebP responsives, image LCP prioritaire |
| Technique           | canonical, robots, sitemap avec vraies dates `lastmod`, RSS, robots.txt, slash final cohérent, pagination indexable, 404 utile                                                     |
| Données structurées | `WebSite`, `Organization`, `BlogPosting`, `Person`, `ProfilePage`, `BreadcrumbList`                                                                                                |
| Social              | Image Open Graph 1200×630 générée par article au build                                                                                                                             |
| Contenu             | Schéma Zod : titre ≤ 60, description 120–160, `alt` de cover, catégorie et auteur déclarés. Le build échoue sinon                                                                  |
| Maillage            | Fil d'Ariane, catégories piliers, articles liés, précédent/suivant, étiquettes (noindex sous 3 articles)                                                                           |
| E-E-A-T             | Pages auteur, encadré auteur, dates de publication et de mise à jour                                                                                                               |
| Qualité             | Vérification des liens internes cassés au build, index de recherche Pagefind                                                                                                       |

## Personnaliser un site

Dans `site.config.ts` :

- `theme.accent` / `theme.accentDark` : couleur d'accent par thème.
- `theme.fonts` : polices parmi `packages/blog-core/src/config/fonts.ts` (ajoutez-en un paquet `@fontsource-variable/*`).
- `layout` : `postList` (`grid-2`, `grid-3`, `list`), `sidebar` (`left`, `right`, `none`), `header` (`left`, `center`), `featuredPost`.
- `routes` : segments d'URL (`categorie`, `tag`, `auteur`, `recherche`, `page`).
- `indexNowKey` : active IndexNow (Bing, Yandex…).

## Commandes

| Commande                                 | Rôle                                                  |
| ---------------------------------------- | ----------------------------------------------------- |
| `pnpm build`                             | Build de tous les sites                               |
| `pnpm test`                              | Tests Vitest (seo-kit, blog-core)                     |
| `pnpm typecheck`                         | `tsc` et `astro check`                                |
| `pnpm lint` / `pnpm format`              | ESLint strict (zéro `any`) et Prettier                |
| `pnpm e2e`                               | Cypress sur le site buildé (`SITE=mon-blog pnpm e2e`) |
| `pnpm --filter @sites/<site> lighthouse` | Budget Lighthouse : échec sous 95 (100 en SEO)        |
| `pnpm indexnow <site>`                   | Notifie IndexNow après un déploiement                 |

## Déployer sur Vercel

Un projet Vercel par site :

1. Importer le dépôt, **Root Directory** = `sites/<site>`.
2. Les commandes d'install et de build sont dans `sites/<site>/vercel.json` (monorepo pnpm + Turborepo).
3. Ajouter le domaine, puis déclarer le sitemap dans Google Search Console et Bing Webmaster Tools.

## Architecture

```
packages/
  seo-kit/      fonctions pures : meta, JSON-LD, URL, temps de lecture (testées)
  blog-core/    intégration Astro : routes injectées, layouts, composants,
                scripts (thème, menu), îlot React de recherche, OG images,
                vérification des liens, index Pagefind
sites/
  _template/    squelette copié par `pnpm new-site`
  carnet-front/ site d'exemple
e2e/            tests Cypress
scripts/        new-site, indexnow
```

Un correctif dans `blog-core` profite à tous les sites au prochain build.
