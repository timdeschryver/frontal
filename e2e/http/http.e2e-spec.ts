import { browser } from 'protractor';
import { HttpPage } from './http.po';
import { getElementByText } from '../utils';

describe('Frontal http', () => {
  const page = new HttpPage();

  it('should show the menu on input', () => {
    page.navigateTo();
    page.getInput().sendKeys('tdeschryver');
    browser.wait(page.getMenu().isPresent(), 1000);
  });

  it('should show list items', () => {
    expect(page.getListItem().isPresent()).toBeTruthy();
  });

  it('should show the number of items found', () => {
    expect(getElementByText('Users found: 1').isPresent()).toBeTruthy();
  });
});
