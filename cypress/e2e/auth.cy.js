describe('Test Suites #1 & #2: Registration & Login', () => {
  beforeEach(() => {
    // Intercept backend API requests
    cy.intercept('POST', '**/api/auth/register', (req) => {
      // Simulate backend behavior
      if (!req.body.name || !req.body.password || !req.body.email) {
        req.reply({ statusCode: 400, body: { message: 'Missing fields' }});
      } else {
        req.reply({ statusCode: 201, body: { message: 'Registered successfully', user: { id: 1, role: req.body.role }, token: 'mock-token' } });
      }
    }).as('register');

    cy.intercept('POST', '**/api/auth/login', (req) => {
      if (req.body.password === 'wrong') {
        req.reply({ statusCode: 401, body: { message: 'Invalid credentials' } });
      } else {
        req.reply({ statusCode: 200, body: { message: 'Logged in successfully', user: { id: 1, role: req.body.role || 'student', name: 'Test' }, token: 'mock-token' } });
      }
    }).as('login');
  });

  // ========== Test Suite #1: Registration ==========
  it('TCReg-01: Register as Student', () => {
    cy.visit('/register');
    cy.get('input[name="name"]').type('Test Student');
    cy.get('input[name="email"]').type('student@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('input[value="student"]').check();
    cy.get('button[type="submit"]').click();
    cy.wait('@register').its('response.statusCode').should('eq', 201);
    cy.url().should('include', '/student/dashboard');
  });

  it('TCReg-02: Register as Startup', () => {
    cy.visit('/register');
    cy.get('input[name="name"]').type('Test Startup');
    cy.get('input[name="email"]').type('startup@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('input[value="startup"]').check();
    cy.get('button[type="submit"]').click();
    cy.wait('@register').its('response.statusCode').should('eq', 201);
    cy.url().should('include', '/startup/dashboard');
  });

  it('TCReg-03: Register with missing fields', () => {
    cy.visit('/register');
    // Submitting an empty form
    cy.get('button[type="submit"]').click();
    cy.contains(/Please fill in all/i).should('be.visible');
  });

  // ========== Test Suite #2: Login ==========
  it('TCLogin-01: Successful login', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('student@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/dashboard');
  });

  it('TCLogin-02: Invalid password', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('student@test.com');
    cy.get('input[name="password"]').type('wrong');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
    cy.contains(/Invalid credentials/i).should('be.visible');
  });

  it('TCLogin-03: Empty credentials', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    cy.contains(/Please fill in all fields/i).should('be.visible');
  });
});
