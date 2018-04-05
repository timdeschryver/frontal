import { browser, element, by, Key } from 'protractor';

export class SimplePage {
  navigateTo() {
    return browser.get('/simple');
  }

  getInput() {
    return element(by.css('[frontalInput]'));
  }

  getMenu() {
    return element(by.css('ul.menu'));
  }

  getSecondInMenu() {
    return this.getMenu()
      .all(by.css('li'))
      .get(1);
  }
}
