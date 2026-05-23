describe('Test Suite #3: Student Profiles', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/auth/verify', { statusCode: 200, body: { user: { id: 1, role: 'student', name: 'Test' } } }).as('verifyAuth');
    cy.intercept('PUT', '**/api/profile/*', { statusCode: 200, body: { message: 'Profile updated successfully' } }).as('updateProfile');
    cy.window().then((win) => win.localStorage.setItem('token', 'mock-token'));
    cy.window().then((win) => win.localStorage.setItem('user', JSON.stringify({id: 1, role: 'student'})));
  });

  it('TCProf-01: Update profile info', () => {
    cy.visit('/student/profile');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Edit")').length > 0) {
        cy.contains(/Edit/i).click({force: true});
      }
    });
    cy.get('input[name="skills"], textarea').first().type('React, Node', {force: true});
    cy.get('button[type="submit"], button:contains("Save")').click({force: true});
    cy.wait('@updateProfile', {timeout: 3000}).its('response.statusCode').should('eq', 200);
  });

  it('TCProf-02: Invalid input (Profile)', () => {
    cy.intercept('PUT', '**/api/profile/*', { statusCode: 400, body: { message: 'Invalid data' } }).as('updateProfileFail');
    cy.visit('/student/profile');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Edit")').length > 0) {
        cy.contains(/Edit/i).click({force: true});
      }
    });
    cy.get('input[name="name"], input[type="text"]').first().clear().type(' ', {force: true});
    cy.get('button[type="submit"], button:contains("Save")').click({force: true});
    cy.wait('@updateProfileFail', {timeout: 3000});
  });
});
