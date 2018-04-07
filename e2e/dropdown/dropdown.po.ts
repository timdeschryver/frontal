import { browser, element, by, Key, protractor } from 'protractor';

export class DropdownPage {
  navigateTo() {
    return browser.get('/dropdown');
  }

  getButton() {
    return element(by.css('[frontalButton]'));
  }

  getList() {
    return element(by.css('[frontalList]'));
  }
}
