import { browser, element, by, Key } from 'protractor';

export class ModelPage {
  navigateTo() {
    return browser.get('/model');
  }

  getInput() {
    return element(by.css('[frontalInput]'));
  }

  getResetButton() {
    return element(by.css('#reset'));
  }
}
