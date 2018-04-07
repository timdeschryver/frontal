import { browser, element, by, Key } from 'protractor';

export class ReducerPage {
  navigateTo() {
    return browser.get('/reducer');
  }

  getInput() {
    return element(by.css('[frontalInput]'));
  }
}
