describe('Frontal reactive', () => {
  before(() => {
    cy.visit('/reactive');
  });

  describe('default state', () => {
    it('should have a selected hero', () => {
      cy.getByTestId('selected-item').contains(`"name": "Celeritas"`);
    });

    it('should have a text value', () => {
      cy.getInputByLabelText('Select your hero').should('have.value', 'Celeritas');
    });
  });

  describe('clear the input', () => {
    before(() => {
      cy.getInputByLabelText('Select your hero').clear();
    });

    it('should clear the selected hero', () => {
      cy.getByTestId('selected-item').contains('null');
    });
  });

  describe('select an item', () => {
    before(() => {
      cy.getInputByLabelText('Select your hero').type('m{downarrow}{enter}');
    });

    it('should set the model value', () => {
      cy.getByTestId('selected-item').contains(`"name": "Mr. Nice"`);
    });
  });

  describe('reset the form', () => {
    before(() => {
      cy.getByTestId('reset').click();
    });

    it('should set the model', () => {
      cy.getByTestId('selected-item').contains(`"name": "Celeritas"`);
    });
  });
});
