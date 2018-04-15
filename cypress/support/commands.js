function getByTestId(id) {
  return cy.get(`[data-test="${id}"]`);
}

function getInputByLabelText(text) {
  return cy.contains(text).then(elem => {
    const id = elem.attr('id');
    return cy.get(`input[aria-labelledby="${id}"]`);
  });
}

function getControlled(subject) {
  const controls = subject.attr('aria-controls');
  return controls ? cy.get(`[id=${controls}]`) : null;
}

function getActiveDescendant(subject) {
  const descendant = subject.attr('aria-activedescendant');
  return descendant ? cy.get(`[id=${descendant}]`) : null;
}

function getSelected(subject) {
  return subject.get('[role=option][aria-selected=true]');
}

function getStatus() {
  return cy.get('[role="status"]');
}

Cypress.Commands.add('getByTestId', getByTestId);
Cypress.Commands.add('getInputByLabelText', getInputByLabelText);
Cypress.Commands.add('getStatus', getStatus);
Cypress.Commands.add('getControlled', { prevSubject: 'element' }, getControlled);
Cypress.Commands.add('getActiveDescendant', { prevSubject: 'element' }, getActiveDescendant);
Cypress.Commands.add('getSelected', { prevSubject: 'element' }, getSelected);
