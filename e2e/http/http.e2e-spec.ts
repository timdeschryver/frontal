import { browser } from 'protractor';
import { Key } from 'selenium-webdriver';
import { HttpPage } from './http.po';

describe('Frontal http', () => {
  const page = new HttpPage();

  it('should show the menu on input', () => {
    page.navigateTo();
    page.getInput().sendKeys('tdeschryver');
    browser.wait(page.getMenu().isPresent(), 1000);
  });
});
