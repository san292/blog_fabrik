import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { initDisclosure } from "../disclosure.ts";

const labels = { open: "Ouvrir le menu", close: "Fermer le menu" };

beforeEach(() => {
  document.body.innerHTML = `
    <button type="button" aria-expanded="false" aria-label="Ouvrir le menu">≡</button>
    <div data-open="false"><nav><a href="/">Accueil</a><a href="/categorie/react/">React</a></nav></div>
    <p>Contenu</p>`;
  const trigger = document.querySelector("button");
  const panel = document.querySelector("div");
  if (!trigger || !panel) throw new Error("fixture invalide");
  initDisclosure(trigger, panel, labels);
});

describe("initDisclosure", () => {
  it("ouvre le menu et place le focus sur le premier lien", async () => {
    await userEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    expect(screen.getByRole("button", { name: "Fermer le menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("link", { name: "Accueil" })).toHaveFocus();
  });

  it("se ferme avec Échap et rend le focus au bouton", async () => {
    await userEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    await userEvent.keyboard("{Escape}");
    const button = screen.getByRole("button", { name: "Ouvrir le menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
  });

  it("se ferme au clic en dehors du panneau", async () => {
    await userEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    await userEvent.click(screen.getByText("Contenu"));
    expect(screen.getByRole("button", { name: "Ouvrir le menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
