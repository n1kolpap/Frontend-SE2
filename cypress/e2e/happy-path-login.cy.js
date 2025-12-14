// cypress/e2e/happy-path-login.cy.js
/// <reference types="cypress" />

// HAPPY PATH: LOGIN -> LOGOUT
// ---------------------------
// What this spec verifies:
// 1) User can log in successfully with valid credentials
// 2) User can log out successfully
// 3) After logout, the app lands on "/login" (per your current routing behavior)
//
// Deployment / routing note:
// - On Render, deep links like "/login" may return 404 at the server level.
//   Therefore we ALWAYS start at "/" (Welcome) and navigate to "/login" via UI.
//
// UI note:
// - The Login page has two "Log in" buttons:
//   (a) a top toggle button (switches modes)
//   (b) the form submit button (actually performs login)
//   We click the submit button inside <form> to avoid misclicks.

describe("Happy path - login and logout", () => {
  const creds = {
    username: "john_doe",
    password: "password123",
  };

  it("logs in successfully and then logs out to /login", () => {
    // -------------------------------------------------------------------------
    // 0) Ensure we start unauthenticated
    // -------------------------------------------------------------------------
    cy.clearCookies();
    cy.clearLocalStorage();

    // -------------------------------------------------------------------------
    // 1) Navigate to Login via the Welcome page (SPA-safe navigation)
    // -------------------------------------------------------------------------
    cy.visit("/");

    // Confirm Welcome page is rendered (stable text)
    cy.contains(/Unlock the world with/i, { timeout: 20000 }).should("be.visible");

    // Click the button that takes us to the auth page (/login route in the SPA)
    cy.contains("button", /^I already have an account$/i)
    .should("be.visible")
    .click();

    // Confirm we are now on the SPA route "/login"
    cy.location("pathname", { timeout: 20000 }).should("eq", "/login");

    // Ensure we're in "Log in" mode (email field appears only in Sign up mode)
    cy.get("input#email").should("not.exist");

    // -------------------------------------------------------------------------
    // 2) Perform login
    // -------------------------------------------------------------------------
    // Intercept the backend request so we can wait for it deterministically.
    cy.intercept("PUT", "**/user/login").as("loginRequest");

    // Fill in the form
    cy.get("input#username").should("be.visible").clear().type(creds.username);
    cy.get("input#password")
    .should("be.visible")
    .clear()
    .type(creds.password, { log: false }); // do not print password in logs

    // Submit using the actual submit button inside the form.
    // This avoids clicking the top "Log in" toggle button by mistake.
    cy.get("form").within(() => {
      cy.get('button[type="submit"]').contains(/^Log in$/i).click();
    });

    // Confirm login succeeded (status can be 200 or 201)
    cy.wait("@loginRequest").its("response.statusCode").should("be.oneOf", [200, 201]);

    // App should redirect to /home after successful login
    cy.location("pathname", { timeout: 20000 }).should("eq", "/home");

    // Basic authenticated UI assertions
    cy.contains("h1", /^Your trips$/i).should("be.visible");
    cy.contains(/^Hi,\s*john_doe$/i).should("be.visible");
    cy.contains("button", /^Log out$/i).should("be.visible");

    // Auth should be persisted
    cy.window().then((win) => {
      const raw = win.localStorage.getItem("triptrail_auth");
      expect(raw, "triptrail_auth exists after login").to.be.a("string").and.not.be.empty;

      const parsed = JSON.parse(raw);
      expect(parsed).to.have.property("token");
      expect(parsed).to.have.nested.property("user.username", creds.username);
    });

    // -------------------------------------------------------------------------
    // 3) Log out
    // -------------------------------------------------------------------------
    // Click "Log out" in the header.
    cy.contains("button", /^Log out$/i).click();

    // After logout, the app should land on /login (your current behavior).
    cy.location("pathname", { timeout: 20000 }).should("eq", "/login");

    // Auth should be cleared from localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("triptrail_auth"), "auth cleared after logout").to.be.null;
    });

    // Sanity check: login form fields are present again
    cy.get("input#username").should("be.visible");
    cy.get("input#password").should("be.visible");
  });
});
