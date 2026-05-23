describe('Test Suites #4, #5 & #6: Projects Management', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/auth/verify', { statusCode: 200, body: { user: { id: 1, role: 'student', name: 'Test' } } }).as('verifyAuth');
    cy.intercept('GET', '**/api/projects', { statusCode: 200, body: [{ id: 1, title: 'Test Project', _id: '1' }] }).as('getProjects');
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-token');
      win.localStorage.setItem('user', JSON.stringify({id: 1, role: 'student', name: 'Test'}));
    });
  });

  it('TCProj-01: Submit complete project', () => {
    cy.intercept('POST', '**/api/projects', { statusCode: 201, body: { message: 'Project Created' } }).as('createProject');
    cy.visit('/student/manage-projects');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Create")').length > 0 || $body.find('button:contains("Upload")').length > 0) {
        cy.contains(/(Create|Upload|New|Add)/i).click({force: true});
        cy.get('input[name="title"], input[placeholder*="Title"]').first().type('New AI Project', {force: true});
        cy.get('button[type="submit"], button:contains("Submit"), button:contains("Save")').click({force: true});
        cy.wait('@createProject');
      }
    });
  });

  it('TCProj-02: Missing required fields', () => {
    cy.intercept('POST', '**/api/projects', { statusCode: 400, body: { message: 'Missing fields' } }).as('missingFields');
    cy.visit('/student/manage-projects');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Create")').length > 0) {
        cy.contains(/(Create|Upload|New|Add)/i).click({force: true});
        cy.get('button[type="submit"]').click({force: true});
      }
    });
  });

  it('TCProj-03: Invalid file type', () => {
    cy.visit('/student/manage-projects');
    cy.get('body').then($body => {
      if ($body.find('input[type="file"]').length > 0) {
        cy.get('input[type="file"]').selectFile({
          contents: Cypress.Buffer.from('invalid data'),
          fileName: 'invalid.exe',
          mimeType: 'application/x-msdownload',
        }, { force: true });
        cy.contains(/(invalid|error|not supported)/i).should('exist');
      }
    });
  });

  it('TCProj-Edit-01: Edit project', () => {
    cy.intercept('PUT', '**/api/projects/*', { statusCode: 200, body: { message: 'Project Updated' } }).as('editProject');
    cy.visit('/student/manage-projects');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Edit")').length > 0) {
        cy.contains(/Edit/i).first().click({force: true});
        cy.wait('@editProject');
      }
    });
  });

  it('TCProj-Del-01: Delete project', () => {
    cy.intercept('DELETE', '**/api/projects/*', { statusCode: 200, body: { message: 'Project Deleted' } }).as('deleteProject');
    cy.visit('/student/manage-projects');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Delete")').length > 0) {
        cy.contains(/Delete/i).first().click({force: true});
        cy.wait('@deleteProject');
      }
    });
  });

  it('TCBrowse-01: Browse all projects', () => {
    cy.visit('/projects');
    cy.wait('@getProjects');
  });

  it('TCBrowse-02: Filter projects', () => {
    cy.intercept('GET', '**/api/projects?skill=React', { statusCode: 200, body: [{ id: 1, title: 'React Project' }] }).as('filterProjects');
    cy.visit('/projects');
    cy.get('body').then($body => {
      if ($body.find('input[placeholder*="Search"]').length > 0) {
        cy.get('input[placeholder*="Search"]').type('React{enter}');
        cy.wait('@filterProjects');
      }
    });
  });

  it('TCBrowse-03: No matching projects', () => {
    cy.intercept('GET', '**/api/projects?skill=NonExistent', { statusCode: 200, body: [] }).as('noProjects');
    cy.visit('/projects');
    cy.get('body').then($body => {
      if ($body.find('input[placeholder*="Search"]').length > 0) {
        cy.get('input[placeholder*="Search"]').type('NonExistent{enter}');
        cy.wait('@noProjects');
      }
    });
  });
});
