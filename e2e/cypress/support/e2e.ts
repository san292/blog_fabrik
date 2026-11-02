/// <reference types="cypress" />

/** Lit le JSON-LD de la page et renvoie les types déclarés dans le graphe. */
const getJsonLdTypes = (): Cypress.Chainable<string[]> =>
  cy.get('script[type="application/ld+json"]').then(($script) => {
    const data: unknown = JSON.parse($script.text());
    if (
      typeof data !== "object" ||
      data === null ||
      !("@graph" in data) ||
      !Array.isArray(data["@graph"])
    ) {
      throw new Error("JSON-LD sans @graph");
    }
    return data["@graph"].map((node: unknown) =>
      typeof node === "object" && node !== null && "@type" in node ? String(node["@type"]) : "",
    );
  });

Cypress.Commands.add("jsonLdTypes", getJsonLdTypes);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      jsonLdTypes(): Chainable<string[]>;
    }
  }
}

export {};
