import { browser } from 'protractor';
import { heroes, toJson } from '../../example/data/hero';
import { DropdownPage } from './dropdown.po';

describe('Frontal dropdown', () => {
  const page = new DropdownPage();

  it('should initialize with a closed menu', () => {
    page.navigateTo();
    expect(page.getMenu().isPresent()).toBeFalsy();
  });

  it('should show the menu on click', () => {
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
      expect(page.getHighlightedItem().isPresent()).toBeTruthy();
      expect(page.getHighlightedItem().getText()).toBe(heroes[1].name);
    });

    it('should clear the highlighted item on leave', () => {
      browser
        .actions()
        .mouseMove(page.getSelectedHeader())
        .perform();
      expect(page.getHighlightedItem().isPresent()).toBeFalsy();
    });
  });

  describe('mouse click on item', () => {
    it('should select the highlighted item', () => {
      page.getSecondInMenu().click();
      expect(page.getSelectedItem().getAttribute('value')).toBe(toJson(heroes[1]));
    });

    it('should set the button text', () => {
      expect(page.getButton().getText()).toBe(heroes[1].name);
    });

    it('should close the menu', () => {
      expect(page.getMenu().isPresent()).toBeFalsy();
    });
  });
});
