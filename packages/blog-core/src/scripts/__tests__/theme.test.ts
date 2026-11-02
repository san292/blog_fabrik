import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { initThemeToggle } from "../theme.ts";

const mount = () => {
  document.body.innerHTML = `<button type="button" aria-pressed="false" aria-label="Thème sombre">☾</button>`;
  const button = document.querySelector("button");
  if (!button) throw new Error("fixture invalide");
  initThemeToggle(button);
  return screen.getByRole("button", { name: "Thème sombre" });
};

beforeEach(() => {
  window.localStorage.clear();
});

describe("initThemeToggle", () => {
  it("bascule en sombre, met à jour <html> et mémorise le choix", async () => {
    const button = mount();
    expect(button).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.dataset["theme"]).toBe("dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");
  });

  it("reprend le thème déjà appliqué par le script en tête de page", () => {
    document.documentElement.dataset["theme"] = "dark";
    expect(mount()).toHaveAttribute("aria-pressed", "true");
  });
});
