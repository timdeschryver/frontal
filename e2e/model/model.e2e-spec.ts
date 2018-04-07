import { browser } from 'protractor';
import { Key } from 'selenium-webdriver';
import { heroes, toJson } from '../../example/data/hero';
import { ModelPage } from './model.po';
import { getSelectedItem, getControlledElement, getNthInList } from '../utils';

describe('Frontal model', () => {
  const page = new ModelPage();

  it('should initialize with the selected hero', () => {
    page.navigateTo();
    expect(getSelectedItem()).toBe(toJson(heroes[3]));
  });

  it('should initialize with the hero name in the input field', () => {
    expect(page.getInput().getAttribute('value')).toBe(heroes[3].name);
  });

  describe('clear the input', () => {
    it('should clear the model', () => {
      Array.from({ length: 9 }, () => page.getInput().sendKeys(Key.BACK_SPACE));
      expect(getSelectedItem()).toBe('');
    });
  });

  describe('selecting an item', () => {
    it('should set the model value', () => {
      getControlledElement(page.getInput(), list => getNthInList(list, 1).click());
      expect(getSelectedItem()).toBe(toJson(heroes[1]));
    });
  });

  describe('reset the model', () => {
    it('should set the model value', () => {
      page.getResetButton().click();
      expect(getSelectedItem()).toBe(toJson(heroes[3]));
    });
  });
});
