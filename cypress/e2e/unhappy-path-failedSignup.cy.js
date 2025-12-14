// cypress/e2e/unhappy-path-failedSignup.cy.js
/// <reference types="cypress" />

// UNHAPPY PATH: FAILED SIGNUP ATTEMPTS
// -----------------------------------
// 1) Sign up with EMPTY username + EMPTY password
//    -> expect TWO validation errors (rendered by app):
//       - "Username must be at least 3 characters."
//       - "Password must be at least 6 characters."
//
// 2) Sign up with INVALID email (email = "1")
//    -> this is a BROWSER tooltip (native HTML5 validation for type="email"),
//       not normal page text. We assert using input.validity + input.validationMessage.
//
// 3) Sign up with ALREADY EXISTING username ("jane_smith")
//    -> expect backend/server error shown in UI:
//       - "Validation failed"
//
// Routing note:
// - We start at "/" and navigate to "/login" via UI to avoid deep-link 404s on Render.

describe("Unhappy path - failed signup", () => {
  // Clear a field and only type if value is non-empty (cy.type("") is not allowed).
  const setField = (selector, value, typeOptions = {}) => {
    cy.get(selector).should("be.visible").clear();
    if (typeof value === "string" && value.length > 0) {
      cy.get(selector).type(value, typeOptions);
    }
  };

  // Submit signup using the actual form submit button.
  const submitSignup = () => {
    cy.get("form").within(() => {
      cy.get('button[type="submit"]').contains(/^Create account$/i).click();
    });
  };

  it("shows validation errors for empty creds, native email tooltip for invalid email, and server error for existing username", () => {
    // -------------------------------------------------------------------------
    // 0) Clean state
    // -------------------------------------------------------------------------
    cy.clearCookies();
    cy.clearLocalStorage();

    // -------------------------------------------------------------------------
    // 1) Navigate to /login via Welcome (UI navigation avoids deep-link issues)
    // -------------------------------------------------------------------------
    cy.visit("/");
    cy.contains(/Unlock the world with/i, { timeout: 20000 }).should("be.visible");

    cy.contains("button", /^I already have an account$/i).should("be.visible").click();
    cy.location("pathname", { timeout: 20000 }).should("eq", "/login");

    // Switch to Sign up mode (reveals the email input).
    cy.contains("button", /^Sign up$/i).should("be.visible").click();
    cy.get("input#email").should("be.visible"); // confirms signup mode

    // -------------------------------------------------------------------------
    // 2) SCENARIO #1: Sign up WITHOUT credentials
    // -------------------------------------------------------------------------
    setField("input#username", "");                 // leave empty
    setField("input#email", "");                    // optional, leave empty
    setField("input#password", "", { log: false }); // leave empty

    submitSignup();

    // App-rendered validation errors (these ARE DOM text)
    cy.contains("Username must be at least 3 characters.").should("be.visible");
    cy.contains("Password must be at least 6 characters.").should("be.visible");
    cy.location("pathname").should("eq", "/login");

    // -------------------------------------------------------------------------
    // 3) SCENARIO #2: Sign up with INVALID email ("1")
    //    NOTE: This triggers BROWSER validation tooltip (not DOM text).
    // -------------------------------------------------------------------------
    setField("input#username", "asdfghjkl1234567890qwertyuiopzxcvbnm");
    setField("input#email", "1"); // invalid for type="email"
    setField("input#password", "asdfghjkl1234567890qwertyuiopzxcvbnm", { log: false });

    // Clicking submit should cause native constraint validation to fail.
    // The form submission is blocked, and the browser shows a tooltip.
    submitSignup();

    // Assert the email input is invalid and the tooltip message contains
    // "please" and "email address" (case-insensitive).
    cy.get("input#email").then(($el) => {
      const el = $el[0];

      // Confirm invalid state
      expect(el.checkValidity(), "email field validity").to.eq(false);

      // Confirm tooltip message content (browser-provided, so we match loosely)
      const msg = (el.validationMessage || "").toLowerCase();
      expect(msg, "email validationMessage").to.include("please");
      expect(msg, "email validationMessage").to.include("email address");
    });

    // Still on /login and still in signup mode
    cy.location("pathname").should("eq", "/login");
    cy.get("input#email").should("be.visible");

    // -------------------------------------------------------------------------
    // 4) SCENARIO #3: Sign up with already existing username ("jane_smith")
    // -------------------------------------------------------------------------
    // Intercept signup request so we can wait on backend deterministically.
    cy.intercept("POST", "**/user**").as("signUpRequest");

    setField("input#username", "jane_smith");
    setField("input#email", ""); // optional, leave empty
    setField("input#password", "123456", { log: false });

    submitSignup();

    // Backend should reject and UI should display the server message.
    cy.wait("@signUpRequest")
    .its("response.statusCode")
    .should("be.oneOf", [400, 401, 409, 422]);

    cy.contains(/validation failed/i, { timeout: 20000 }).should("be.visible");

    // Confirm we are still NOT authenticated
    cy.window().then((win) => {
      expect(win.localStorage.getItem("triptrail_auth")).to.be.null;
    });

    cy.location("pathname").should("eq", "/login");
  });
});
