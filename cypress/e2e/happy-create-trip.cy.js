describe('Happy Path 2 – User creates a trip successfully', () => {
  it('creates a new trip and views trip overview', () => {


    cy.visit('#/login')
    cy.contains('I already have an account').click()


    cy.get('[data-cy="login-username"]').type('john_doe')
    cy.get('[data-cy="login-password"]').type('password123')
    cy.get('[data-cy="login-submit"]').click()


    cy.url({ timeout: 10000 }).should('include', '#/home')


    cy.get('[data-cy="create-trip-btn"]').click()
    cy.url().should('include', '#/trip/new')


    cy.get('[data-cy="trip-destination"]').type('Rome')
    cy.get('[data-cy="trip-start-date"]').type('2025-06-01')
    cy.get('[data-cy="trip-end-date"]').type('2025-06-07')


    cy.get('[data-cy="trip-submit"]').click()

    cy.url({ timeout: 10000 }).should('include', '#/trip/')
    cy.contains('Rome').should('exist')
  })
})