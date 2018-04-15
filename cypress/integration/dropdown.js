describe('Frontal dropdown', () => {
  before(() => {
    cy.visit('/dropdown');
  });

  describe('default state', () => {
    it('should have an open list', () => {
      cy.get('[frontalList]').should('exist');
    });

    it('should activate an item on hover', () => {
      cy.contains('Magneta').trigger('mousemove');
      cy
        .get('[frontalList]')
        .getSelected()
        .contains('Magneta');
    });
  });

  describe('toggle button', () => {
    it('should close on click', () => {
      cy.get('[frontalButton]').click();
      cy.get('[frontalList]').should('not.exist');
    });

    it('should open on click', () => {
      cy.get('[frontalButton]').click();
      cy.get('[frontalList]').should('exist');
    });
  });

  describe('list actions', () => {
    it('should activate an item on hover', () => {
      cy.contains('Magneta').trigger('mousemove');
      cy
        .get('[frontalList]')
        .getSelected()
        .contains('Magneta');
    });

    it('should deactivate an item on leave', () => {
      cy.contains('Magneta').trigger('mouseleave');
      cy
        .get('[frontalList]')
        .getSelected()
        .should('not.exist');
    });

    it('should select an item on click', () => {
      cy.contains('Magneta').click();
      cy.get('[frontalButton]').contains('Magneta');

      cy.get('[frontalList]').should('not.exist');
      cy.getByTestId('selected-item').contains(`"name": "Magneta"`);
    });
  });
});
