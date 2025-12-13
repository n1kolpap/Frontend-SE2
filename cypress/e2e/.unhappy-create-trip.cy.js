describe('Unhappy paths: create trip', () => {
  beforeEach(() => {

    cy.intercept('POST', '/api/user/login', {
      statusCode: 200,
      body: {
        data: { user: { userId: 'u1', username: 'john_doe' }, token: 'fake-token' }
      }
    }).as('login');

    cy.visit('/login');
    cy.get('[data-cy="login-username"]').type('john_doe');
    cy.get('[data-cy="login-password"]').type('password123');
    cy.get('[data-cy="login-submit"]').click();
    cy.wait('@login');
    cy.url().should('include', '/home');
  });

  it('shows backend validation errors when required fields missing', () => {

    cy.intercept('POST', '/api/trip', {
      statusCode: 400,
      body: {
        error: 'Validation failed',
        details: { destination: 'Destination is required', startDate: 'Start date is required' }
      }
    }).as('createTripValidation');

    cy.get('[data-cy="create-trip-btn"]').click();
    cy.url().should('include', '/trip/new');


    cy.get('[data-cy="trip-submit"]').click();

    cy.wait('@createTripValidation');
    cy.contains('Destination is required').should('exist');
    cy.contains('Start date is required').should('exist');


    cy.url().should('include', '/trip/new');
  });

  it('handles server error when creating a trip', () => {

    cy.intercept('POST', '/api/trip', {
      statusCode: 500,
      body: { error: 'Internal server error' }
    }).as('createTripServerError');

    cy.get('[data-cy="create-trip-btn"]').click();
    cy.url().should('include', '/trip/new');


    cy.get('[data-cy="trip-destination"]').type('Rome');
    cy.get('[data-cy="trip-start-date"]').type('2025-06-01');
    cy.get('[data-cy="trip-end-date"]').type('2025-06-07');

    cy.get('[data-cy="trip-submit"]').click();

    cy.wait('@createTripServerError');
    
    cy.contains(/server|error/i).should('exist');
    cy.url().should('include', '/trip/new');
  });
});