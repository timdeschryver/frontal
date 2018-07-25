import { By } from '@angular/platform-browser';
import { createComponent } from 'ngx-testing-library';
import { FrontalComponent, FrontalItemDirective, StatusMessagePipe, resetId, State, updateState } from '../src';

test('sanity check for attributes', async () => {
  const { items } = await setup();
  expect(Array.from(items)).toMatchSnapshot();
});

test('mouse down selects the item', async () => {
  const { item, frontal, mouseDown } = await setup({
    isOpen: true,
    highlightedIndex: 1,
    highlightedItem: 'foo',
  });

  mouseDown(item);
  expect(frontal.state.value).toMatchObject(
    expect.objectContaining({
      highlightedItem: null,
      highlightedIndex: null,
      selectedItem: 'uno',
      inputText: 'uno',
      inputValue: 'uno',
    }),
  );
});

test('mouse down closes the list', async () => {
  const { item, frontal, mouseDown } = await setup({ isOpen: true });

  mouseDown(item);
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ isOpen: false }));
});

test('mouse move sets the highlighted index', async () => {
  const { item, frontal, mouseMove } = await setup({ isOpen: true });

  mouseMove(item);
  expect(frontal.state.value).toMatchObject(
    expect.objectContaining({
      highlightedItem: 'uno',
      highlightedIndex: 0,
    }),
  );
});

test('mouse leave resets the highlighted index', async () => {
  const { item, frontal, mouseLeave } = await setup({
    isOpen: true,
    highlightedIndex: 0,
    highlightedItem: 'uno',
  });

  mouseLeave(item);
  expect(frontal.state.value).toMatchObject(
    expect.objectContaining({
      highlightedItem: null,
      highlightedIndex: null,
    }),
  );
});

test('highlighted index sets aria selected', async () => {
  const { items, mouseMove } = await setup({
    isOpen: true,
  });

  mouseMove(items[1]);
  expect(items[0].getAttribute('aria-selected')).toBe('false');
  expect(items[1].getAttribute('aria-selected')).toBe('true');

  mouseMove(items[0]);
  expect(items[0].getAttribute('aria-selected')).toBe('true');
  expect(items[1].getAttribute('aria-selected')).toBe('false');
});

async function setup(initialState: Partial<State> = {}) {
  const template = `
    <frontal>
      <ng-template>
        <div frontalItem [value]="'uno'"></div>
        <div frontalItem [value]="'dos'"></div>
        <div frontalItem [value]="'tres'"></div>
      </ng-template>
    </frontal>`;

  resetId();
  const { fixture, mouseDown, mouseLeave, mouseMove, container } = await createComponent(template, {
    declarations: [FrontalComponent, FrontalItemDirective, StatusMessagePipe],
  });

  const frontal = fixture.debugElement.query(By.css('frontal')).componentInstance as FrontalComponent;

  if (initialState) {
    frontal.actions.next(updateState(initialState));
  }

  fixture.changeDetectorRef.detectChanges();
  await fixture.whenStable();

  return {
    fixture,
    frontal,
    item: container.querySelector('[frontalItem]') as HTMLElement,
    items: container.querySelectorAll('[frontalItem]') as NodeListOf<HTMLElement>,
    mouseDown,
    mouseLeave,
    mouseMove,
  };
}
