describe('Frontal http', () => {
  before(() => {
    cy.visit('/http');
    cy.getInputByLabelText('Select a user').type('timdeschryver');
  });

  it('should render users', () => {
    cy.focused()
      .getControlled()
      .contains('timdeschryver');
  });

  it('should render the number of users found', () => {
    cy.contains('Users found: 1');
  });

  it('should activate the first item', () => {
    cy.focused()
      .getActiveDescendant()
      .contains('timdeschryver');
  });

  it('should select the first item', () => {
    cy.focused()
      .getControlled()
      .getSelected()
      .contains('timdeschryver');
  });

  it('should set the selected-item status', () => {
    cy.getStatus().contains('timdeschryver');
  });

  it('pressing enter should select the highlighted item', () => {
    cy.getInputByLabelText('Select a user').type('{enter}');
    cy.focused().should('have.value', 'timdeschryver');
    cy.focused()
      .getControlled()
      .should('not.exist');
    cy.focused()
      .getActiveDescendant()
      .should('not.exist');
  });
});
