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

  getListItem() {
    return element(by.cssContainingText('li', 'tdeschryver'));
  }
}
