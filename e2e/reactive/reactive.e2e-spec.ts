import { browser } from 'protractor';
import { Key } from 'selenium-webdriver';
import { heroes, toJson } from '../../example/data/hero';
import { ReactivePage } from './reactive.po';
import { getSelectedItem } from '../utils';

describe('Frontal reactive', () => {
  const page = new ReactivePage();

  it('should initialize with the selected hero', () => {
    page.navigateTo();
    expect(getSelectedItem()).toBe(toJson(heroes[3]));
    expect(page.getInput().getAttribute('value')).toBe(heroes[3].name);
  });

  describe('clear the input', () => {
    it('should clear the form value', () => {
      Array.from({ length: 9 }, () => page.getInput().sendKeys(Key.BACK_SPACE));
      expect(getSelectedItem()).toBe('');
    });
  });

  describe('selecting an item', () => {
    it('should set the model value', () => {
      page.getSecondInMenu().click();
      expect(getSelectedItem()).toBe(toJson(heroes[1]));
    });
  });

  describe('reset the model', () => {
    it('should reset the model value', () => {
      page.getResetButton().click();
      expect(getSelectedItem()).toBe(toJson(heroes[3]));
    });
  });
});
