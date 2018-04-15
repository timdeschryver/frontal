describe('Frontal http', () => {
  before(() => {
    cy.visit('/http');
    cy.getInputByLabelText('Select a user').type('tdeschryver');
  });

  it('should render users', () => {
    cy
      .focused()
      .getControlled()
      .contains('tdeschryver');
  });

  it('should render the number of users found', () => {
    cy.contains('Users found: 1');
  });
});
