import { describe, expect, it } from "vitest";
import { blogPostingLd, breadcrumbLd, ldGraph, personLd, serializeJsonLd } from "../jsonld.ts";
import type { SeoAuthor, SeoSite } from "../types.ts";

const site: SeoSite = {
  name: "Guide numérique",
  url: "https://carnet-front.fr",
  lang: "fr",
  locale: "fr_FR",
};
const author: SeoAuthor = { name: "Alain Do", url: "/auteur/alain-do/" };

describe("blogPostingLd", () => {
  const ld = blogPostingLd({
    site,
    path: "/hooks/",
    title: "Hooks",
    description: "Desc",
    image: { url: "/og/hooks.png", width: 1200, height: 630, alt: "" },
    published: new Date("2026-10-21T00:00:00Z"),
    author,
    tags: ["react"],
  });

  it("référence l'auteur et l'éditeur par @id", () => {
    expect(ld["author"]).toEqual({ "@id": "https://carnet-front.fr/auteur/alin-do/#person" });
    expect(ld["publisher"]).toEqual({ "@id": "https://carnet-front.fr/#publisher" });
  });

  it("utilise la date de publication comme dateModified par défaut", () => {
    expect(ld["dateModified"]).toBe(ld["datePublished"]);
  });

  it("omet les champs vides", () => {
    expect(ld).not.toHaveProperty("articleSection");
  });
});

describe("breadcrumbLd", () => {
  it("numérote les éléments à partir de 1", () => {
    const ld = breadcrumbLd(
      [
        { name: "Accueil", path: "/" },
        { name: "React", path: "/categorie/react/" },
      ],
      site,
    );
    expect(ld["itemListElement"]).toEqual([
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://carnet-front.fr/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "React",
        item: "https://carnet-front.fr/categorie/react/",
      },
    ]);
  });
});

describe("serializeJsonLd", () => {
  it("échappe les chevrons pour éviter de fermer la balise script", () => {
    const out = serializeJsonLd(ldGraph(personLd({ name: "</script><b>", url: "/a/" }, site)));
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out)["@graph"][0].name).toBe("</script><b>");
  });
});
