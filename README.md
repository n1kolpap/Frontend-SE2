# TripTrail · Frontend

TripTrail is a React-based web application that helps users generate, view, and edit trip plans and daily itineraries.  
This repository contains the **frontend** only. It connects to the existing TripTrail REST API (Node/Express backend) via HTTP.

---

## Features

- **Authentication**
  - Sign up with username, password (and optional email)
  - Log in and persist session using JWT stored in `localStorage`
- **Trip management**
  - Create new trip plans by providing origin, destination, dates, budget, purpose, and interests
  - View trip overview with key details and notes
  - Edit trip details (update destination, dates, budget, purpose, notes)
  - Delete existing trip plans
- **Daily plan management**
  - View generated daily plans for the selected trip
  - Add activities to a specific day (name, time, location, notes)
  - Mark activities as completed
  - Remove activities from a day
  - Add/edit notes for each day
- **Favorites (frontend-only)**
  - Mark activities as favorites to re-use or inspect later (stored in React context)
- **UI/UX**
  - Modern layout inspired by the provided mockups (Welcome, Login, Home, Create Trip, Overview, Daily Plan)
  - Responsive design for desktop and smaller screens
  - Simple form validation and inline error messages
  - Protected routes that require authentication

---

## Tech Stack

- **React 18**
- **React Router v6**
- **Axios** for HTTP requests
- **Create React App** tooling (`react-scripts`)
- Plain **CSS** (global + utility styles, no CSS frameworks)

---

## Prerequisites

- **Node.js** ≥ 16.x
- **npm** ≥ 8.x (or `yarn` if you prefer; instructions below assume `npm`)
- A running instance of the **TripTrail API backend**, e.g.:
  - `http://localhost:3000/api`  
    or any other base URL you configure via the `.env` file

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-triptrail-frontend-repo-url> triptrail-frontend
cd triptrail-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the example environment file and adjust the API URL if needed:
```bash
cp .env.example .env
```
Open `.env` and set:
```bash
REACT_APP_API_URL=http://localhost:3000/api
```
- `REACT_APP_API_URL` should point to the base URL of your TripTrail backend.
- This value is used by the axios client in `src/api/client.js`.

### 4. Run the development server
```bash
npm start
```
The app will be available at:
```text
http://localhost:3000
```
> Note: The frontend serves from `http://localhost:3000`, while the API is expected at `http://localhost:3000/api` by default (or whatever you configured in `.env`).

---

## Available Scripts

All scripts use the standard Create React App commands:
```bash
# Start development server with hot reload
npm start

# Build production assets into the build/ directory
npm run build

# Run tests (if/when implemented)
npm test

# Eject (not recommended unless you know what you’re doing)
npm run eject
```
---

## Project Structure

The frontend follows a modular structure aligned with your requirements:
```text
triptrail-frontend/
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── public/
│   └── index.html
└── src/
    ├── index.js              # React entry point
    ├── App.js                # Root component using AppRouter
    ├── index.css             # Global base styles
    ├── styles/
    │   ├── variables.css     # CSS variables (colors, spacing, etc.)
    │   └── layout.css        # Layout & shell styles (header, bottom nav, cards)
    ├── api/
    │   ├── client.js         # Axios instance with base URL & auth interceptor
    │   ├── authApi.js        # /user and /user/login calls
    │   ├── tripApi.js        # Trip plan endpoints
    │   └── dailyPlanApi.js   # Daily plan & activities endpoints
    ├── components/
    │   ├── PageSubtitleAndError.jsx  # Renders a subtitle and an optional error message
    │   ├── common/           # Generic UI components (Button, Input, Card, Modal, Tabs, Spinner)
    │   ├── layout/           # Shell pieces (Header, BottomNav)
    │   └── trip/             # Trip-specific components (TripCard, DailyPlanDayCard, SuggestedActivitiesModal)
    ├── pages/
    │   ├── WelcomePage.jsx
    │   ├── LoginPage.jsx
    │   ├── HomePage.jsx
    │   ├── CreateTripPage.jsx
    │   ├── TripOverviewPage.jsx
    │   ├── DailyPlanPage.jsx
    │   └── NotFoundPage.jsx
    ├── hooks/
    │   ├── useAuth.js        # Convenience hook for auth context
    │   └── useTrip.js        # Convenience hook for trip context
    ├── context/
    │   ├── AuthContext.jsx   # Auth state (user, token, login/logout)
    │   └── TripContext.jsx   # Trips, selected trip, daily plans, favorites
    ├── router/
    │   ├── AppRouter.jsx     # App-level route definitions
    │   └── ProtectedRoute.jsx# Wraps routes that require authentication
    └── utils/
        ├── validators.js     # Simple client-side validation logic
        ├── date.js           # Date formatting helpers
        └── constants.js      # Trip purposes, interest options, etc.
```
You can adapt this structure as the app evolves, but it cleanly separates responsibilities and makes the codebase easier to navigate.

---

## Routing & Screens

The main routes are:

* `/`
  **WelcomePage**
  Marketing-style hero and intro; CTA buttons lead to `/login`.

* `/login`
  **LoginPage** (also handles sign up mode)

  * `Log in` tab:

    * Uses `PUT /user/login`
    * On success stores `{ user, token }` in context + `localStorage`
  * `Sign up` tab:

    * Uses `POST /user`
    * After successful sign up, the user is prompted to log in.

