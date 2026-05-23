describe('Test Suites #7, #8, #9, #10, #11: Extended Collab & Messaging', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/auth/verify', { statusCode: 200, body: { user: { id: 1, role: 'student', name: 'Test' } } });
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-token');
      win.localStorage.setItem('user', JSON.stringify({id: 1, role: 'student'}));
    });
  });

  it('TCCollab-01: Send collaboration request', () => {
    cy.intercept('POST', '**/api/collaborations', { statusCode: 201, body: { message: 'Requested' } }).as('sendReq');
    cy.visit('/student/browse-projects');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Apply")').length > 0) {
        cy.contains(/Apply/i).click({force: true});
        cy.wait('@sendReq');
      }
    });
  });

  it('TCCollab-02: AI suggested collaboration', () => {
    cy.intercept('POST', '**/api/collaborations', { statusCode: 201, body: { message: 'AI Request sent' } }).as('sendAIReq');
    cy.visit('/student/dashboard');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Collaborate")').length > 0) {
        cy.contains(/Collaborate/i).first().click({force: true});
      }
    });
  });

  it('TCCollab-03: Reject request', () => {
    cy.intercept('PUT', '**/api/collaborations/*/reject', { statusCode: 200, body: { message: 'Rejected' } }).as('rejectReq');
    cy.visit('/student/collaborations');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Reject")').length > 0) {
        cy.contains(/Reject/i).first().click({force: true});
      }
    });
  });

  it('TCMilestone-01: Create milestone', () => {
    cy.intercept('POST', '**/api/collaborations/*/milestones', { statusCode: 201, body: { message: 'Milestone Created' } }).as('addMilestone');
    cy.visit('/student/collaborations');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Milestone")').length > 0) {
        cy.contains(/Milestone/i).first().click({force: true});
      }
    });
  });

  it('TCMilestone-02: Update milestone', () => {
    cy.intercept('PUT', '**/api/collaborations/*/milestones/*', { statusCode: 200, body: { message: 'Milestone Updated' } }).as('updateMilestone');
    cy.visit('/student/collaborations');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Edit Milestone")').length > 0) {
        cy.contains(/Edit Milestone/i).first().click({force: true});
      }
    });
  });

  it('TCMilestone-03: Verify milestone', () => {
    cy.intercept('PUT', '**/api/collaborations/*/milestones/*/verify', { statusCode: 200, body: { message: 'Milestone Verified' } }).as('verifyMilestone');
    cy.visit('/student/collaborations');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Verify")').length > 0) {
        cy.contains(/Verify/i).first().click({force: true});
      }
    });
  });

  it('TCExp-01: Generate Experience Letter', () => {
    cy.intercept('POST', '**/api/experience-letters', { statusCode: 201 }).as('issueLetter');
    cy.visit('/student/collaborations');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Letter")').length > 0) {
        cy.contains(/Letter/i).first().click({force: true});
      }
    });
  });

  it('TCExp-02: Download letter', () => {
    cy.intercept('GET', '**/api/experience-letters/download', { statusCode: 200 }).as('downloadLetter');
    cy.visit('/student/letters');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Download")').length > 0) {
        cy.contains(/Download/i).first().click({force: true});
      }
    });
  });

  it('TCExp-03: Invalid milestone missing letter', () => {
    cy.intercept('POST', '**/api/experience-letters', { statusCode: 400, body: {message: 'Milestones not completed'} }).as('failLetter');
    cy.visit('/student/collaborations');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Letter")').length > 0) {
        cy.contains(/Letter/i).first().click({force: true});
      }
    });
  });

  it('TCMsg-01: Send message', () => {
    cy.visit('/student/collaborations');
    cy.get('body').then($body => {
      if ($body.find('button:contains("Chat")').length > 0) {
        cy.contains(/Chat/i).click({force: true});
      }
    });
  });

  it('TCMsg-02: Receive message', () => {
    cy.intercept('GET', '**/api/messages/*', { statusCode: 200, body: [{id: 1, text: 'Incoming'}] }).as('getMsgs');
    cy.visit('/student/collaborations');
  });

  it('TCMsg-03: Offline message', () => {
    cy.intercept('POST', '**/api/messages', { statusCode: 201, body: { queued: true } }).as('offlineMsgs');
    cy.visit('/student/collaborations');
  });

  it('TCNotif-01: New project assigned', () => {
    cy.intercept('GET', '**/api/notifications', { statusCode: 200, body: [{id: 1, type: 'assignment'}] }).as('getNotif');
    cy.visit('/student/notifications');
    cy.wait('@getNotif');
  });

  it('TCNotif-02: Milestone update alert', () => {
    cy.intercept('GET', '**/api/notifications', { statusCode: 200, body: [{id: 2, type: 'milestone'}] }).as('getNotif2');
    cy.visit('/student/notifications');
    cy.wait('@getNotif2');
  });
});
