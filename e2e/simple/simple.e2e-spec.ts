import { browser } from 'protractor';
import { Key } from 'selenium-webdriver';
import { heroes, filter, toJson } from '../../example/data/hero';
import { SimplePage } from './simple.po';
import { getActiveDescendant, getLabelForInput, getSelectedOption, getSelectedItem, getElementByText } from '../utils';

const query = 'm';
const heroesFiltered = filter(query);

describe('Frontal simple', () => {
  const page = new SimplePage();

  it('should initialize with a closed menu', () => {
    page.navigateTo();
    expect(page.getMenu().isPresent()).toBeFalsy();
  });

  it('should select the input on label click', () => {
    getLabelForInput(page.getInput(), label => label.click());
    expect(
      browser.driver
        .switchTo()
        .activeElement()
        .getAttribute('id'),
    ).toEqual(page.getInput().getAttribute('id'));
  });

  describe('on input', () => {
    it('should show the menu', () => {
      page.getInput().sendKeys(query);
      expect(page.getMenu().isPresent()).toBeTruthy();
    });

    it("shouldn't show a message that no heroes are found", () => {
      expect(getElementByText('No heroes found...').isPresent()).toBeFalsy();
    });
  });

  describe('move its highlighted index on arrow usages', () => {
    describe('arrow down', () => {
      it('should move down', () => {
        getActiveDescendant(page.getInput(), item => expect(item.isPresent()).toBeFalsy());
        page.getInput().sendKeys(Key.DOWN);
        getActiveDescendant(page.getInput(), item => {
          expect(item.isPresent()).toBeTruthy();
          expect(item.getText()).toBe(heroesFiltered[0].name);
          getSelectedOption(page.getMenu(), option => expect(option.getId()).toBe(item.getId()));
        });
        page.getInput().sendKeys(Key.DOWN);
        page.getInput().sendKeys(Key.DOWN);
        getActiveDescendant(page.getInput(), item => expect(item.getText()).toBe(heroesFiltered[2].name));
      });

      it('should move to the top if the last item is selected', () => {
        page.getInput().sendKeys(Key.DOWN);
        getActiveDescendant(page.getInput(), item => expect(item.getText()).toBe(heroesFiltered[0].name));
      });
    });

    describe('arrow up', () => {
      it('should move to the bottom if the first item is selected', () => {
        page.getInput().sendKeys(Key.UP);
        getActiveDescendant(page.getInput(), item => expect(item.getText()).toBe(heroesFiltered[2].name));
      });

      it('should move up', () => {
        page.getInput().sendKeys(Key.UP);
        getActiveDescendant(page.getInput(), item => expect(item.getText()).toBe(heroesFiltered[1].name));
      });
    });
  });

  describe('press enter', () => {
    it('should select the highlighted item', () => {
      page.getInput().sendKeys(Key.ENTER);
      expect(getSelectedItem()).toBe(toJson(heroesFiltered[1]));
    });

    it('should set the input value', () => {
      expect(page.getInput().getAttribute('value')).toBe(heroesFiltered[1].name);
    });

    it('should close the menu', () => {
      expect(page.getMenu().isPresent()).toBeFalsy();
    });
  });

  describe('press escape', () => {
    describe('on a closed menu', () => {
      it('should do nothing', () => {
        page.getInput().sendKeys(Key.ESCAPE);
        expect(page.getMenu().isPresent()).toBeFalsy();
        expect(page.getInput().getAttribute('value')).toBe(
          heroesFiltered[1].name,
          "because the menu is closed it shouldn't change its state",
        );
      });
    });

    describe('on a open menu', () => {
      it('should clear the selected item', () => {
        page.getInput().clear();
        page.getInput().sendKeys(query);
        page.getInput().sendKeys(Key.ESCAPE);
        expect(getSelectedItem()).toBe('');
      });

      it('should clear the input', () => {
        expect(page.getInput().getAttribute('value')).toBe('');
      });

      it('should close the menu', () => {
        expect(page.getMenu().isPresent()).toBeFalsy();
      });
    });
  });

  describe('mouse movements in an open menu', () => {
    it('should highlight an item on enter', () => {
      page.getInput().clear();
      page.getInput().sendKeys(query);

      // Wait for the animations to complete
      browser.driver.sleep(200);

      browser
        .actions()
        .mouseMove(page.getSecondInMenu())
        .perform();

      getActiveDescendant(
        page.getInput(),
        item => expect(item.isPresent()).toBeTruthy() && expect(item.getText()).toBe(heroesFiltered[1].name),
      );
    });

    it('should clear the highlighted item on leave', () => {
      browser
        .actions()
        .mouseMove(page.getInput())
        .perform();
      getActiveDescendant(page.getInput(), item => expect(item.isPresent()).toBeFalsy());
    });

    it('should select the highlighted item on click', () => {
      page.getSecondInMenu().click();
      expect(getSelectedItem()).toBe(toJson(heroesFiltered[1]));
      expect(page.getInput().getAttribute('value')).toBe(heroesFiltered[1].name);
      expect(page.getMenu().isPresent()).toBeFalsy();
    });
  });

  describe('enter random data', () => {
    it('should show a message that no heroes are found', () => {
      page.getInput().sendKeys('unknown hero');
      expect(getElementByText('No heroes found...').isPresent()).toBeTruthy();
    });
  });
});
