describe('Frontal reducer', () => {
  before(() => {
    cy.visit('/reducer');
  });

  describe('input focus', () => () => {
    before(() => {
      cy
        .getInputByLabelText('Select your hero')
        .focus()
        .clear();
    });

    it('should open the list', () => {
      cy
        .focused()
        .getControlled()
        .should('exist');
    });
  });

  describe('arrow usage', () => {
    before(() => {
      cy
        .getInputByLabelText('Select your hero')
        .focus()
        .clear()
        .type('{downarrow}');
    });

    it('should set the input value when an item is active', () => {
      cy.focused().should('have.value', 'Mr. Nice');
    });
  });

  describe('mouse movements', () => {
    before(() => {
      cy
        .getInputByLabelText('Select your hero')
        .focus()
        .clear();
    });

    it("shouldn't highlight an item on mouse enter", () => {
      cy.contains('Magneta').trigger('mousemove');
      cy
        .focused()
        .getActiveDescendant()
        .should('not.exist');
    });

    it("shouldn't select an item on mouse click", () => {
      cy.contains('Magneta').click();
      cy.getInputByLabelText('Select your hero').should('have.value', '');
    });
  });
});
