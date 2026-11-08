import { beforeEach, describe, expect, it, vi } from "vitest";
import { initBackToTop } from "../back-to-top.ts";

const setScroll = (y: number) => {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  window.dispatchEvent(new Event("scroll"));
};

beforeEach(() => {
  setScroll(0);
  document.body.innerHTML = `<button type="button" data-back-to-top data-visible="false">↑</button>`;
});

describe("initBackToTop", () => {
  it("révèle le bouton une fois le seuil de défilement dépassé", () => {
    const button = document.querySelector<HTMLButtonElement>("[data-back-to-top]");
    if (!button) throw new Error("fixture invalide");
    initBackToTop(button, 400);

    expect(button.dataset["visible"]).toBe("false");
    setScroll(500);
    expect(button.dataset["visible"]).toBe("true");
  });

  it("masque de nouveau le bouton quand on remonte sous le seuil", () => {
    const button = document.querySelector<HTMLButtonElement>("[data-back-to-top]");
    if (!button) throw new Error("fixture invalide");
    initBackToTop(button, 400);

    setScroll(500);
    setScroll(100);
    expect(button.dataset["visible"]).toBe("false");
  });

  it("remonte en haut de page au clic", () => {
    const button = document.querySelector<HTMLButtonElement>("[data-back-to-top]");
    if (!button) throw new Error("fixture invalide");
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    initBackToTop(button, 400);

    button.click();
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
  });
});
