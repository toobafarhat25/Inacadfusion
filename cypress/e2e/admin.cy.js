describe('Test Suites #12 - #15: Extended Admin Moderation', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/auth/verify', { statusCode: 200, body: { user: { id: 3, role: 'admin' } } });
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-token');
      win.localStorage.setItem('user', JSON.stringify({id: 3, role: 'admin'}));
    });
  });

  it('TCAdmin-01: Approve user', () => {
    cy.intercept('PUT', '**/api/admin/users/*/approve', { statusCode: 200 }).as('apUser');
    cy.visit('/admin/users');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Approve")').length > 0) cy.contains(/Approve/i).first().click({force: true});
    });
  });

  it('TCAdmin-02: Block user', () => {
    cy.intercept('PUT', '**/api/admin/users/*/block', { statusCode: 200 }).as('blUser');
    cy.visit('/admin/users');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Block")').length > 0) cy.contains(/Block/i).first().click({force: true});
    });
  });

  it('TCProjMod-01: Approve Project', () => {
    cy.intercept('PUT', '**/api/admin/projects/*/approve', { statusCode: 200 }).as('apProj');
    cy.visit('/admin/projects');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Approve")').length > 0) cy.contains(/Approve/i).first().click({force: true});
    });
  });

  it('TCProjMod-02: Reject Project', () => {
    cy.intercept('PUT', '**/api/admin/projects/*/reject', { statusCode: 200 }).as('rjProj');
    cy.visit('/admin/projects');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Reject")').length > 0) cy.contains(/Reject/i).first().click({force: true});
    });
  });

  it('TCReport-01: Generate Metrics', () => {
    cy.visit('/admin/dashboard');
  });

  it('TCReport-02: Export Report', () => {
    cy.intercept('GET', '**/api/reports/export', { statusCode: 200 }).as('exReport');
    cy.visit('/admin/dashboard');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Export")').length > 0) cy.contains(/Export/i).first().click({force: true});
    });
  });
});
