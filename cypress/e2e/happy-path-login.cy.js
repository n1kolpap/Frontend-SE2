// cypress/e2e/happy-path-login.cy.js
//
// HAPPY PATH: LOGIN (DEPLOYED FRONTEND)
// -------------------------------------
// This project is deployed on Render at:
//   https://frontend-se2-j3or.onrender.com
//
// IMPORTANT ROUTING NOTE (WHY WE DON'T cy.visit("/login")):
// ---------------------------------------------------------
// The deployed server returns 404 for deep links like /login (no SPA rewrite).
// That means `cy.visit("/login")` fails with a non-2xx status.
// The correct approach is:
//   1) visit the Welcome page ("/") which the server DOES serve
//   2) navigate to Login via in-app button (React Router client navigation)
//   3) proceed with the login flow
//
// IMPORTANT UI NOTE (TWO "Log in" BUTTONS):
// -----------------------------------------
// The LoginPage has:
//   - a top mode toggle button labeled "Log in" (type="button") -> DOES NOT submit
//   - a bottom form submit button "Log in" (type="submit") -> DOES submit
// We must click the *form submit* button inside <form>.

describe("Happy path - login", () => {
  // Credentials provided by you
  const creds = {
    username: "john_doe",
    password: "password123",
  };

  it("navigates from Welcome -> Login, logs in, and lands on /home", () => {
    // -------------------------------------------------------------------------
    // 0) Start from a clean session
    // -------------------------------------------------------------------------
    // Avoid “already logged in” scenarios from previous runs.
    cy.clearCookies();
    cy.clearLocalStorage();

    // -------------------------------------------------------------------------
    // 1) Load the Welcome page (server-served route, must be 2xx)
    // -------------------------------------------------------------------------
    cy.visit("/");

    // Sanity check: confirm we're actually on the Welcome UI
    cy.contains(/Unlock the world with/i).should("be.visible");

    // -------------------------------------------------------------------------
    // 2) Use the in-app navigation button to reach Login
    // -------------------------------------------------------------------------
    // This is critical because direct deep-linking to /login may 404 on Render.
    cy.contains("button", /^I already have an account$/i)
    .should("be.visible")
    .click();

    // Confirm React Router navigated us to /login *within the SPA*
    cy.location("pathname").should("eq", "/login");

    // -------------------------------------------------------------------------
    // 3) Confirm we are in "login" mode (not "signup")
    // -------------------------------------------------------------------------
    // In signup mode an email field is rendered; in login mode it should not exist.
    cy.get("input#email").should("not.exist");

    // (Optional but explicit) Ensure the top toggle says we're on Log in mode
    cy.contains("button", /^Log in$/i).should("exist");

    // -------------------------------------------------------------------------
    // 4) Fill in credentials
    // -------------------------------------------------------------------------
    cy.get("input#username")
    .should("be.visible")
    .clear()
    .type(creds.username);

    cy.get("input#password")
    .should("be.visible")
    .clear()
    // Do not print password in Cypress logs
    .type(creds.password, { log: false });

    // -------------------------------------------------------------------------
    // 5) Intercept the backend login call for deterministic waiting
    // -------------------------------------------------------------------------
    // The frontend calls PUT .../user/login (possibly under an /api base URL).
    // Using ** keeps it robust across different base URLs/domains.
    cy.intercept("PUT", "**/user/login").as("loginRequest");

    // -------------------------------------------------------------------------
    // 6) Submit the form using the *submit* button inside <form>
    // -------------------------------------------------------------------------
    // This avoids clicking the top "Log in" toggle button by mistake.
    cy.get("form").within(() => {
      cy.get('button[type="submit"]')
      .contains(/^Log in$/i)
      .should("be.enabled")
      .click();
    });

    // -------------------------------------------------------------------------
    // 7) Assert the login request succeeded
    // -------------------------------------------------------------------------
    cy.wait("@loginRequest")
    .its("response.statusCode")
    .should("be.oneOf", [200, 201]);

    // -------------------------------------------------------------------------
    // 8) Assert navigation to the protected Home page
    // -------------------------------------------------------------------------
    // Increase timeout slightly to accommodate Render cold starts.
    cy.location("pathname", { timeout: 20000 }).should("eq", "/home");

    // -------------------------------------------------------------------------
    // 9) Assert authenticated UI elements are visible
    // -------------------------------------------------------------------------
    // Home page header / content checks (kept simple and stable).
    cy.contains("h1", /^Your trips$/i).should("be.visible");
    cy.contains(/^Hi,\s*john_doe$/i).should("be.visible");
    cy.contains("button", /^Log out$/i).should("be.visible");

    // -------------------------------------------------------------------------
    // 10) Assert auth persistence in localStorage
    // -------------------------------------------------------------------------
    // The app persists auth under "triptrail_auth" (per project behavior).
    cy.window().then((win) => {
      const raw = win.localStorage.getItem("triptrail_auth");
      expect(raw, "triptrail_auth exists").to.be.a("string").and.not.be.empty;

      const parsed = JSON.parse(raw);
      expect(parsed).to.have.property("token");
      expect(parsed).to.have.nested.property("user.username", creds.username);
    });
  });
});
