import { browser, element, by } from 'protractor';

export class DisabaledItemsPage {
  navigateTo() {
    return browser.get('/disabled-items');
  }

  getInput() {
    return element(by.css('[frontalInput]'));
  }
}
