import { browser } from 'protractor';
import { Key } from 'selenium-webdriver';
import { heroes, filter, toJson } from '../../example/data/hero';
import { SimplePage } from './simple.po';
import {
  getActiveDescendant,
  getLabelForInput,
  getSelectedOption,
  getSelectedItem,
  getElementByText,
  getControlledElement,
  getNthInList,
} from '../utils';

const query = 'm';
const heroesFiltered = filter(query);

describe('Frontal simple', () => {
  const page = new SimplePage();

  it('should initialize with a closed list', () => {
    page.navigateTo();
    getControlledElement(page.getInput(), list => expect(list.isPresent()).toBeFalsy());
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
    it('should show the list', () => {
      page.getInput().sendKeys(query);
      getControlledElement(page.getInput(), list => {
        expect(list.isPresent()).toBeTruthy();
        getLabelForInput(page.getInput(), label => {
          expect(list.getAttribute('aria-labelledby')).toBe(label.getAttribute('id'));
        });
      });
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

          getControlledElement(page.getInput(), list =>
            getSelectedOption(list, option => expect(option.getId()).toBe(item.getId())),
          );
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

    it('should close the list', () => {
      getControlledElement(page.getInput(), list => expect(list.isPresent()).toBeFalsy());
    });
  });

  describe('press escape', () => {
    describe('on a closed list', () => {
      it('should do nothing', () => {
        page.getInput().sendKeys(Key.ESCAPE);
        getControlledElement(page.getInput(), list => expect(list.isPresent()).toBeFalsy());
        expect(page.getInput().getAttribute('value')).toBe(
          heroesFiltered[1].name,
          "because the list is closed it shouldn't change its state",
        );
      });
    });

    describe('on a open list', () => {
      it('should clear the selected item', () => {
        page.getInput().clear();
        page.getInput().sendKeys(query);
        page.getInput().sendKeys(Key.ESCAPE);
        expect(getSelectedItem()).toBe('');
      });

      it('should clear the input', () => {
        expect(page.getInput().getAttribute('value')).toBe('');
      });

      it('should close the list', () => {
        getControlledElement(page.getInput(), list => expect(list.isPresent()).toBeFalsy());
      });
    });
  });

  describe('mouse movements in an open list', () => {
    it('should highlight an item on enter', () => {
      page.getInput().clear();
      page.getInput().sendKeys(query);

      // Wait for the animations to complete
      browser.driver.sleep(200);

      getControlledElement(page.getInput(), list =>
        browser
          .actions()
          .mouseMove(getNthInList(list, 1))
          .perform(),
      );

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
      getControlledElement(page.getInput(), list => {
        getNthInList(list, 1).click();
        expect(getSelectedItem()).toBe(toJson(heroesFiltered[1]));
        expect(page.getInput().getAttribute('value')).toBe(heroesFiltered[1].name);
        expect(list.isPresent()).toBeFalsy();
      });
    });
  });

  describe('enter random data', () => {
    it('should show a message that no heroes are found', () => {
      page.getInput().sendKeys('unknown hero');
      expect(getElementByText('No heroes found...').isPresent()).toBeTruthy();
    });
  });
});
