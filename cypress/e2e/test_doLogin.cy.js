describe('Test successful login', () => {
  describe('Create new user account', () => {
    it('should create a new user.', () => {
      cy.log('Redirect to new account page.');
      cy.visit('http://localhost:4500/site/new-account.html');

      cy.log('Fill the fields with the new user details.');
      cy.get('#field_Name').type('Caio Cezar');
      cy.get('#field_Email').type('caiocezar@test.com');
      cy.get('#field_Password').type('pa$$123@#');
      cy.get('#field_ConfirmPassword').type('pa$$123@#');

      cy.log('Click to register.');
      cy.get('#btnRegister').click();

      cy.log('See the success message.');
      cy.get('.swal-title').contains('Success');
      cy.get('.swal-text').contains('New user created! Now you can log in.');
    });
  });

  describe('Do login.', () => {
    it('should log in successfully.', () => {
      cy.log('Go to login page.');
      cy.visit('http://localhost:4500/site');

      cy.log('Fill the fields with valid credentials.');
      cy.get('#field_Email').type('caiocezar@test.com');
      cy.get('#field_Password').type('pa$$123@#');

      cy.get('#btnLogIn').click();

      cy.get('.h2').contains('Dashboard');
    });
  });
});
