import { browser, element, by } from 'protractor';

export class HttpPage {
  navigateTo() {
    return browser.get('/http');
  }

  getInput() {
    return element(by.css('[frontalInput]'));
  }

  getMenu() {
    return element(by.css('ul.menu'));
  }

  getMenuItems() {
    return this.getMenu().all(by.css('li'));
  }

  getListItem() {
    return element.all(by.cssContainingText('li', 'tdeschryver'));
  }

  getItemCount() {
    return element(by.id('item-count'));
  }
}
