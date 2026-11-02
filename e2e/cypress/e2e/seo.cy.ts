describe("Balises SEO", () => {
  it("expose canonical, robots, Open Graph et JSON-LD sur un article", () => {
    cy.visit("/");
    cy.get(".featured .card-link")
      .invoke("attr", "href")
      .then((href) => {
        cy.visit(String(href));
        cy.location("href").then((url) => {
          const path = new URL(url).pathname;
          cy.get('link[rel="canonical"]')
            .should("have.attr", "href")
            .and("match", new RegExp(`${path}$`));
        });
      });

    cy.get('meta[name="robots"]')
      .should("have.attr", "content")
      .and("match", /^index, follow/);
    cy.get('meta[name="description"]')
      .should("have.attr", "content")
      .its("length")
      .should("be.within", 120, 160);
    cy.get('meta[property="og:image"]')
      .should("have.attr", "content")
      .and("match", /\/og\/.+\.png$/);
    cy.jsonLdTypes().should("include.members", [
      "WebSite",
      "BlogPosting",
      "Person",
      "BreadcrumbList",
    ]);
  });

  it("met la recherche en noindex", () => {
    cy.visit("/recherche/");
    cy.get('meta[name="robots"]').should("have.attr", "content", "noindex, follow");
  });

  it("sert un sitemap et un robots.txt cohérents", () => {
    cy.request("/robots.txt").its("body").should("contain", "Sitemap:");
    cy.request("/sitemap.xml")
      .its("body")
      .should("contain", "<urlset")
      .and("not.contain", "/recherche/");
  });
});