* `/home` (protected)
  **HomePage**

  * Shows the current user’s trips (from `TripContext`)
  * Button to create a new trip (`/trip/new`)

* `/trip/new` (protected)
  **CreateTripPage**

  * Form for origin, destination, dates, budget, purpose, interests, notes
  * On submit:

    * Validates fields client-side
    * Calls `POST /user/{userId}/tripPlan`
    * Stores/updates the trip in `TripContext` and navigates to overview

* `/trip/:tripId/overview` (protected)
  **TripOverviewPage**

  * Loads full trip details via `GET /user/{userId}/tripPlan/{tripId}`
  * Displays core metadata (destination, dates, budget, notes)
  * Allows editing:

    * On save: `PUT /user/{userId}/tripPlan/{tripId}`
  * Allows deleting the trip:

    * On confirm: `DELETE /user/{userId}/tripPlan/{tripId}`

* `/trip/:tripId/daily` (protected)
  **DailyPlanPage**

  * Loads daily plans via `GET /user/{userId}/tripPlan/{tripId}/dailyPlan`
  * For each day:

    * List activities with time, location, notes, completion state
    * Add a new activity:

      * `POST /user/{userId}/tripPlan/{tripId}/dailyPlan/{date}/activity`
    * Delete an activity:

      * `DELETE /user/{userId}/tripPlan/{tripId}/dailyPlan/{date}/activity/{activityId}`
    * Mark an activity as completed:

      * `POST /user/{userId}/tripPlan/{tripId}/dailyPlan/{date}/activity/{activityId}/completed`
    * Add or update day notes:

      * `POST /user/{userId}/tripPlan/{tripId}/dailyPlan/{date}/note`
  * Includes a small “Suggested Activities” modal (frontend-only) to quickly prefill some typical activities (no backend dependency).

* `*`
  **NotFoundPage** for any unknown route.

All routes except `/` and `/login` are wrapped with `ProtectedRoute`, which checks the auth context and redirects to `/login` if the user is not authenticated.

---

## API Integration

The frontend uses at least eight of the available backend endpoints, as required:

* **Authentication**

  * `POST /user`
    Create a new user (Sign up)
  * `PUT /user/login`
    Log in with username/password; receive `{ user, token }`

* **Trip plan**

  * `POST /user/{userId}/tripPlan`
    Create a new trip plan
  * `GET /user/{userId}/tripPlan/{tripId}`
    Fetch trip details for overview/edit
  * `PUT /user/{userId}/tripPlan/{tripId}`
    Update trip details
  * `DELETE /user/{userId}/tripPlan/{tripId}`
    Delete a trip

* **Daily plan & activities**

  * `GET /user/{userId}/tripPlan/{tripId}/dailyPlan`
    Get all daily plans for the trip
  * `POST /user/{userId}/tripPlan/{tripId}/dailyPlan/{date}/activity`
    Add an activity to a specific day
  * `DELETE /user/{userId}/tripPlan/{tripId}/dailyPlan/{date}/activity/{activityId}`
    Delete an activity from a day
  * `POST /user/{userId}/tripPlan/{tripId}/dailyPlan/{date}/activity/{activityId}/completed`
    Mark an activity as completed
  * `POST /user/{userId}/tripPlan/{tripId}/dailyPlan/{date}/note`
    Set or update notes for that day

All calls are made through the axios client defined in `src/api/client.js`, which injects the `Authorization: Bearer <token>` header when a token is available.

---

## Authentication Flow

1. **Login**

   * User submits `username` + `password`
   * Frontend calls `PUT /user/login`
   * Backend returns:

     * `data.user` (includes `userId`, `username`, etc.)
     * `data.token` (JWT)
2. **Store credentials**

   * Frontend saves `{ user, token }` to:

     * `AuthContext` (in-memory)
     * `localStorage` under `triptrail_auth` (persistent)
3. **Axios interceptor**

   * Reads `triptrail_auth` from `localStorage`
   * If token exists, attaches `Authorization: Bearer <token>` to all subsequent API requests
4. **Protected routes**

   * If `AuthContext` does not have a valid user + token, `ProtectedRoute` redirects to `/login`

Logging out clears both context and `localStorage`.

---

## Styling & Responsiveness

* Core layout:

  * Fixed header with app branding and user actions (login/logout)
  * Main content area centered with max width for readability
  * Optional bottom navigation for switching between Overview and Daily Plan on trip-specific pages
* Styles are defined via:

  * `src/styles/variables.css` (colors, radii, shadows, spacing)
  * `src/styles/layout.css` (header, cards, bottom nav, hero, etc.)
  * `src/index.css` (global resets and typography)
* The layout is mobile-friendly:

  * Forms and cards stack on small screens
  * Grid layouts collapse to single-column where appropriate

---

## Extending the App

Some ideas for future enhancements:

* Persisting **favorites** to the backend once endpoints exist
* Adding **filtering or tagging** for trips (e.g. business vs. vacation)
* Supporting **multiple trips per user** loaded from backend (currently `TripContext` is the main source of truth on the client side)
* Adding **per-activity budgets** and improved cost summaries
* Integrating external APIs (e.g. maps, weather) into the daily plan view
