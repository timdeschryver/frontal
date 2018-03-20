import { browser, element, by, Key } from 'protractor';

export class ReducerPage {
  navigateTo() {
    return browser.get('/reducer');
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
