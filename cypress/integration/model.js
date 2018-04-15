describe('Frontal model', () => {
  before(() => {
    cy.visit('/model');
  });

  describe('default state', () => {
    it('should have a selected hero', () => {
      cy.getByTestId('selected-item').contains(`"name": "Celeritas"`);
    });

    it('should have a text value', () => {
      cy.getInputByLabelText('Select your hero').should('have.value', 'Celeritas');
    });

    it('should have a selected-item status', () => {
      cy.getStatus().contains('Celeritas');
    });
  });

  describe('clear the input', () => {
    before(() => {
      cy.getInputByLabelText('Select your hero').clear();
    });

    it('should clear the selected hero', () => {
      cy.getByTestId('selected-item').contains('null');
    });

    it('should have a item-count status', () => {
      cy.getStatus().contains('10 results are available, use up and down arrow keys to navigate.');
    });
  });

  describe('select an item', () => {
    before(() => {
      cy.getInputByLabelText('Select your hero').type('m{downarrow}{enter}');
    });

    it('should set the model value', () => {
      cy.getByTestId('selected-item').contains(`"name": "Mr. Nice"`);
    });

    it('should have a selected-item status', () => {
      cy.getStatus().contains('Mr. Nice');
    });
  });

  describe('reset the form', () => {
    before(() => {
      cy.getByTestId('reset').click();
    });

    it('should set the model', () => {
      cy.getByTestId('selected-item').contains(`"name": "Celeritas"`);
    });

    it('should have a selected-item status', () => {
      cy.getStatus().contains('Celeritas');
    });
  });
});
