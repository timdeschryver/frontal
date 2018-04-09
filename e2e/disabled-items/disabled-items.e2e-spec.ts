import { browser } from 'protractor';
import { Key } from 'selenium-webdriver';
import { heroes, toJson } from '../../example/data/hero';
import { DisabaledItemsPage } from './disabled-items.po';
import { getSelectedItem, getControlledElement, getNthInList, getSelectedOption } from '../utils';

describe('Frontal disabled items', () => {
  const page = new DisabaledItemsPage();

  describe('arrow movements', () => {
    it('should skip the disabled items', () => {
      page.navigateTo();
      page.getInput().sendKeys('m');
      page.getInput().sendKeys(Key.BACK_SPACE);

      page.getInput().sendKeys(Key.DOWN);
      getControlledElement(page.getInput(), list =>
        getSelectedOption(list, option =>
          expect(option.getText()).toBe(heroes.filter(p => !p.disabled).map(p => p.name)[0]),
        ),
      );

      page.getInput().sendKeys(Key.DOWN);
      page.getInput().sendKeys(Key.DOWN);

      getControlledElement(page.getInput(), list =>
        getSelectedOption(list, option =>
          expect(option.getText()).toBe(heroes.filter(p => !p.disabled).map(p => p.name)[2]),
        ),
      );
    });
  });

  describe('mouse move on disabled items', () => {
    it("shouldn't highlight the item", () => {
      page.getInput().sendKeys('m');
      page.getInput().sendKeys(Key.BACK_SPACE);

      getControlledElement(page.getInput(), list => {
        browser
          .actions()
          .mouseMove(getNthInList(list, 2))
          .perform();

        getSelectedOption(list, option => expect(option.isPresent()).toBeFalsy());
      });
    });
  });

  describe('mouse click on disabled items', () => {
    it("shouldn't select the item", () => {
      getControlledElement(page.getInput(), list => {
        getNthInList(list, 2).click();
        expect(page.getInput().getAttribute('value')).toBe('');
      });
    });

    it("shouldn't close the menu", () => {
      getControlledElement(page.getInput(), list => expect(list.isPresent()).toBeTruthy());
    });
  });
});
