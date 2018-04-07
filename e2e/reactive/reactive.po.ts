import { browser, element, by, Key } from 'protractor';

export class ReactivePage {
  navigateTo() {
    return browser.get('/reactive');
  }

  getInput() {
    return element(by.css('[frontalInput]'));
  }

  getResetButton() {
    return element(by.css('#reset'));
  }
}
