/**
 * Bouton « revenir en haut » : apparaît une fois le seuil de défilement
 * dépassé (data-visible) et ramène la page en haut au clic, en respectant
 * la préférence de mouvement réduit.
 */
export const initBackToTop = (button: HTMLButtonElement, threshold = 400): void => {
  const sync = () => {
    button.dataset["visible"] = String(window.scrollY > threshold);
  };

  window.addEventListener("scroll", sync, { passive: true });
  sync();

  button.addEventListener("click", () => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
};
