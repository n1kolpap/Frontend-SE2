describe('Happy Path 1 – User logs in successfully', () => {
  it('logs in with valid credentials and navigates to home', () => {

    cy.visit('#/login')

    cy.contains('I already have an account').click()

    cy.get('[data-cy="login-username"]').type('john_doe')
    cy.get('[data-cy="login-password"]').type('password123')


    cy.get('[data-cy="login-submit"]').click()


    cy.url({ timeout: 10000 }).should('include', '#/home')
    cy.contains('Trips').should('exist')
  })
})