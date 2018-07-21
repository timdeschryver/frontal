describe('Frontal disabled items', () => {
  before(() => {
    cy.visit('/disabled-items');
  });

  describe('arrow movements', () => {
    before(() => {
      cy.getInputByLabelText('Select your hero')
        .focus()
        .clear()
        .type('m{backspace}');
    });

    it('should skip disabled items', () => {
      cy.focused().type('{downarrow}{downarrow}{downarrow}');
      cy.focused()
        .getActiveDescendant()
        .contains('Celeritas');
    });
  });

  describe('mouse movements', () => {
    before(() => {
      cy.getInputByLabelText('Select your hero')
        .focus()
        .clear()
        .type('m{backspace}');
    });

    it("shouldn't activate a disabled item", () => {
      cy.contains('Bombasto')
        .trigger('mousemove')
        .then(() => {
          cy.wait(25).then(() => {
            cy.focused()
              .getActiveDescendant()
              .should('not.exist');
            cy.contains('Bombasto').trigger('mouseleave');
          });
        });
    });

    it('should activate an enabled item', () => {
      cy.contains('Narco')
        .trigger('mousemove')
        .then(() => {
          cy.wait(25).then(() => {
            cy.focused()
              .getActiveDescendant()
              .should('exist');
            cy.contains('Narco').trigger('mouseleave');
          });
        });
    });
  });

  describe('mouse click', () => {
    describe('on a disabled item', () => {
      before(() => {
        cy.getInputByLabelText('Select your hero')
          .focus()
          .clear()
          .type('m{backspace}');

        cy.contains('Bombasto').click();
      });

      it("shouldn't set the value", () => {
        cy.getInputByLabelText('Select your hero').should('have.value', '');
      });

      it("shouldn't close the list", () => {
        cy.getInputByLabelText('Select your hero')
          .getControlled()
          .should('exist');
      });
    });

    describe('on an enabled item', () => {
      before(() => {
        cy.getInputByLabelText('Select your hero')
          .focus()
          .clear()
          .type('m{backspace}');

        cy.contains('Celeritas').click();
      });

      it('should set the value', () => {
        cy.getInputByLabelText('Select your hero').should('have.value', 'Celeritas');
      });

      it('should close the list', () => {
        cy.getInputByLabelText('Select your hero')
          .getControlled()
          .should('not.exist');
      });
    });
  });
});
