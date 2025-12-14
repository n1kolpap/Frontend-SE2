// cypress/e2e/unhappy-path-failedLogin.cy.js
/// <reference types="cypress" />

// UNHAPPY PATH: FAILED LOGIN ATTEMPTS (CLIENT + SERVER VALIDATION)
// ---------------------------------------------------------------
// This spec tests 3 negative cases on the Login screen:
//
// 1) Submit with EMPTY username -> expect client-side validation error:
//      "Username must be at least 3 characters."
//
// 2) Submit with EMPTY password -> expect client-side validation error:
//      "Password must be at least 6 characters."
//
// 3) Submit with WRONG password (but valid lengths) -> expect server error:
//      "Invalid username or password"
//
// Deployment / routing note:
// - The deployed Render server may 404 for deep links like /login.
//   Therefore we always cy.visit("/") (Welcome) and navigate to /login through UI.
// - After logout, the app lands on /login (not Welcome).

describe("Unhappy path - failed login", () => {
  // A place to track how many times the backend login endpoint is called.
  // This helps us verify that client-side validation blocks requests in cases (1) and (2).
  let loginApiCallCount = 0;

  beforeEach(() => {
    // Start each test from a clean unauthenticated state
    cy.clearCookies();
    cy.clearLocalStorage();

    // Reset our counter
    loginApiCallCount = 0;

    // Spy (do not stub) on the login call. We will:
    // - expect 0 calls for client-side validation failures
    // - expect 1 call for server-side invalid credentials failure
    cy.intercept("PUT", "**/user/login", (req) => {
      loginApiCallCount += 1;
      req.continue();
    }).as("loginApi");
  });

  it("shows validation errors for empty fields and server error for wrong password", () => {
    // -------------------------------------------------------------------------
    // 0) Navigate to Login via Welcome page (avoid deep-link /login 404)
    // -------------------------------------------------------------------------
    cy.visit("/");

    // Confirm Welcome is loaded
    cy.contains(/Unlock the world with/i, { timeout: 20000 }).should("be.visible");

    // Go to login screen using the in-app navigation button
    cy.contains("button", /^I already have an account$/i)
      .should("be.visible")
      .click();

    // Confirm SPA route
    cy.location("pathname", { timeout: 20000 }).should("eq", "/login");

    // Helper: submit the login form using the *form submit* button.
    // (Important because there's also a top toggle button labeled "Log in".)
    const submitLoginForm = () => {
      cy.get("form").within(() => {
        cy.get('button[type="submit"]').contains(/^Log in$/i).click();
      });
    };

    // -------------------------------------------------------------------------
    // 1) Login attempt: missing username (username="", password="password123")
    // -------------------------------------------------------------------------
    cy.get("input#username").should("be.visible").clear(); // leave empty
    cy.get("input#password").should("be.visible").clear().type("password123", { log: false });

    submitLoginForm();

    // Check client-side validation error
    cy.contains("Username must be at least 3 characters.").should("be.visible");

    // Ensure no backend request happened (validation should block submission)
    cy.wrap(null).then(() => {
      expect(loginApiCallCount, "login API calls after missing-username attempt").to.eq(0);
    });

    // Stay on login page
    cy.location("pathname").should("eq", "/login");

    // -------------------------------------------------------------------------
    // 2) Login attempt: missing password (username="john_doe", password="")
    // -------------------------------------------------------------------------
    cy.get("input#username").should("be.visible").clear().type("john_doe");
    cy.get("input#password").should("be.visible").clear(); // leave empty

    submitLoginForm();

    // Check client-side validation error
    cy.contains("Password must be at least 6 characters.").should("be.visible");

    // Still no backend request (validation should block submission)
    cy.wrap(null).then(() => {
      expect(loginApiCallCount, "login API calls after missing-password attempt").to.eq(0);
    });

    // Stay on login page
    cy.location("pathname").should("eq", "/login");

    // -------------------------------------------------------------------------
    // 3) Login attempt: wrong password (valid lengths -> should hit backend)
    //    username="john_doe"
    //    password="asdfghjkl1234567890qwertyuiopzxcvbnm"
    // -------------------------------------------------------------------------
    cy.get("input#username").should("be.visible").clear().type("john_doe");
    cy.get("input#password")
      .should("be.visible")
      .clear()
      .type("asdfghjkl1234567890qwertyuiopzxcvbnm", { log: false });

    submitLoginForm();

    // This time we expect a real backend call
    cy.wait("@loginApi").its("response.statusCode").should("be.oneOf", [400, 401, 403]);

    // Confirm the server error message is shown to the user
    cy.contains(/Invalid username or password/i, { timeout: 20000 }).should("be.visible");

    // Exactly one backend call should have happened in total
    cy.wrap(null).then(() => {
      expect(loginApiCallCount, "login API calls after wrong-password attempt").to.eq(1);
    });

    // Still not logged in, so we should remain on /login
    cy.location("pathname").should("eq", "/login");

    // -------------------------------------------------------------------------
    // 4) "Log out"
    // -------------------------------------------------------------------------
    // Since none of the login attempts succeeded, we are already logged out.
    // We assert the logged-out state explicitly (this is the effective equivalent
    // of "log out" for an unauthenticated user).
    cy.window().then((win) => {
      expect(win.localStorage.getItem("triptrail_auth"), "no auth in localStorage").to.be.null;
    });
  });
});
