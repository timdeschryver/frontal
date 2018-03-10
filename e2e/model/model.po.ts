import { browser, element, by, Key } from 'protractor';

export class ModelPage {
  navigateTo() {
    return browser.get('/model');
  }

  getInput() {
    return element(by.css('[frontalInput]'));
  }

  getSecondInMenu() {
    return element(by.css('ul.menu'))
      .all(by.css('li'))
      .get(1);
  }

  getSelectedItem() {
    return element(by.id('selected'));
  }

  getResetButton() {
    return element(by.css('#reset'));
  }
}
