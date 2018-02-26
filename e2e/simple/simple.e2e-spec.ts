import { SimplePage } from './simple.po';
import { browser } from 'protractor';
import { Key } from 'selenium-webdriver';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

jasmine.getEnv().addReporter({
  specDone: ({ id, fullName }) => {
    browser.takeScreenshot().then(screenshot => {
      const folder = join(__dirname, 'screenshots');
      if (!existsSync(folder)) {
        mkdirSync(folder);
      }
      var stream = createWriteStream(join(folder, `${id}-${fullName.replace(/\s+/g, '-').toLowerCase()}.png`));
      stream.write(new Buffer(screenshot, 'base64'));
      stream.end();
    });
  },
});

const page = new SimplePage();
describe('Frontal simple', function() {
  page.navigateTo();

  it('should initialize with a closed menu', () => {
    expect(page.getMenu().isPresent()).toBeFalsy();
  });

  it('should show the menu on input', () => {
    page.getInput().sendKeys('m');
    expect(page.getMenu().isPresent()).toBeTruthy();
  });

  describe('move its highlighted index on arrow usages', () => {
    describe('arrow down', () => {
      it('should move down', () => {
        expect(page.getHighlightedItem().isPresent()).toBeFalsy();
        page.getInput().sendKeys(Key.DOWN);
        expect(page.getHighlightedItem().isPresent()).toBeTruthy();
        expect(page.getHighlightedItem().getText()).toBe('Mr. Nice');
        page.getInput().sendKeys(Key.DOWN);
        page.getInput().sendKeys(Key.DOWN);
        expect(page.getHighlightedItem().getText()).toBe('Magma');
      });

      it('should move to the top if the last item is selected', () => {
        page.getInput().sendKeys(Key.DOWN);
        expect(page.getHighlightedItem().getText()).toBe('Mr. Nice');
      });
    });

    describe('arrow up', () => {
      it('should move to the bottom if the first item is selected', () => {
        page.getInput().sendKeys(Key.UP);
        expect(page.getHighlightedItem().getText()).toBe('Magma');
      });

      it('should move up', () => {
        page.getInput().sendKeys(Key.UP);
        expect(page.getHighlightedItem().getText()).toBe('Magneta');
      });
    });
  });

  describe('press enter', () => {
    it('should select the highlighted item', () => {
      page.getInput().sendKeys(Key.ENTER);
      expect(page.getSelectedItem().getAttribute('value')).toBe(
        JSON.stringify({ id: 15, name: 'Magneta', disabled: false }),
      );
    });

    it('should set the input value', () => {
      expect(page.getInput().getAttribute('value')).toBe('Magneta');
    });

    it('should close the menu', () => {
      expect(page.getMenu().isPresent()).toBeFalsy();
    });
  });

  describe('press escape', () => {
    it('should close the menu', () => {
      page.getInput().clear();
      page.getInput().sendKeys('m');
      page.getInput().sendKeys(Key.ESCAPE);
      expect(page.getMenu().isPresent()).toBeFalsy();
    });
  });
});
