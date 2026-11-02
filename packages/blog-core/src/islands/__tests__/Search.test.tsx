import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Search, type SearchLabels } from "../Search.tsx";

const labels: SearchLabels = {
  input: "Rechercher un article",
  placeholder: "Mot-clé, sujet…",
  loading: "Recherche en cours…",
  empty: "Aucun article ne correspond.",
  unavailable: "La recherche est disponible sur le site publié.",
  countOne: "{n} résultat",
  countMany: "{n} résultats",
};

describe("Search", () => {
  it("préremplit le champ avec le paramètre ?q de l'URL", async () => {
    window.history.replaceState(null, "", "/recherche/?q=hooks");
    render(<Search labels={labels} />);
    expect(await screen.findByRole("searchbox", { name: labels.input })).toHaveValue("hooks");
  });

  it("met l'URL à jour pendant la saisie et signale l'index absent (mode dev)", async () => {
    window.history.replaceState(null, "", "/recherche/");
    render(<Search labels={labels} />);

    await userEvent.type(screen.getByRole("searchbox", { name: labels.input }), "redux");

    expect(window.location.search).toBe("?q=redux");
    expect(await screen.findByText(labels.unavailable)).toBeInTheDocument();
  });
});
