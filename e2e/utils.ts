import { browser, element, by, Key, ElementFinder, protractor } from 'protractor';

export function getLabelForInput(elem: ElementFinder, fun: (label: ElementFinder) => void) {
  elem.getAttribute('aria-labelledby').then(id => fun(element(by.id(id))));
}

export function getActiveDescendant(elem: ElementFinder, fun: (item: ElementFinder) => void) {
  elem.getAttribute('aria-activedescendant').then(id => fun(element(by.id(id))));
}

export function getSelectedOption(elem: ElementFinder, fun: (item: ElementFinder) => void) {
  fun(elem.element(by.css('[role=option][aria-selected=true]')));
}

export function getSelectedItem() {
  return element(by.css('[data-test="selected-value"]'))
    .getText()
    .then(value => (value === 'null' ? '' : JSON.stringify(JSON.parse(value))));
}

export function getElementByText(text: string) {
  return element(by.xpath(`//*[contains(text(), "${text}")]`));
}

export function getAlert() {
  browser.wait(protractor.ExpectedConditions.alertIsPresent(), 200);
  return browser.switchTo().alert();
}
