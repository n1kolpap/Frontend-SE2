/// <reference types="cypress" />

describe("happy-path-1-login", () => {
  const creds = {
    username: "john_doe",
    password: "password123",
  };

  // Find an input by matching common attributes case-insensitively (no jQuery unsupported selectors)
  const getInputByAttrMatch = (re) => {
    const attrs = ["name", "id", "placeholder", "aria-label", "data-testid"];

    return cy.get("input").filter((_, el) => {
      return attrs.some((a) => re.test(String(el.getAttribute(a) || "")));
    }).first();
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    // WelcomePage -> LoginPage (both buttons navigate to /login)
    cy.contains("button", "Get started", { timeout: 15000 }).click();

    // Ensure we're on the login view (pathname OR hash router)
    cy.location({ timeout: 15000 }).should((loc) => {
      const combined = `${loc.pathname}${loc.hash}`;
      expect(combined).to.match(/\/login\b/i);
    });

    // Wait until login inputs exist
    getInputByAttrMatch(/user(name)?/i).should("be.visible");
    cy.get('input[type="password"]', { timeout: 15000 }).first().should("be.visible");

    // If there is a "Log in" tab (not the submit), click it to ensure correct mode
    cy.get("body").then(($body) => {
      const tabs = [...$body.find("button, [role='tab']")];
      const loginTab = tabs.find((el) => {
        const txt = (el.innerText || "").trim();
        const type = (el.getAttribute("type") || "").toLowerCase();
        return /log\s*in/i.test(txt) && type !== "submit";
      });
      if (loginTab) cy.wrap(loginTab).click({ force: true });
    });
  });

  it("logs in", () => {
    cy.intercept({ method: /PUT|POST/, url: "**/user/login" }).as("loginRequest");

    getInputByAttrMatch(/user(name)?/i).clear().type(creds.username);

    cy.get('input[type="password"]').first().clear().type(creds.password);

    // Click the submit inside the form (avoid accidentally clicking the login tab)
    cy.get("form").first().within(() => {
      cy.get("button").then(($btns) => {
        const byText = [...$btns].find((b) =>
        /log\s*in|sign\s*in/i.test((b.innerText || "").trim())
        );
        if (byText) {
          cy.wrap(byText).click({ force: true });
        } else {
          // fallback: first button in the form (common pattern)
          cy.wrap($btns.first()).click({ force: true });
        }
      });
    });

    cy.wait("@loginRequest").then((interception) => {
      expect(interception?.response?.statusCode, "login status").to.be.oneOf([200, 201, 204]);
    });

    // Auth persistence key per README
    cy.window().then((win) => {
      const v = win.localStorage.getItem("triptrail_auth");
      expect(v, "triptrail_auth").to.be.a("string").and.not.be.empty;
    });

    // Post-login route (protected)
    cy.location({ timeout: 15000 }).should((loc) => {
      const combined = `${loc.pathname}${loc.hash}`;
      expect(combined).to.match(/\/home\b/i);
    });
  });
});
