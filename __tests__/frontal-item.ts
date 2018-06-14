import { Component } from '@angular/core';
import { createComponent, fireEvent } from 'ngx-testing-library';
import { FrontalComponent, FrontalItemDirective, StatusMessagePipe, resetId } from '../src';

test('sanity check for attributes', async () => {
  const { items } = await setup();
  expect(Array.from(items)).toMatchSnapshot();
});

test('mouse down selects the item', async () => {
  const { item, frontal } = await setup();
  frontal.state.isOpen = true;
  frontal.state.highlightedIndex = 1;
  frontal.state.highlightedItem = 'foo';

  fireEvent.mouseDown(item);
  expect(frontal.state).toMatchObject(
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
  const { item, frontal } = await setup();
  frontal.state.isOpen = true;

  fireEvent.mouseDown(item);
  expect(frontal.state).toMatchObject(expect.objectContaining({ isOpen: false }));
});

test('mouse move sets the highlighted index', async () => {
  const { fixture, item, frontal } = await setup();
  frontal.state.isOpen = true;

  fireEvent.mouseMove(item);
  expect(frontal.state).toMatchObject(
    expect.objectContaining({
      highlightedItem: 'uno',
      highlightedIndex: 0,
    }),
  );
});

test('mouse leave resets the highlighted index', async () => {
  const { item, frontal } = await setup();
  frontal.state.isOpen = true;
  frontal.state.highlightedIndex = 0;
  frontal.state.highlightedItem = 'uno';

  fireEvent.mouseLeave(item);
  expect(frontal.state).toMatchObject(
    expect.objectContaining({
      highlightedItem: null,
      highlightedIndex: null,
    }),
  );
});

test('highlighted index sets aria selected', async () => {
  const { fixture, items, frontal } = await setup();
  frontal.isOpen = true;

  fireEvent.mouseMove(items[1]);
  expect(items[0].getAttribute('aria-selected')).toBe('false');
  expect(items[1].getAttribute('aria-selected')).toBe('true');

  fireEvent.mouseMove(items[0]);
  expect(items[0].getAttribute('aria-selected')).toBe('true');
  expect(items[1].getAttribute('aria-selected')).toBe('false');
});

async function setup() {
  const template = `
    <frontal>
      <ng-template>
        <div frontalItem [value]="'uno'" [index]="0"></div>
        <div frontalItem [value]="'dos'" [index]="1"></div>
        <div frontalItem [value]="'tres'" [index]="2"></div>
      </ng-template>
    </frontal>`;

  resetId();
  const { fixture, getComponentInstance, container } = await createComponent(template, {
    declarations: [FrontalComponent, FrontalItemDirective, StatusMessagePipe],
  });

  return {
    fixture,
    frontal: getComponentInstance<FrontalComponent>('frontal'),
    item: container.querySelector('[frontalItem]'),
    items: container.querySelectorAll('[frontalItem]'),
  };
}
