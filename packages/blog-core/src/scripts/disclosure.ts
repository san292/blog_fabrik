export interface DisclosureLabels {
  readonly open: string;
  readonly close: string;
}

/**
 * Menu repliable accessible : aria-expanded, focus sur le premier lien à
 * l'ouverture, fermeture par Échap ou clic extérieur avec retour du focus.
 */
export const initDisclosure = (
  trigger: HTMLButtonElement,
  panel: HTMLElement,
  labels: DisclosureLabels,
): void => {
  const isOpen = () => trigger.getAttribute("aria-expanded") === "true";

  const setOpen = (open: boolean) => {
    trigger.setAttribute("aria-expanded", String(open));
    trigger.setAttribute("aria-label", open ? labels.close : labels.open);
    panel.dataset["open"] = String(open);
    if (open) panel.querySelector<HTMLElement>("a, button")?.focus();
  };

  trigger.addEventListener("click", () => setOpen(!isOpen()));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isOpen()) return;
    setOpen(false);
    trigger.focus();
  });

  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!isOpen() || !(target instanceof Node)) return;
    if (panel.contains(target) || trigger.contains(target)) return;
    setOpen(false);
  });
};
