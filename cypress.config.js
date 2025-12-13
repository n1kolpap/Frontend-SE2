import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: 'https://frontend-se2-j3or.onrender.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false
  }
})
