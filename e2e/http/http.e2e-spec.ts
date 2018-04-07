import { browser } from 'protractor';
import { HttpPage } from './http.po';
import { getElementByText, getControlledElement } from '../utils';

describe('Frontal http', () => {
  const page = new HttpPage();

  it('should show the list on input', () => {
    page.navigateTo();
    page.getInput().sendKeys('tdeschryver');
  });

  it('should show list items', () => {
    expect(page.getListItem().isPresent()).toBeTruthy();
  });

  it('should show the number of items found', () => {
    expect(getElementByText('Users found: 1').isPresent()).toBeTruthy();
  });
});
