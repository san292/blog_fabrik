import { describe, expect, it } from "vitest";
import { countWords, readingTime, slugify } from "../text.ts";

describe("slugify", () => {
  it("retire les accents et la ponctuation", () => {
    expect(slugify("Accessibilité & Tests !")).toBe("accessibilite-tests");
  });
});

describe("countWords", () => {
  it("ignore les blocs de code et garde le texte des liens", () => {
    expect(countWords("Un [lien utile](https://x.fr) ici\n```ts\nconst a = 1;\n```")).toBe(4);
  });
});

describe("readingTime", () => {
  it("renvoie au moins une minute", () => {
    expect(readingTime("court")).toBe(1);
  });
  it("arrondit au nombre de minutes le plus proche", () => {
    expect(readingTime(Array.from({ length: 690 }, () => "mot").join(" "))).toBe(3);
  });
});
