import { browser, element, by, Key } from 'protractor';

export class ReactivePage {
  navigateTo() {
    return browser.get('/reactive');
  }

  getInput() {
    return element(by.css('[frontalInput]'));
  }

  getSecondInMenu() {
    return element(by.css('ul.menu'))
      .all(by.css('li'))
      .get(1);
  }

  getResetButton() {
    return element(by.css('#reset'));
  }
}
