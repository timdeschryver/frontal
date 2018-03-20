import { browser } from 'protractor';
import { Key } from 'selenium-webdriver';
import { heroes, filter, toJson } from '../../example/data/hero';
import { ReducerPage } from './reducer.po';

const query = 'm';
const heroesFiltered = filter(query);

describe('Frontal reducer', () => {
  const page = new ReducerPage();

  describe('move its highlighted index on arrow usages', () => {
    it('should set the input text to the highlighted item', () => {
      page.navigateTo();
      page.getInput().sendKeys(query);
      page.getInput().sendKeys(Key.DOWN);
      expect(page.getHighlightedItem().isPresent()).toBeTruthy();
      expect(page.getInput().getAttribute('value')).toBe(heroesFiltered[0].name);
    });
  });

  describe('mouse movements in an open menu', () => {
    it('should not highlight an item on enter', () => {
      browser
        .actions()
        .mouseMove(page.getSecondInMenu())
        .perform();
      expect(page.getHighlightedItem().getText()).toBe(heroesFiltered[0].name);
    });

    it('should not select an item on click', () => {
      browser
        .actions()
        .mouseMove(page.getSecondInMenu())
        .click()
        .perform();
      expect(page.getInput().getAttribute('value')).toBe(heroesFiltered[0].name);
      expect(page.getSelectedItem().getAttribute('value')).toBe('');
    });
  });
});
