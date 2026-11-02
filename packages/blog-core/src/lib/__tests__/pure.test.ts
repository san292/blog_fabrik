import { describe, expect, it } from "vitest";
import { chunk, pagePath, paginationInfo, pickRelated, tocItems } from "../pure.ts";

describe("pagination", () => {
  it("garde la page 1 sur l'URL de base", () => {
    expect(pagePath("/categorie/react/", 1, "page")).toBe("/categorie/react/");
    expect(pagePath("/categorie/react/", 3, "page")).toBe("/categorie/react/page/3/");
  });

  it("renvoie une page vide plutôt qu'aucune page", () => {
    expect(chunk([], 9)).toEqual([[]]);
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("calcule les liens précédent et suivant", () => {
    const info = paginationInfo("/", 2, 3, "page");
    expect(info.prevPath).toBe("/");
    expect(info.nextPath).toBe("/page/3/");
    expect(info.pages.map((p) => p.path)).toEqual(["/", "/page/2/", "/page/3/"]);
  });
});

describe("pickRelated", () => {
  const post = (id: string, category: string, tags: string[], day: number) => ({
    id,
    category,
    tags,
    date: new Date(Date.UTC(2026, 9, day)),
  });

  it("favorise la catégorie et les étiquettes communes, puis la fraîcheur", () => {
    const target = post("a", "react", ["hooks"], 10);
    const all = [
      target,
      post("b", "perf", [], 20),
      post("c", "react", [], 5),
      post("d", "perf", ["hooks"], 1),
      post("e", "react", ["hooks"], 2),
    ];
    expect(pickRelated(target, all, 3).map((p) => p.id)).toEqual(["e", "c", "d"]);
  });
});

describe("tocItems", () => {
  it("ne garde que les niveaux 2 et 3", () => {
    const items = tocItems([
      { depth: 1, slug: "a", text: "A" },
      { depth: 2, slug: "b", text: "B" },
      { depth: 3, slug: "c", text: "C" },
      { depth: 4, slug: "d", text: "D" },
    ]);
    expect(items.map((i) => i.slug)).toEqual(["b", "c"]);
  });
});
