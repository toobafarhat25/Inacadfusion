describe('Test Suite #6: AI Recommendations Extended', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/auth/verify', { statusCode: 200, body: { user: { id: 1, role: 'student', name: 'Test' } } });
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-token');
      win.localStorage.setItem('user', JSON.stringify({id: 1, role: 'student'}));
    });
  });

  it('TCAI-01: Generate recommendations', () => {
    cy.intercept('POST', '**/api/ai/recommend', { statusCode: 200, body: { matches: [{title: 'AI Robotics', confidence: 95}] } }).as('getMatches');
    cy.visit('/student/dashboard');
    cy.contains(/recommend|matches|AI/i).click({force: true});
    cy.wait('@getMatches');
  });

  it('TCAI-02: Limited data', () => {
    cy.intercept('POST', '**/api/ai/recommend', { statusCode: 200, body: { matches: [] } }).as('getEmptyMatches');
    cy.visit('/student/dashboard');
    cy.contains(/recommend|matches|AI/i).click({force: true});
    cy.wait('@getEmptyMatches');
  });

  it('TCAI-03: AI Service Down', () => {
    cy.intercept('POST', '**/api/ai/recommend', { forceNetworkError: true }).as('aiOffline');
    cy.visit('/student/dashboard');
    cy.contains(/recommend|matches|AI/i).click({force: true});
    cy.wait('@aiOffline');
    cy.contains(/(error|unavailable|failed)/i).should('exist');
  });
});
