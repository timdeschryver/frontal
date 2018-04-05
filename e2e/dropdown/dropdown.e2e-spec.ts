import { browser, protractor } from 'protractor';
import { heroes, toJson } from '../../example/data/hero';
import { DropdownPage } from './dropdown.po';
import { getActiveDescendant, getSelectedOption, getSelectedItem, getAlert } from '../utils';

describe('Frontal dropdown', () => {
  const page = new DropdownPage();

  it('should initialize with an open menu', () => {
    page.navigateTo();
    expect(page.getMenu().isPresent()).toBeTruthy();
  });

  it('should highlight an item on mouse enter', () => {
    browser
      .actions()
      .mouseMove(page.getSecondInMenu())
      .perform();

    // first mouse move has a problem with frontalItems not being updated
    browser
      .actions()
      .mouseMove(page.getSecondInMenu())
      .perform();

    getSelectedOption(
      page.getMenu(),
      item => expect(item.isPresent()).toBeTruthy() && expect(item.getText()).toBe(heroes[1].name),
    );
  });

  it('should toggle the menu on click', () => {
    browser
      .actions()
      .click(page.getButton())
      .perform();
    expect(page.getMenu().isPresent()).toBeFalsy();

    browser
      .actions()
      .click(page.getButton())
      .perform();
    expect(page.getMenu().isPresent()).toBeTruthy();
  });

  describe('mouse movements in an open menu', () => {
    it('should highlight an item on enter', () => {
      browser
        .actions()
        .mouseMove(page.getSecondInMenu())
        .perform();

      getSelectedOption(
        page.getMenu(),
        item => expect(item.isPresent()).toBeTruthy() && expect(item.getText()).toBe(heroes[1].name),
      );
    });

    it('should clear the highlighted item on leave', () => {
      browser
        .actions()
        .mouseMove(page.getButton())
        .perform();
      getSelectedOption(page.getMenu(), item => expect(item.isPresent()).toBeFalsy());
    });
  });

  describe('mouse click on item', () => {
    it('should show an alert', () => {
      page.getSecondInMenu().click();
      const alert = getAlert();
      expect(alert.getText()).toContain(heroes[1].name);
      alert.dismiss();
    });

    it('should select the item', () => {
      expect(getSelectedItem()).toBe(toJson(heroes[1]));
    });

    it('should set the button text', () => {
      expect(page.getButton().getText()).toBe(heroes[1].name);
    });

    it('should close the menu', () => {
      expect(page.getMenu().isPresent()).toBeFalsy();
    });
  });
});
