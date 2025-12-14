// cypress/e2e/happy-path-full.cy.js
/// <reference types="cypress" />

// FULL HAPPY PATH (END-TO-END THROUGH THE UI)
//
// What this test covers (in order):
// 1) Log in (starting from "/" because deep links like "/login" may 404 on Render)
// 2) Create a trip plan with the exact specs you provided
// 3) From the trip overview, open the daily plan
// 4) On Day 1: add day note, add activity, mark done, delete activity
// 5) Back on overview: edit trip origin, then delete the trip
// 6) Log out
//
// Key implementation details:
// - We avoid cy.visit("/login") and other deep links to prevent 404 failures on the deployed server.
// - We wait on network calls using cy.intercept() aliases instead of using arbitrary cy.wait(ms).
// - We scope clicks carefully because some screens have multiple buttons with similar labels.

describe("Happy path - full flow", () => {
	const creds = {
		username: "john_doe",
		password: "password123",
	};

	const trip = {
		destination: "Ekei",
		origin: "Edw",
		// IMPORTANT: <input type="date"> expects "YYYY-MM-DD"
		startDate: "2030-08-01",
		endDate: "2030-08-08",
		budget: "384",
		purpose: "Vacation",
		interests: ["Nightlife", "Nature", "History"],
		notes: "This gonna be so fun:)",
	};

	const day1 = {
		note: "This is where the fun begins",
		activity: {
			name: "Super fun",
			time: "01:23",
			location: "There",
			notes: "Letsgo",
		},
	};

	it("logs in, creates a trip, edits daily plan, edits & deletes trip, and logs out", () => {
		// -----------------------------------------------------------------------
		// 0) Clean session (avoid false positives due to already-authenticated state)
		// -----------------------------------------------------------------------
		cy.clearCookies();
		cy.clearLocalStorage();

		// -----------------------------------------------------------------------
		// 1) START FROM "/" (Welcome page) and navigate to Login through the UI
		//    (direct deep links like /login may return 404 on Render)
		// -----------------------------------------------------------------------
		cy.visit("/");

		// Confirm Welcome page rendered
		cy.contains(/Unlock the world with/i, { timeout: 20000 }).should("be.visible");

		// Go to login using the button requested
		cy.contains("button", /^I already have an account$/i).should("be.visible").click();

		// We should now be on the SPA route "/login" (client navigation)
		cy.location("pathname", { timeout: 20000 }).should("eq", "/login");

		// Ensure we are in "Log in" mode (signup would show an email field)
		cy.get("input#email").should("not.exist");

		// Intercept login API so we can wait deterministically
		cy.intercept("PUT", "**/user/login").as("loginRequest");

		// Fill and submit login form
		cy.get("input#username").should("be.visible").clear().type(creds.username);
		cy.get("input#password").should("be.visible").clear().type(creds.password, { log: false });

		// Click the actual submit button inside the form (NOT the top mode toggle)
		cy.get("form").within(() => {
			cy.get('button[type="submit"]').contains(/^Log in$/i).click();
		});

		// Confirm login succeeded
		cy.wait("@loginRequest").its("response.statusCode").should("be.oneOf", [200, 201]);

		// App should route to /home after successful login
		cy.location("pathname", { timeout: 20000 }).should("eq", "/home");
		cy.contains("h1", /^Your trips$/i).should("be.visible");

		// -----------------------------------------------------------------------
		// 2) CREATE A TRIP PLAN (via UI button -> /trip/new)
		// -----------------------------------------------------------------------
		// Intercept trip creation call (POST /user/{userId}/tripPlan)
		cy.intercept("POST", "**/tripPlan").as("createTripRequest");

		// Home page always has the top-right "New trip plan" button
		cy.contains("button", /^New trip plan$/i).should("be.visible").click();

		// We are now on the SPA route "/trip/new"
		cy.location("pathname", { timeout: 20000 }).should("eq", "/trip/new");
		cy.contains("h1", /^Create a new trip plan$/i).should("be.visible");

		// Fill trip form by stable ids where available
		cy.get("input#destination").should("be.visible").clear().type(trip.destination);
		cy.get("input#origin").should("be.visible").clear().type(trip.origin);
		cy.get("input#startDate").should("be.visible").clear().type(trip.startDate);
		cy.get("input#endDate").should("be.visible").clear().type(trip.endDate);
		cy.get("input#budget").should("be.visible").clear().type(trip.budget);

		// Select purpose
		cy.get("select#purpose").should("be.visible").select(trip.purpose);

		// Select interests (these are toggle buttons)
		trip.interests.forEach((interest) => {
			cy.contains("button", new RegExp(`^${interest}$`, "i"))
			.should("be.visible")
			.click();
		});

		// Notes textarea has id="notes"
		cy.get("#notes").should("be.visible").clear().type(trip.notes);

		// Submit: "Generate trip plan"
		cy.contains("button", /^Generate trip plan$/i).should("be.enabled").click();

		// Wait for backend trip creation
		cy.wait("@createTripRequest").its("response.statusCode").should("be.oneOf", [200, 201]);

		// After creation, app should navigate to /trip/:tripId/overview (SPA route)
		cy.location("pathname", { timeout: 20000 }).should("match", /^\/trip\/[^/]+\/overview$/);

		// Verify we are on the overview page for the created destination
		cy.contains("h1", new RegExp(`^${trip.destination}$`)).should("be.visible");

		// -----------------------------------------------------------------------
		// 3) OPEN DAILY PLAN FROM OVERVIEW
		// -----------------------------------------------------------------------
		// Intercept daily plan load (GET /user/{userId}/tripPlan/{tripId}/dailyPlan)
		cy.intercept("GET", "**/dailyPlan**").as("getDailyPlansRequest");

		// The overview page has a "View daily plan" button at the bottom
		cy.contains("button", /^View daily plan$/i).should("be.visible").click();

		// Confirm we navigated to the daily plan route
		cy.location("pathname", { timeout: 20000 }).should("match", /^\/trip\/[^/]+\/daily$/);

		// Wait for daily plans to load
		cy.wait("@getDailyPlansRequest").its("response.statusCode").should("be.oneOf", [200, 201]);

		// -----------------------------------------------------------------------
		// 4) DAY 1 ACTIONS: add note, add activity, mark done, delete activity
		// -----------------------------------------------------------------------

		// 4a) Ensure "Day 1" is selected (even if it's already active by default)
		cy.contains("button", /^Day 1$/i).should("be.visible").click();

		// 4b) Add a day note and save it
		// Intercept note save call (POST .../dailyPlan/{date}/note)
		cy.intercept("POST", "**/dailyPlan/**/note").as("saveDayNoteRequest");

		// "Day notes" textarea has no id, so we locate by label and then find the textarea inside.
		cy.contains("label", /^Day notes$/i)
		.should("be.visible")
		.parent()
		.find("textarea")
		.clear()
		.type(day1.note);

		// Click "Save notes"
		cy.contains("button", /^Save notes$/i).should("be.visible").click();

		// Wait for note save + the refresh GET that follows
		cy.wait("@saveDayNoteRequest").its("response.statusCode").should("be.oneOf", [200, 201]);
		cy.wait("@getDailyPlansRequest").its("response.statusCode").should("be.oneOf", [200, 201]);

		// 4c) Add activity (open form -> fill -> save)
		// Intercept add activity call (POST .../dailyPlan/{date}/activity)
		cy.intercept("POST", "**/dailyPlan/**/activity").as("addActivityRequest");

		// Open the add activity form
		cy.contains("button", /^Add activity$/i).should("be.visible").click();

		// Scope all activity inputs within the "Save activity" form
		cy.contains("button", /^Save activity$/i)
		.should("be.visible")
		.closest("form")
		.within(() => {
			// Activity name
			cy.contains("label", /^Activity name$/i)
			.parent()
			.find("input")
			.clear()
			.type(day1.activity.name);

			// Time (type="time")
			cy.contains("label", /^Time$/i)
			.parent()
			.find('input[type="time"]')
			.clear()
			.type(day1.activity.time);

			// Location
			cy.contains("label", /^Location$/i)
			.parent()
			.find("input")
			.clear()
			.type(day1.activity.location);

			// Notes (this is the activity notes textarea inside this form)
			cy.contains("label", /^Notes$/i)
			.parent()
			.find("textarea")
			.clear()
			.type(day1.activity.notes);

			// Submit the activity form
			cy.contains("button", /^Save activity$/i).click();
		});

		// Wait for add activity + refresh GET
		cy.wait("@addActivityRequest").its("response.statusCode").should("be.oneOf", [200, 201]);
		cy.wait("@getDailyPlansRequest").its("response.statusCode").should("be.oneOf", [200, 201]);

		// Confirm the activity appears in the list
		cy.contains("div", day1.activity.name, { timeout: 20000 }).should("be.visible");

		// 4d) Mark the activity as done
		// Intercept mark completed call (POST .../activity/{activityId}/completed)
		cy.intercept("POST", "**/activity/**/completed").as("markDoneRequest");

		// Find the row containing our activity name, then click "Mark done" within that row.
		// DOM structure: name div -> parent (details container) -> parent (row container)
		cy.contains("div", day1.activity.name)
		.parent()
		.parent()
		.within(() => {
			cy.contains("button", /^Mark done$/i).click();
		});

		// Wait for mark done + refresh GET
		cy.wait("@markDoneRequest").its("response.statusCode").should("be.oneOf", [200, 201]);
		cy.wait("@getDailyPlansRequest").its("response.statusCode").should("be.oneOf", [200, 201]);

		// Verify the button now reads "Done"
		cy.contains("div", day1.activity.name)
		.parent()
		.parent()
		.within(() => {
			cy.contains("button", /^Done$/i).should("be.visible");
		});

		// 4e) Delete the activity
		// Intercept delete activity call (DELETE .../dailyPlan/{date}/activity/{activityId})
		cy.intercept("DELETE", "**/dailyPlan/**/activity/**").as("deleteActivityRequest");

		// Click "Delete" in the activity row (this opens the confirmation modal)
		cy.contains("div", day1.activity.name)
		.parent()
		.parent()
		.within(() => {
			cy.contains("button", /^Delete$/i).click();
		});

		// Confirm deletion in the modal titled "Delete activity"
		cy.contains("h3", /^Delete activity$/i)
		.should("be.visible")
		.parent()
		.within(() => {
			cy.contains("button", /^Delete$/i).click();
		});

		// Wait for delete + refresh GET
		cy.wait("@deleteActivityRequest").its("response.statusCode").should("be.oneOf", [200, 201]);
		cy.wait("@getDailyPlansRequest").its("response.statusCode").should("be.oneOf", [200, 201]);

		// Ensure the activity is gone
		cy.contains(day1.activity.name).should("not.exist");

		// -----------------------------------------------------------------------
		// 5) BACK TO OVERVIEW -> EDIT ORIGIN -> DELETE TRIP
		// -----------------------------------------------------------------------

		// 5a) Navigate back to Overview using the bottom nav (SPA-safe)
		cy.contains("span", /^Overview$/i).should("be.visible").click();

		// Confirm route is /trip/:tripId/overview again
		cy.location("pathname", { timeout: 20000 }).should("match", /^\/trip\/[^/]+\/overview$/);

		// 5b) Enter edit mode and change origin to "Nowhere"
		cy.intercept("PUT", "**/tripPlan/*").as("updateTripRequest");

		cy.contains("button", /^Edit trip$/i).should("be.visible").click();

		// "Origin" input has no id here, so locate by label
		cy.contains("label", /^Origin$/i)
		.should("be.visible")
		.parent()
		.find("input")
		.clear()
		.type("Nowhere");

		// Save edits
		cy.contains("button", /^Save$/i).should("be.enabled").click();

		// Wait for update call
		cy.wait("@updateTripRequest").its("response.statusCode").should("be.oneOf", [200, 201]);

		// Optional sanity check: origin field now shows "Nowhere" (back in read-only mode)
		cy.contains("label", /^Origin$/i).parent().find("input").should("have.value", "Nowhere");

		// 5c) Delete the trip (open modal -> confirm)
		// IMPORTANT: trip delete endpoint is DELETE /user/{userId}/tripPlan/{tripId}
		// Using "**/tripPlan/*" ensures we do NOT accidentally match dailyPlan activity deletes.
		cy.intercept("DELETE", "**/tripPlan/*").as("deleteTripRequest");

		cy.contains("button", /^Delete trip$/i).should("be.visible").click();

		// Confirm in the modal titled "Delete this trip?"
		cy.contains("h3", /^Delete this trip\?$/i)
		.should("be.visible")
		.parent()
		.within(() => {
			cy.contains("button", /^Delete$/i).click();
		});

		// Wait for delete trip call
		cy.wait("@deleteTripRequest").its("response.statusCode").should("be.oneOf", [200, 201]);

		// After deletion the app navigates back to /home
		cy.location("pathname", { timeout: 20000 }).should("eq", "/home");

		// -------------------------------------------------------------------------
		// 6) LOG OUT
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
