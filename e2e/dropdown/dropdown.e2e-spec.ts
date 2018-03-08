import { browser } from 'protractor';
import { Key } from 'selenium-webdriver';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { heroes } from '../../example/data/hero';
import { DropdownPage } from './dropdown.po';

jasmine.getEnv().addReporter({
  specDone: ({ id, fullName }) => {
    browser.takeScreenshot().then(screenshot => {
      const folder = join(__dirname, 'screenshots');
      if (!existsSync(folder)) {
        mkdirSync(folder);
      }
      const stream = createWriteStream(join(folder, `${id}-${fullName.replace(/\s+/g, '-').toLowerCase()}.png`));
      stream.write(new Buffer(screenshot, 'base64'));
      stream.end();
    });
  },
});

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
  });

  describe('mouse click on item', () => {
    it('should select the highlighted item', () => {
      browser
        .actions()
        .click()
        .perform();
      expect(page.getSelectedItem().getAttribute('value')).toBe(JSON.stringify(heroes[1]));
    });

    it('should set the button text', () => {
      expect(page.getButton().getText()).toBe(heroes[1].name);
    });

    it('should close the menu', () => {
      expect(page.getMenu().isPresent()).toBeFalsy();
    });
  });
});
