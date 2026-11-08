import { describe, expect, it } from "vitest";
import { buildPageMeta, formatTitle } from "../meta.ts";
import type { MetaTag, SeoSite } from "../types.ts";

const site: SeoSite = {
  name: "Guide numérique",
  url: "https://carnet-front.fr",
  lang: "fr",
  locale: "fr_FR",
};
const find = (meta: readonly MetaTag[], key: string): string | undefined =>
  meta.find((m) => m.key === key)?.content;

describe("formatTitle", () => {
  it("ajoute le nom du site après le titre", () => {
    expect(formatTitle("Mon article", "Guide numérique")).toBe("Mon article | Guide numérique");
  });
  it("garde le nom seul sur l'accueil", () => {
    expect(formatTitle("Guide numérique", "Guide numérique")).toBe("Guide numérique");
  });
});

describe("buildPageMeta", () => {
  it("produit une canonical absolue avec slash final", () => {
    const meta = buildPageMeta({ site, title: "A", description: "B", path: "/mon-article" });
    expect(meta.canonical).toBe("https://carnet-front.fr/mon-article/");
    expect(meta.links[0]).toEqual({ rel: "canonical", href: meta.canonical });
  });

  it("indexe par défaut et passe en noindex sur demande", () => {
    expect(buildPageMeta({ site, title: "A", description: "B", path: "/" }).robots).toMatch(
      /^index/,
    );
    expect(
      buildPageMeta({ site, title: "A", description: "B", path: "/", noindex: true }).robots,
    ).toBe("noindex, follow");
  });

  it("ajoute les balises article et une image absolue", () => {
    const meta = buildPageMeta({
      site,
      title: "Hooks",
      description: "Desc",
      path: "/hooks/",
      type: "article",
      image: { url: "/og/hooks.png", width: 1200, height: 630, alt: "Hooks" },
      publishedTime: new Date("2026-10-21T00:00:00Z"),
      tags: ["react", "hooks"],
    }).meta;

    expect(find(meta, "og:image")).toBe("https://carnet-front.fr/og/hooks.png");
    expect(find(meta, "twitter:card")).toBe("summary_large_image");
    expect(find(meta, "article:modified_time")).toBe("2026-10-21T00:00:00.000Z");
    expect(meta.filter((m) => m.key === "article:tag")).toHaveLength(2);
  });

  it("ajoute twitter:creator sur un article quand l'auteur a un handle", () => {
    const meta = buildPageMeta({
      site,
      title: "Hooks",
      description: "Desc",
      path: "/hooks/",
      type: "article",
      publishedTime: new Date("2026-10-21T00:00:00Z"),
      authorTwitter: "@alaindo",
    }).meta;
    expect(find(meta, "twitter:creator")).toBe("@alaindo");
  });

  it("n'ajoute pas twitter:creator hors article ou sans handle", () => {
    const sansHandle = buildPageMeta({
      site,
      title: "Hooks",
      description: "Desc",
      path: "/hooks/",
      type: "article",
      publishedTime: new Date("2026-10-21T00:00:00Z"),
    }).meta;
    expect(find(sansHandle, "twitter:creator")).toBeUndefined();

    const page = buildPageMeta({
      site,
      title: "A",
      description: "B",
      path: "/",
      authorTwitter: "@alaindo",
    }).meta;
    expect(find(page, "twitter:creator")).toBeUndefined();
  });

  it("ajoute les liens prev et next de pagination", () => {
    const { links } = buildPageMeta({
      site,
      title: "A",
      description: "B",
      path: "/page/2/",
      prevPath: "/",
      nextPath: "/page/3/",
    });
    expect(links.map((l) => l.rel)).toEqual(["canonical", "prev", "next"]);
  });
});
