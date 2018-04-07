import { browser, element, by, Key } from 'protractor';

export class SimplePage {
  navigateTo() {
    return browser.get('/simple');
  }

  getInput() {
    return element(by.css('[frontalInput]'));
  }
}
