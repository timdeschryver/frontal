import { browser, element, by, Key } from 'protractor';

export class SimplePage {
  navigateTo() {
    return browser.get('/');
  }

  getInput() {
    return element(by.id('input'));
  }

  getMenu() {
    return element(by.css('ul.menu'));
  }

  getSecondInMenu() {
    return this.getMenu()
      .all(by.css('li'))
      .get(1);
  }

  getHighlightedItem() {
    return element(by.css('li.highlight'));
  }

  getSelectedItem() {
    return element(by.id('selected'));
  }
}
