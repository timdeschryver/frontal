describe('Frontal simple', () => {
  before(() => {
    cy.visit('/simple');
  });

  describe('default state', () => {
    it('should be able to click on the label', () => {
      cy.contains('Select your hero').click();
    });

    it('should have a closed list', () => {
      cy
        .focused()
        .getControlled()
        .should('not.exist');
    });

    it("shouldn't have an activated item", () => {
      cy
        .focused()
        .getActiveDescendant()
        .should('not.exist');
    });

    it('should have an empty status', () => {
      cy.getStatus().should('be.empty');
    });
  });

  describe('text input', () => {
    before(() => {
      // clicking on the label doesn't immediately set the focused elemt to the input?
      cy
        .getInputByLabelText('Select your hero')
        .focus()
        .clear()
        .type('m');
    });

    it('should show the list', () => {
      cy
        .focused()
        .getControlled()
        .should('exist');
    });

    it("shouldn't activate an item", () => {
      cy
        .focused()
        .getActiveDescendant()
        .should('not.exist');
    });

    it('should have a item-count status', () => {
      cy.getStatus().contains('3 results are available, use up and down arrow keys to navigate.');
    });

    it("shouldn't show a message that no heroes are found", () => {
      cy.contains('No heroes found...').should('not.exist');
    });
  });

  describe('text blur', () => {
    before(() => {
      cy
        .getInputByLabelText('Select your hero')
        .focus()
        .clear()
        .type('m')
        .blur();
    });

    testNoValue();
  });

  describe('key handles', () => {
    describe('arrow down', () => {
      before(() => {
        cy
          .getInputByLabelText('Select your hero')
          .focus()
          .clear()
          .type('m')
          .type('{downarrow}{downarrow}');
      });

      testActive('Magneta');

      it('should move to the top if the last item is selected', () => {
        cy
          .focused()
          .type('{downarrow}{downarrow}')
          .getActiveDescendant()
          .contains('Mr. Nice');
      });
    });

    describe('arrow up', () => {
      before(() => {
        cy
          .getInputByLabelText('Select your hero')
          .focus()
          .clear()
          .type('m')
          .type('{downarrow}{downarrow}{uparrow}');
      });

      testActive('Mr. Nice');

      it('should move to the bottom if the first item is selected', () => {
        cy
          .focused()
          .type('{uparrow}')
          .getActiveDescendant()
          .contains('Magma');
      });
    });

    describe('enter', () => {
      before(() => {
        cy
          .getInputByLabelText('Select your hero')
          .focus()
          .clear()
          .type('m')
          .type('{downarrow}{downarrow}{enter}');
      });

      testSelect('Magneta');
    });

    describe('escape', () => {
      describe('on an open list', () => {
        before(() => {
          cy
            .getInputByLabelText('Select your hero')
            .focus()
            .type('m')
            .type('{esc}');
        });

        testNoValue();
      });

      describe('on a closed list', () => {
        before(() => {
          cy
            .getInputByLabelText('Select your hero')
            .focus()
            .type('m')
            .type('{downarrow}{enter}')
            .type('{esc}');
        });

        testSelect('Mr. Nice');
      });
    });
  });

  describe('mouse actions', () => {
    before(() => {
      cy
        .getInputByLabelText('Select your hero')
        .focus()
        .clear()
        .type('m');
    });

    describe('hover', () => {
      before(() => {
        cy.contains('Magneta').trigger('mousemove');
      });

      testActive('Magneta');
    });

    describe('mouseleave', () => {
      before(() => {
        cy.contains('Magneta').trigger('mousemove');
        cy.contains('Magneta').trigger('mouseleave');
      });

      it('should deactivate an item on leave', () => {
        cy
          .focused()
          .getActiveDescendant()
          .should('not.exist');
      });

      it('should have a item-count status', () => {
        cy.getStatus().contains('3 results are available, use up and down arrow keys to navigate.');
      });
    });

    describe('mouse click', () => {
      before(() => {
        cy
          .getInputByLabelText('Select your hero')
          .focus()
          .clear()
          .type('m');
        cy.contains('Magneta').click();
      });

      testSelect('Magneta');
    });

    describe('mouse click outside the list', () => {
      before(() => {
        cy
          .getInputByLabelText('Select your hero')
          .focus()
          .clear()
          .type('m');

        cy.getByTestId('selected-item').click();
      });

      testNoValue();
    });
  });

  describe('no items found', () => {
    before(() => {
      cy
        .getInputByLabelText('Select your hero')
        .focus()
        .clear()
        .type('foobar');
    });

    it('should have a no-results status', () => {
      cy.getStatus().contains('No results.');
    });

    it('should a message that no heroes are found', () => {
      cy.contains('No heroes found...').should('exist');
    });
  });

  function testActive(name) {
    it('should have an activated item', () => {
      cy
        .focused()
        .getActiveDescendant()
        .contains(name);
    });

    it('should have a selected item', () => {
      cy
        .focused()
        .getControlled()
        .getSelected()
        .contains(name);
    });

    it('should have a selected-item status', () => {
      cy.getStatus().contains(name);
    });
  }

  function testSelect(name) {
    it('should set the actived item', () => {
      cy.getByTestId('selected-item').contains(`"name": "${name}"`);
    });

    it('should set the input value', () => {
      cy.focused().should('have.value', name);
    });

    it('should close the list', () => {
      cy
        .focused()
        .getControlled()
        .should('not.exist');
    });

    it("shouldn't have an activated item", () => {
      cy
        .focused()
        .getActiveDescendant()
        .should('not.exist');
    });
  }

  function testNoValue() {
    it('should clear the input value', () => {
      cy.getInputByLabelText('Select your hero').should('have.value', '');
    });

    it('should clear the selected item', () => {
      cy.getByTestId('selected-item').contains('null');
    });

    it('should close the list', () => {
      cy
        .getInputByLabelText('Select your hero')
        .getControlled()
        .should('not.exist');
    });

    it("shouldn't have an activated item", () => {
      cy
        .getInputByLabelText('Select your hero')
        .getActiveDescendant()
        .should('not.exist');
    });

    it('should have an empty status', () => {
      cy.getStatus().should('be.empty');
    });
  }
});
