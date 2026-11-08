/**
 * Surligne dans le sommaire le lien de la section actuellement à l'écran.
 * Observe les titres ciblés par les liens du TOC via IntersectionObserver et
 * pose `aria-current="true"` sur le lien de la dernière section entrée en vue.
 * Sans IntersectionObserver ou sans lien, ne fait rien (le TOC reste cliquable).
 */
export const initScrollspy = (toc: HTMLElement): void => {
  if (typeof IntersectionObserver === "undefined") return;

  const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>("a[href^='#']"));
  if (links.length === 0) return;

  const byId = new Map<string, HTMLAnchorElement>();
  const targets: Element[] = [];
  for (const link of links) {
    const id = decodeURIComponent(link.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target) continue;
    byId.set(id, link);
    targets.push(target);
  }
  if (targets.length === 0) return;

  const visible = new Set<string>();

  const highlight = () => {
    let current: string | null = null;
    for (const target of targets) {
      if (visible.has(target.id)) {
        current = target.id;
        break;
      }
    }
    for (const [id, link] of byId) {
      if (id === current) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      highlight();
    },
    { rootMargin: "0px 0px -70% 0px", threshold: 0 },
  );

  for (const target of targets) observer.observe(target);
};
