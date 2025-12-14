// cypress/e2e/unhappy-path-failedDates.cy.js
/// <reference types="cypress" />

// UNHAPPY PATH: INVALID DATES WHEN CREATING A TRIP
// ------------------------------------------------
// Goal:
// 1) Log in (starting from "/" because deep links like "/login" may 404 on Render)
// 2) Attempt to create a trip plan where End date is BEFORE Start date
// 3) Verify the exact validation error appears:
//      "End date must be after start date."
// 4) Log out
//
// Why we navigate via UI (instead of visiting /login or /trip/new directly):
// - The deployed server may return 404 for deep links (no SPA rewrite). Visiting "/"
//   then clicking buttons allows React Router to handle routing client-side.
//
// Why we intercept the create-trip request:
// - If the UI validates dates correctly, it should NOT call the backend.
// - We can optionally assert that no POST /tripPlan request occurred.

describe("Unhappy path - failed dates validation", () => {
  const creds = {
    username: "john_doe",
    password: "password123",
  };

  const trip = {
    destination: "Ekei",
    origin: "Edw",
    // User format was 1/8/2030 (dd/mm/yyyy) and 8/7/2030 (dd/mm/yyyy).
    // HTML <input type="date"> expects ISO: YYYY-MM-DD.
    startDate: "2030-08-01",
    endDate: "2030-07-08", // earlier than startDate -> should trigger validation error
    budget: "384",
    purpose: "Vacation",
    interests: ["Nightlife", "Nature", "History"],
    notes: "This gonna be so fun:)",
  };

  it('shows "End date must be after start date." and does not create a trip', () => {
    // -------------------------------------------------------------------------
    // 0) Clean session to avoid starting in an already-authenticated state
    // -------------------------------------------------------------------------
    cy.clearCookies();
    cy.clearLocalStorage();

    // -------------------------------------------------------------------------
    // 1) Welcome -> Login (UI navigation to avoid 404 deep-link issues)
    // -------------------------------------------------------------------------
    cy.visit("/");

    // Confirm we're on the Welcome page (stable text from WelcomePage.jsx)
    cy.contains(/Unlock the world with/i, { timeout: 20000 }).should("be.visible");

    // Go to login via the button requested in your flow
    cy.contains("button", /^I already have an account$/i)
      .should("be.visible")
      .click();

    // Confirm SPA route changed to /login
    cy.location("pathname", { timeout: 20000 }).should("eq", "/login");

    // Intercept the login API call so we can wait deterministically
    cy.intercept("PUT", "**/user/login").as("loginRequest");

    // Fill credentials
    cy.get("input#username").should("be.visible").clear().type(creds.username);
    cy.get("input#password")
      .should("be.visible")
      .clear()
      .type(creds.password, { log: false });

    // Submit the login form using the submit button inside the <form>
    // (avoids accidentally clicking the top "Log in" toggle button)
    cy.get("form").within(() => {
      cy.get('button[type="submit"]').contains(/^Log in$/i).click();
    });

    // Confirm login succeeded
    cy.wait("@loginRequest").its("response.statusCode").should("be.oneOf", [200, 201]);

    // Land on Home
    cy.location("pathname", { timeout: 20000 }).should("eq", "/home");
    cy.contains("h1", /^Your trips$/i).should("be.visible");

    // -------------------------------------------------------------------------
    // 2) Navigate to Create Trip page and enter INVALID dates
    // -------------------------------------------------------------------------
    cy.contains("button", /^New trip plan$/i).should("be.visible").click();
    cy.location("pathname", { timeout: 20000 }).should("eq", "/trip/new");
    cy.contains("h1", /^Create a new trip plan$/i).should("be.visible");

    // Intercept the create-trip request.
    // If validation works, this should NOT fire.
    cy.intercept("POST", "**/tripPlan").as("createTripRequest");

    // Fill the form
    cy.get("input#destination").should("be.visible").clear().type(trip.destination);
    cy.get("input#origin").should("be.visible").clear().type(trip.origin);

    // Set dates (endDate intentionally before startDate)
    cy.get("input#startDate").should("be.visible").clear().type(trip.startDate);
    cy.get("input#endDate").should("be.visible").clear().type(trip.endDate);

    cy.get("input#budget").should("be.visible").clear().type(trip.budget);
    cy.get("select#purpose").should("be.visible").select(trip.purpose);

    // Select interests (toggle buttons)
    trip.interests.forEach((interest) => {
      cy.contains("button", new RegExp(`^${interest}$`, "i"))
        .should("be.visible")
        .click();
    });

    cy.get("#notes").should("be.visible").clear().type(trip.notes);

    // -------------------------------------------------------------------------
    // 3) Attempt to generate the trip plan and verify the validation error appears
    // -------------------------------------------------------------------------
    cy.contains("button", /^Generate trip plan$/i)
      .should("be.visible")
      .click();

    // The UI should show the exact error message requested.
    // We use an exact string match (case + punctuation) to ensure correctness.
    cy.contains("End date must be after start date.").should("be.visible");

    // Optional/stronger assertion:
    // If frontend validation blocked submission, the backend request should not be made.
    // Cypress keeps a history of calls under "<alias>.all" for intercepts.
    // (If your Cypress version doesn't support @alias.all, you can remove this block.)
    cy.get("@createTripRequest.all").should("have.length", 0);

    // -------------------------------------------------------------------------
    // 4) Log out
    // -------------------------------------------------------------------------
    // The header is present across authenticated pages and includes "Log out".
    cy.contains("button", /^Log out$/i).should("be.visible").click();

    // Auth should be cleared
    cy.window().then((win) => {
      expect(win.localStorage.getItem("triptrail_auth")).to.be.null;
    });

    // Back on Welcome (server-safe route)
    // cy.contains(/Unlock the world with/i, { timeout: 20000 }).should("be.visible");
    // Back on Login
    cy.contains(/Log in to TripTrail/i, { timeout: 20000 }).should("be.visible");

  });
});

