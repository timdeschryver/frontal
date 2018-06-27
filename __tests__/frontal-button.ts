import { By } from '@angular/platform-browser';
import { createComponent } from 'ngx-testing-library';
import { FrontalComponent, FrontalButtonDirective, StatusMessagePipe, resetId } from '../src';

test('sanity check for attributes', async () => {
  const { button } = await setup();
  expect(button).toMatchSnapshot();
});

test('clicking on the button toggles the list', async () => {
  const {
    click,
    frontal: { state },
  } = await setup();

  click();
  expect(state).toMatchObject(expect.objectContaining({ isOpen: true, highlightedIndex: 0 }));

  click();
  expect(state).toMatchObject(expect.objectContaining({ isOpen: false, highlightedIndex: null }));
});

test('isOpen toggles the aria label', async () => {
  const { button, click } = await setup();

  click();
  expect(button.getAttribute('aria-label')).toBe('close menu');

  click();
  expect(button.getAttribute('aria-label')).toBe('open menu');
});

async function setup() {
  const template = `
    <frontal [defaultHighlightedIndex]="0">
      <ng-template>
        <button frontalButton></button>
      </ng-template>
    </frontal>`;

  resetId();
  const { click, container, fixture } = await createComponent(template, {
    declarations: [FrontalComponent, FrontalButtonDirective, StatusMessagePipe],
  });

  const button = container.querySelector('button') as HTMLElement;
  return {
    frontal: fixture.debugElement.query(By.css('frontal')).componentInstance,
    button,
    click: () => click(button),
  };
}
