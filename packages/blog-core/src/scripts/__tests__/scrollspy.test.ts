import { beforeEach, describe, expect, it, vi } from "vitest";
import { initScrollspy } from "../scrollspy.ts";

interface FakeObserver {
  callback: IntersectionObserverCallback;
  observed: Element[];
}

const observers: FakeObserver[] = [];

// N'émet que les entrées fournies (comme un vrai observer: seules les cibles
// dont l'intersection change déclenchent le callback).
const fire = (
  observer: FakeObserver,
  changes: ReadonlyArray<{ id: string; visible: boolean }>,
) => {
  const entries = changes.map(({ id, visible }) => {
    const target = observer.observed.find((el) => el.id === id);
    if (!target) throw new Error(`cible absente: ${id}`);
    return {
      target,
      isIntersecting: visible,
      intersectionRatio: visible ? 1 : 0,
    };
  }) as unknown as IntersectionObserverEntry[];
  observer.callback(entries, {} as IntersectionObserver);
};

beforeEach(() => {
  observers.length = 0;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      callback: IntersectionObserverCallback;
      observed: Element[] = [];
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        observers.push(this);
      }
      observe(target: Element) {
        this.observed.push(target);
      }
      disconnect() {
        this.observed = [];
      }
      unobserve() {}
      takeRecords() {
        return [];
      }
    },
  );

  document.body.innerHTML = `
    <nav class="toc">
      <ol>
        <li><a href="#intro">Intro</a></li>
        <li><a href="#usage">Usage</a></li>
        <li><a href="#fin">Fin</a></li>
      </ol>
    </nav>
    <article>
      <h2 id="intro">Intro</h2>
      <h2 id="usage">Usage</h2>
      <h2 id="fin">Fin</h2>
    </article>`;
});

describe("initScrollspy", () => {
  it("marque le lien de la section visible comme actif", () => {
    const toc = document.querySelector<HTMLElement>(".toc");
    if (!toc) throw new Error("fixture invalide");
    initScrollspy(toc);

    fire(observers[0]!, [{ id: "usage", visible: true }]);

    const active = toc.querySelectorAll("a[aria-current='true']");
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveAttribute("href", "#usage");
  });

  it("déplace l'état actif quand une autre section devient visible", () => {
    const toc = document.querySelector<HTMLElement>(".toc");
    if (!toc) throw new Error("fixture invalide");
    initScrollspy(toc);

    fire(observers[0]!, [{ id: "intro", visible: true }]);
    fire(observers[0]!, [
      { id: "intro", visible: false },
      { id: "fin", visible: true },
    ]);

    const active = toc.querySelectorAll("a[aria-current='true']");
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveAttribute("href", "#fin");
  });

  it("ne fait rien si le sommaire n'a aucun lien", () => {
    document.body.innerHTML = `<nav class="toc"><ol></ol></nav>`;
    const toc = document.querySelector<HTMLElement>(".toc");
    if (!toc) throw new Error("fixture invalide");
    expect(() => initScrollspy(toc)).not.toThrow();
    expect(observers).toHaveLength(0);
  });
});
