import { useCallback, useState, type ChangeEvent } from "react";
import { useSearch } from "./hooks/useSearch.ts";

export interface SearchLabels {
  readonly input: string;
  readonly placeholder: string;
  readonly loading: string;
  readonly empty: string;
  readonly unavailable: string;
  /** « {n} résultat » */
  readonly countOne: string;
  /** « {n} résultats » */
  readonly countMany: string;
}

export interface SearchProps {
  readonly labels: SearchLabels;
}

const readQueryParam = (): string => new URLSearchParams(window.location.search).get("q") ?? "";

/** Rendu uniquement côté client (client:only) : la page de recherche est en noindex. */
export const Search = ({ labels }: SearchProps) => {
  const [query, setQuery] = useState(readQueryParam);
  const { status, results } = useSearch(query);

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }, []);

  const countLabel = (results.length === 1 ? labels.countOne : labels.countMany).replace(
    "{n}",
    String(results.length),
  );

  return (
    <div className="search-page">
      <form className="search-form" role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="search-input" className="sr-only">
          {labels.input}
        </label>
        <input
          id="search-input"
          type="search"
          name="q"
          value={query}
          onChange={onChange}
          placeholder={labels.placeholder}
          autoComplete="off"
        />
      </form>

      <p className="mono search-status" role="status" aria-live="polite">
        {status === "loading" && labels.loading}
        {status === "unavailable" && labels.unavailable}
        {status === "ready" && (results.length > 0 ? countLabel : labels.empty)}
      </p>

      {results.length > 0 && (
        <ol className="list search-results">
          {results.map((result) => (
            <li key={result.url}>
              <a href={result.url}>
                <span>
                  <strong>{result.title}</strong>
                  <span
                    className="search-excerpt"
                    dangerouslySetInnerHTML={{ __html: result.excerpt }}
                  />
                </span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Search;
