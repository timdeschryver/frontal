import { browser, element, by, Key } from 'protractor';

export class SimplePage {
  navigateTo() {
    return browser.get('/simple');
  }

  getInput() {
    return element(by.css('[frontalInput]'));
  }

  getLabel() {
    return element(by.css('[frontalLabel]'));
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

  getNoMatch() {
    return element(by.css('.no-match'));
  }
}
