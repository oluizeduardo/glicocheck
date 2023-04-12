describe('Create new user', () => {
  it('should go to the new-account page.', () => {
    cy.visit('http://localhost:4500/site');
    cy.get('[href="./new-account.html"] > .btn').click();
  });

  it('should create new user.', () => {
    cy.visit('http://localhost:4500/site/new-account.html');

    cy.get('#field_Name').type('Neil Armstrong');
    cy.get('#field_Email').type('armstrong@test.com');
    cy.get('#field_Password').type('4rm-str0ng@#$');
    cy.get('#field_ConfirmPassword').type('4rm-str0ng@#$');

    cy.get('#btnRegister').click();

    cy.get('.swal-title').contains('Success');
    cy.get('.swal-text').contains('New user created! Now you can log in.');
  });
});

describe('Dont create new user', () => {
  it('should not create a new user with the same email address.', () => {
    cy.visit('http://localhost:4500/site/new-account.html');

    cy.get('#field_Name').type('Neil Armstrong');
    cy.get('#field_Email').type('armstrong@test.com');
    cy.get('#field_Password').type('4rm-str0ng@#$');
    cy.get('#field_ConfirmPassword').type('4rm-str0ng@#$');

    cy.get('#btnRegister').click();

    cy.get('.swal-title').contains('Refused email');
  });

  it('should warn if the fields are not filled.', () => {
    cy.visit('http://localhost:4500/site/new-account.html');

    cy.get('#btnRegister').click();

    cy.get('.swal-title').contains('Please, fill in all the fields');
  });
});

describe('Return to the home page', () => {
  it('should return to the home page when clicking the link.', () => {
    cy.visit('http://localhost:4500/site/new-account.html');

    cy.get('.link').click();

    cy.get('.fw-normal').contains('Please log in');
  });
});
