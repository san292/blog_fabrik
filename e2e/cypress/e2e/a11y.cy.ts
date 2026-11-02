describe("Accessibilité et interactions", () => {
  it("propose un lien d'évitement vers le contenu", () => {
    cy.visit("/");
    cy.get("a.skip").should("have.attr", "href", "#content");
    cy.get("#content").should("exist");
  });

  it("ouvre et ferme le menu mobile au clavier", () => {
    cy.viewport(390, 844);
    cy.visit("/");
    cy.get("[data-nav-toggle]").should("have.attr", "aria-expanded", "false").click();
    cy.get("[data-nav-toggle]").should("have.attr", "aria-expanded", "true");
    cy.get("#site-nav a").first().should("have.focus");

    cy.get("body").type("{esc}");
    cy.get("[data-nav-toggle]").should("have.attr", "aria-expanded", "false").and("have.focus");
  });

  it("mémorise le thème sombre d'une page à l'autre", () => {
    cy.visit("/");
    cy.get("[data-theme-toggle]").click();
    cy.get("html").should("have.attr", "data-theme");
    cy.document().then((doc) => {
      const chosen = doc.documentElement.dataset["theme"];
      cy.visit("/recherche/");
      cy.get("html").should("have.attr", "data-theme", chosen);
    });
  });

  it("trouve un article avec la recherche", () => {
    cy.visit("/recherche/?q=redux");
    cy.get("#search-input").should("have.value", "redux");
    cy.get(".search-results a").should("have.length.greaterThan", 0);
  });
});
