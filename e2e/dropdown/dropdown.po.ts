import { browser, element, by, Key, protractor } from 'protractor';

export class DropdownPage {
  navigateTo() {
    return browser.get('/dropdown');
  }

  getButton() {
    return element(by.css('[frontalButton]'));
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
