/// <reference types="cypress" />
describe('Authorization redirect behavior', () => {
  it('redirects to Магазины (/a/osago) when user is already authorized and visits /a/auth', () => {
    cy.visit('/a/auth', {
      onBeforeLoad(win: Window) {
        // Simulate authorized user before Auth page loads
        win.localStorage.setItem('access', JSON.stringify({ access: 'dummy-token' }));
      },
    });
    cy.location('pathname', { timeout: 10000 }).should('eq', '/a/osago');
  });
});
