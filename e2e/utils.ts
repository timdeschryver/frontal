import { browser, element, by, Key, ElementFinder, protractor } from 'protractor';

export function getLabelForInput(elem: ElementFinder, fun: (label: ElementFinder) => void) {
  getAttributesElement('aria-labelledby', elem, fun);
}

export function getActiveDescendant(elem: ElementFinder, fun: (item: ElementFinder) => void) {
  getAttributesElement('aria-activedescendant', elem, fun);
}

export function getControlledElement(elem: ElementFinder, fun: (item: ElementFinder) => void) {
  getAttributesElement('aria-controls', elem, fun);
}

export function getSelectedOption(elem: ElementFinder, fun: (item: ElementFinder) => void) {
  fun(elem.element(by.css('[role=option][aria-selected=true]')));
}

export function getSelectedItem() {
  return element(by.css('[data-test="selected-item"]'))
    .getText()
    .then(value => (value === 'null' ? '' : JSON.stringify(JSON.parse(value))));
}

export function getNthInList(list: ElementFinder, nth: number, selector = 'li') {
  return list.all(by.css(selector)).get(nth);
}

export function getElementByText(text: string) {
  return element(by.xpath(`//*[contains(text(), "${text}")]`));
}

export function getAlert() {
  browser.wait(protractor.ExpectedConditions.alertIsPresent(), 200);
  return browser.switchTo().alert();
}

function getAttributesElement(attribute: string, elem: ElementFinder, fun: (label: ElementFinder) => void) {
  elem.getAttribute(attribute).then(id => fun(element(by.id(id))));
}
