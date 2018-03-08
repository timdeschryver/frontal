import { browser, element, by, Key } from 'protractor';

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

  getHighlightedItem() {
    return element(by.css('li.highlight'));
  }

  getSelectedItem() {
    return element(by.id('selected'));
  }

  getSelectedHeader() {
    return element(by.css('h4'));
  }
}
