/// <reference types="cypress" />

/**
 * happy-path-2-full
 *
 * End-to-end “happy path” for TripTrail:
 * 1) Login (click the bottom submit button inside the form)
 * 2) Create a trip plan (given specs)
 * 3) Go to Daily plan
 * 4) Day 1: add note, add activity, mark done, delete activity
 * 5) Go to Overview: edit origin, save, delete trip
 * 6) Log out (best-effort: click UI button if present, else clear localStorage)
 *
 * Important:
 * - We ALWAYS start from "/" because direct deep-links (e.g. "/login") may 404 on the host.
 */

describe("happy-path-2-full", () => {
  // Credentials (from your JSON)
  const creds = { username: "john_doe", password: "password123" };

  // Trip creation specs
  const tripSpecs = {
    destination: "Ekei",
    origin: "Edw",
    startDate: "2030-08-01", // date input expects YYYY-MM-DD
    endDate: "2030-08-08",
    budget: "384",
    purpose: "Vacation",
    interests: ["Nightlife", "Nature", "History"],
    notes: "This gonna be so fun:)",
  };

  // Day 1 edits
  const day1 = {
    note: "This is where the fun begins",
    activity: {
      name: "Super fun",
      time: "01:23",
      location: "There",
      notes: "Letsgo",
    },
  };

  // -------------------------
  // Small helper functions
  // -------------------------

  /**
   * Click a UI control by text. Keeps selectors readable.
   */
  const clickByText = (textOrRe) =>
    cy
      .contains("button, a, [role='button'], [role='tab']", textOrRe, { timeout: 20000 })
      .scrollIntoView()
      .click({ force: true });

  /**
   * Fill an input that has a stable id (Login/CreateTrip pages use ids).
   */
  const fillById = (id, value) =>
    cy.get(`#${id}`, { timeout: 20000 }).should("be.visible").clear({ force: true }).type(value, { force: true });

  /**
   * Select a dropdown by id.
   */
  const selectById = (id, value) =>
    cy.get(`#${id}`, { timeout: 20000 }).should("be.visible").select(value, { force: true });

  /**
   * IMPORTANT LOGIN FIX:
   * LoginPage has a TOP “Log in” toggle (type="button") and a BOTTOM submit button (type="submit").
   * We must click the BOTTOM one inside the form.
   */
  const submitLoginForm = () => {
    cy.get("form", { timeout: 20000 })
      .filter(":visible")
      .first()
      .within(() => {
        cy.get("button[type='submit']", { timeout: 20000 })
          .should("be.visible")
          .contains(/^Log in$/i)
          .click({ force: true });
      });
  };

  /**
   * Fill a field in dialogs/forms when we don't have ids.
   * It looks for text (e.g. “Activity name”) and types in the closest visible input/textarea.
   */
  const fillNearText = (labelRe, value) => {
    cy.contains(labelRe, { timeout: 20000 })
      .should("be.visible")
      .then(($t) => {
        const $container = $t.closest("div");
        const $field = $container.find("input, textarea, select").filter(":visible").first();

        if ($field.length) {
          const tag = $field.prop("tagName").toLowerCase();
          if (tag === "select") cy.wrap($field).select(value, { force: true });
          else cy.wrap($field).clear({ force: true }).type(value, { force: true });
          return;
        }

        // last resort fallback (should rarely be needed)
        cy.get("input:visible, textarea:visible, select:visible").first().clear({ force: true }).type(value, { force: true });
      });
  };

  it("runs the full happy path", () => {
    // =========================
    // 1) LOGIN
    // =========================
    cy.intercept({ method: /PUT|POST/, url: "**/user/login" }).as("loginReq");

    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    // Welcome -> Login
    clickByText(/^Get started$/i);

    // Fill credentials
    fillById("username", creds.username);
    fillById("password", creds.password);

    // Click the correct (bottom) Log in submit
    submitLoginForm();

    cy.wait("@loginReq").its("response.statusCode").should("be.oneOf", [200, 201, 204]);
    cy.location("pathname", { timeout: 20000 }).should("match", /\/home\b/i);

    // =========================
    // 2) CREATE TRIP PLAN
    // =========================
    // HomePage -> CreateTripPage
    clickByText(/^New trip plan$/i);

    // Fill CreateTripPage fields (stable ids)
    fillById("origin", tripSpecs.origin);
    fillById("destination", tripSpecs.destination);
    fillById("startDate", tripSpecs.startDate);
    fillById("endDate", tripSpecs.endDate);
    fillById("budget", tripSpecs.budget);
    selectById("purpose", tripSpecs.purpose);
    fillById("notes", tripSpecs.notes);

    // Select interests (chips are buttons with interest text)
    tripSpecs.interests.forEach((interest) => {
      clickByText(new RegExp(`^${interest}$`, "i"));
    });

    // Create trip API: POST /user/{userId}/tripPlan
    cy.intercept("POST", /\/user\/[^/]+\/tripPlan$/).as("createTripReq");

    // Submit create trip form
    clickByText(/^Generate trip plan$/i);

    cy.wait("@createTripReq").its("response.statusCode").should("be.oneOf", [200, 201, 204]);
    cy.location("pathname", { timeout: 20000 }).should("match", /\/trip\/[^/]+\/overview\b/i);

    // =========================
    // 3) VIEW DAILY PLAN
    // =========================
    clickByText(/^View daily plan$/i);
    cy.location("pathname", { timeout: 20000 }).should("match", /\/trip\/[^/]+\/daily\b/i);

    // =========================
    // 4) DAY 1: NOTE + ACTIVITY + COMPLETE + DELETE
    // =========================

    // Explicitly click the Day 1 tab (DailyPlanPage renders “Day 1”, “Day 2”, ...)
    cy.contains("button", /^Day 1$/i, { timeout: 20000 }).click({ force: true });

    // ---- 4a) Add day note ----
    // Endpoint from README:
    // POST /user/{userId}/tripPlan/{tripId}/dailyPlan/{date}/note
    cy.intercept("POST", /\/user\/[^/]+\/tripPlan\/[^/]+\/dailyPlan\/[^/]+\/note$/).as("saveDayNoteReq");

    // Type in the first visible textarea (Day note UI is inside DailyPlanDayCard)
    cy.get("textarea:visible", { timeout: 20000 }).first().clear({ force: true }).type(day1.note, { force: true });

    // Click “Save note” if present, else “Save”
    cy.get("body").then(($body) => {
      const saveNote =
        [...$body.find("button")].find((b) => /save note/i.test((b.innerText || "").trim())) ||
        [...$body.find("button")].find((b) => /^save$/i.test((b.innerText || "").trim()));
      if (!saveNote) throw new Error("Could not find a Save note / Save button for the day note.");
      cy.wrap(saveNote).click({ force: true });
    });

    cy.wait("@saveDayNoteReq").its("response.statusCode").should("be.oneOf", [200, 201, 204]);

    // ---- 4b) Add activity ----
    // Endpoint from README:
    // POST /user/{userId}/tripPlan/{tripId}/dailyPlan/{date}/activity
    cy.intercept("POST", /\/user\/[^/]+\/tripPlan\/[^/]+\/dailyPlan\/[^/]+\/activity$/).as("addActivityReq");

    clickByText(/add activity/i);

    // Fill activity fields (best-effort label matching)
    fillNearText(/activity name|name/i, day1.activity.name);

    // Prefer native time input if present
    cy.get("body").then(($body) => {
      const timeEl = $body.find("input[type='time']").filter(":visible").get(0);
      if (timeEl) cy.wrap(timeEl).clear({ force: true }).type(day1.activity.time, { force: true });
      else fillNearText(/^time$/i, day1.activity.time);
    });

    fillNearText(/location/i, day1.activity.location);
    fillNearText(/notes?/i, day1.activity.notes);

    // Save activity (prefer “Save activity”, else “Save”)
    cy.get("body").then(($body) => {
      const saveAct =
        [...$body.find("button")].find((b) => /save activity/i.test((b.innerText || "").trim())) ||
        [...$body.find("button")].find((b) => /^save$/i.test((b.innerText || "").trim()));
      if (!saveAct) throw new Error("Could not find a Save activity / Save button.");
      cy.wrap(saveAct).click({ force: true });
    });

    cy.wait("@addActivityReq").its("response.statusCode").should("be.oneOf", [200, 201, 204]);

    // Ensure activity appears in the list
    cy.contains(day1.activity.name, { timeout: 20000 }).should("be.visible");

    // ---- 4c) Mark activity as done ----
    // Endpoint from README:
    // POST /user/{userId}/tripPlan/{tripId}/dailyPlan/{date}/activity/{activityId}/completed
    cy.intercept("POST", /\/user\/[^/]+\/tripPlan\/[^/]+\/dailyPlan\/[^/]+\/activity\/[^/]+\/completed$/).as(
      "completeActivityReq"
    );

    // Click checkbox if exists in the same activity row/card; otherwise click a Done/Complete button
    cy.contains(day1.activity.name).then(($name) => {
      const $row = $name.closest("div, li, tr, section, article");
      const cb = $row.find("input[type='checkbox']").filter(":visible").get(0);

      if (cb) {
        cy.wrap(cb).check({ force: true });
      } else {
        const doneBtn = [...$row.find("button, a")].find((el) =>
          /done|complete|completed|mark/i.test((el.innerText || el.getAttribute("aria-label") || "").trim())
        );
        if (!doneBtn) throw new Error("Could not find a checkbox or Done/Complete control for the activity.");
        cy.wrap(doneBtn).click({ force: true });
      }
    });

    cy.wait("@completeActivityReq").its("response.statusCode").should("be.oneOf", [200, 201, 204]);

    // ---- 4d) Delete activity ----
    // Endpoint from README:
    // DELETE /user/{userId}/tripPlan/{tripId}/dailyPlan/{date}/activity/{activityId}
    cy.intercept("DELETE", /\/user\/[^/]+\/tripPlan\/[^/]+\/dailyPlan\/[^/]+\/activity\/[^/]+$/).as("deleteActivityReq");

    cy.contains(day1.activity.name).then(($name) => {
      const $row = $name.closest("div, li, tr, section, article");
      const delBtn = [...$row.find("button, a")].find((el) =>
        /delete|remove|trash/i.test((el.innerText || el.getAttribute("aria-label") || "").trim())
      );
      if (!delBtn) throw new Error("Could not find a Delete/Remove control for the activity.");
      cy.wrap(delBtn).click({ force: true });
    });

    // Confirm delete if a confirmation modal/button appears
    cy.get("body").then(($body) => {
      const confirm = [...$body.find("button")].find((b) => /^delete$/i.test((b.innerText || "").trim()));
      if (confirm) cy.wrap(confirm).click({ force: true });
    });

    cy.wait("@deleteActivityReq").its("response.statusCode").should("be.oneOf", [200, 201, 204]);
    cy.contains(day1.activity.name).should("not.exist");

    // =========================
    // 5) OVERVIEW: EDIT + DELETE TRIP
    // =========================

    // Try BottomNav “Overview”; if it’s not visible, pushState to overview.
    cy.location("pathname").then((p) => {
      const m = p.match(/\/trip\/([^/]+)\//i);
      const tripId = m?.[1];

      cy.get("body").then(($body) => {
        const overviewBtn = [...$body.find("button, a, [role='button'], [role='tab']")].find((el) =>
          /^overview$/i.test((el.innerText || "").trim())
        );

        if (overviewBtn) {
          cy.wrap(overviewBtn).click({ force: true });
        } else {
          cy.window().then((win) => {
            win.history.pushState({}, "", `/trip/${tripId}/overview`);
            win.dispatchEvent(new PopStateEvent("popstate"));
          });
        }
      });
    });

    cy.location("pathname", { timeout: 20000 }).should("match", /\/trip\/[^/]+\/overview\b/i);

    // Click “Edit trip”
    clickByText(/^Edit trip$/i);

    // Update origin to "Nowhere" (TripOverviewPage has labeled Input, but no id)
    fillNearText(/^Origin$/i, "Nowhere");

    // Endpoint from README:
    // PUT /user/{userId}/tripPlan/{tripId}
    cy.intercept("PUT", /\/user\/[^/]+\/tripPlan\/[^/]+$/).as("updateTripReq");
    clickByText(/^Save$/i);
    cy.wait("@updateTripReq").its("response.statusCode").should("be.oneOf", [200, 201, 204]);

    // Delete trip: open modal then confirm
    // DELETE /user/{userId}/tripPlan/{tripId}
    cy.intercept("DELETE", /\/user\/[^/]+\/tripPlan\/[^/]+$/).as("deleteTripReq");
    clickByText(/^Delete trip$/i);
    clickByText(/^Delete$/i);

    cy.wait("@deleteTripReq").its("response.statusCode").should("be.oneOf", [200, 201, 204]);
    cy.location("pathname", { timeout: 20000 }).should("match", /\/home\b/i);

    // =========================
    // 6) LOG OUT
    // =========================

    // Best-effort: click a UI logout button if it exists; otherwise clear localStorage.
    cy.get("body").then(($body) => {
      const logoutEl = [...$body.find("button, a, [role='button']")].find((el) =>
        /log\s*out|logout|sign\s*out/i.test((el.innerText || "").trim())
      );

      if (logoutEl) {
        cy.wrap(logoutEl).click({ force: true });
      } else {
        cy.window().then((win) => win.localStorage.clear());
        cy.visit("/");
      }
    });

    // Back to Welcome: “Get started” should be visible
    cy.contains("button", "Get started", { timeout: 20000 }).should("be.visible");
  });
});

