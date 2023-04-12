describe('Testing home page navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4500/site');
  });

  describe('LOG IN', () => {
    it('should click on log in button and show a warning message', () => {
      cy.get('#btnLogIn').click();
      cy.get('.swal-title').contains('Wrong credentials');
    });
  });

  describe('FORGOT PASSWORD', () => {
    it('should redirect to Forgot password page.', () => {
      cy.get('form > .link').click();
      cy.get('.fw-normal').contains('Forgot password?');
    });
  });

  describe('CREATE NEW ACCOUNT', () => {
    it('should redirect to create new account page.', () => {
      cy.get('[href="./new-account.html"] > .btn').click();
      cy.get('.fw-normal').contains('Create your account');
    });
  });

  after(() => {
    cy.visit('http://localhost:4500/site');
  });
});
