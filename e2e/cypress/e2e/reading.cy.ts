describe("Parcours de lecture", () => {
  it("va de l'accueil à un article puis à sa catégorie", () => {
    cy.visit("/");
    cy.get("h1").should("have.length", 1);

    cy.get(".featured .card-link").click();
    cy.location("pathname").should("match", /^\/[a-z0-9-]+\/$/);
    cy.get("article h1").should("be.visible");
    cy.get("nav.toc a").should("have.length.greaterThan", 1);

    cy.get(".article-head .cat-link").click();
    cy.location("pathname").should("match", /^\/categorie\/[a-z0-9-]+\/$/);
    cy.get(".posts li").should("have.length.greaterThan", 0);
  });

  it("navigue entre les pages de la liste", () => {
    cy.visit("/");
    cy.get('.pager a[rel="next"]').click();
    cy.location("pathname").should("eq", "/page/2/");
    cy.get('.pager [aria-current="page"]').should("contain.text", "2");
  });

  it("affiche une 404 utile", () => {
    cy.visit("/page-inexistante/", { failOnStatusCode: false });
    cy.get("h1").should("contain.text", "introuvable");
    cy.get(".posts li").should("have.length.greaterThan", 0);
  });
});
