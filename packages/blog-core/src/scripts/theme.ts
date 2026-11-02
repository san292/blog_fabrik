export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "theme";

export const currentTheme = (root: HTMLElement = document.documentElement): Theme => {
  const attr = root.dataset["theme"];
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const persist = (theme: Theme): void => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Stockage indisponible (navigation privée) : le choix reste valable pour la page.
  }
};

/** Bouton clair/sombre : synchronise <html data-theme>, aria-pressed et le stockage local. */
export const initThemeToggle = (
  button: HTMLButtonElement,
  root: HTMLElement = document.documentElement,
): void => {
  const sync = () => button.setAttribute("aria-pressed", String(currentTheme(root) === "dark"));
  sync();
  button.addEventListener("click", () => {
    const next: Theme = currentTheme(root) === "dark" ? "light" : "dark";
    root.dataset["theme"] = next;
    persist(next);
    sync();
  });
};
