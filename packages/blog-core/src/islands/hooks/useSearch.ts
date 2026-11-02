import { useEffect, useState } from "react";

export interface SearchResult {
  readonly url: string;
  readonly title: string;
  readonly excerpt: string;
}

export type SearchStatus = "idle" | "loading" | "ready" | "unavailable";

interface PagefindResultData {
  readonly url: string;
  readonly excerpt: string;
  readonly meta: { readonly title?: string };
}

interface PagefindModule {
  readonly search: (query: string) => Promise<{
    readonly results: readonly { readonly data: () => Promise<PagefindResultData> }[];
  } | null>;
}

const isPagefindModule = (value: unknown): value is PagefindModule =>
  typeof value === "object" &&
  value !== null &&
  "search" in value &&
  typeof value.search === "function";

const PAGEFIND_URL = "/pagefind/pagefind.js";
const MAX_RESULTS = 10;
const DEBOUNCE_MS = 200;

const loader: { module?: Promise<PagefindModule | null> } = {};

/** Charge Pagefind à la première recherche seulement (aucun JS tant qu'on ne tape pas). */
const loadPagefind = (): Promise<PagefindModule | null> => {
  loader.module ??= import(/* @vite-ignore */ PAGEFIND_URL).then(
    (mod: unknown) => (isPagefindModule(mod) ? mod : null),
    () => null,
  );
  return loader.module;
};

export const useSearch = (
  query: string,
): { status: SearchStatus; results: readonly SearchResult[] } => {
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [results, setResults] = useState<readonly SearchResult[]>([]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setStatus("idle");
      setResults([]);
      return undefined;
    }

    const controller = new AbortController();
    setStatus("loading");
    const timer = window.setTimeout(async () => {
      const pagefind = await loadPagefind();
      if (!pagefind) {
        setStatus("unavailable");
        return;
      }
      const response = await pagefind.search(term);
      const data = await Promise.all(
        (response?.results ?? []).slice(0, MAX_RESULTS).map((result) => result.data()),
      );
      if (controller.signal.aborted) return;
      setResults(
        data.map((d) => ({ url: d.url, title: d.meta.title ?? d.url, excerpt: d.excerpt })),
      );
      setStatus("ready");
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  return { status, results };
};
