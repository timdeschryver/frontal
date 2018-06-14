import { Component, Input } from '@angular/core';
import { createComponent, fireEvent } from 'ngx-testing-library';
import { FrontalComponent, FrontalInputDirective, FrontalItemDirective, StatusMessagePipe, resetId } from '../src';

test('sanity check for attributes', async () => {
  const { input } = await setup();
  expect(input).toMatchSnapshot();
});

test("focusing the input doesn't change the state", async () => {
  const { input, frontal: { state } } = await setup();

  const stateCopy = { ...state };
  fireEvent.focus(input);
  expect(state).toEqual(stateCopy);
});

test('input opens the list', async () => {
  const { fixture, input, frontal } = await setup();

  fireEvent.input(input);
  expect(frontal.state).toMatchObject(expect.objectContaining({ isOpen: true }));
});

test('input sets the value and text', async () => {
  const { input, frontal } = await setup();

  input.value = 'foo';
  fireEvent.input(input);
  expect(frontal.state).toMatchObject(expect.objectContaining({ inputText: 'foo', inputValue: 'foo' }));
});

test('input resets the selected and highlighted item', async () => {
  const { input, frontal } = await setup();
  frontal.state.selectedItem = 'foo';
  frontal.state.highlightedItem = 'bar';
  frontal.state.highlightedIndex = 1;

  fireEvent.input(input);
  expect(frontal.state).toMatchObject(
    expect.objectContaining({ selectedItem: null, highlightedItem: null, highlightedIndex: null }),
  );
});

test('inputText sets the input value', async () => {
  const { input, frontal } = await setup();
  frontal.state.inputText = 'foo';
  fireEvent.focus(input);
  expect(input.value).toBe('foo');
});

test('blur does nothing on a closed list', async () => {
  const { input, frontal } = await setup();

  frontal.handle = jest.fn();
  fireEvent.blur(input);
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('blur closes the list', async () => {
  const { input, frontal } = await setup();
  frontal.state.isOpen = true;

  fireEvent.blur(input);
  expect(frontal.state).toMatchObject(expect.objectContaining({ isOpen: false }));
});

test('blur sets the value to the highlighted item', async () => {
  const { input, frontal } = await setup();
  frontal.state.isOpen = true;
  frontal.state.highlightedItem = 'foo';

  fireEvent.blur(input);
  expect(frontal.state).toMatchObject(
    expect.objectContaining({ inputValue: 'foo', inputText: 'foo', selectedItem: 'foo' }),
  );
});

test('isOpen toggles aria expanded', async () => {
  const { input } = await setup();

  fireEvent.input(input);
  expect(input.getAttribute('aria-expanded')).toBe('true');

  fireEvent.blur(input);
  expect(input.getAttribute('aria-expanded')).toBe('false');
});

test('highlighted item sets aria activedescendant to the highlighted id', async () => {
  const { fixture, input, frontal } = await setup();
  frontal.state.highlightedIndex = 1;

  // we want to trigger a change
  fireEvent.focus(input);
  expect(input.getAttribute('aria-activedescendant')).toBe('frontal-item-0-2');
});

test('arrow down does nothing on a closed list', async () => {
  const { input, frontal } = await setup();

  frontal.handle = jest.fn();
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('arrow down resets the selected item', async () => {
  const { input, frontal } = await setup();
  frontal.state.isOpen = true;
  frontal.state.selectedItem = 'foo';

  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ selectedItem: null }));
});

test('arrow down sets the highlighted index', async () => {
  const { input, frontal } = await setup();
  frontal.state.isOpen = true;

  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));

  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 1 }));

  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 2 }));

  // there are only 3 items, so move back to the top
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));
});

test('arrow up does nothing on a closed list', async () => {
  const { input, frontal } = await setup();

  frontal.handle = jest.fn();
  fireEvent.keyDown(input, { key: 'ArrowUp' });
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('arrow up resets the selected item', async () => {
  const { input, frontal } = await setup();
  frontal.state.isOpen = true;
  frontal.state.selectedItem = 'foo';

  fireEvent.keyDown(input, { key: 'ArrowUp' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ selectedItem: null }));
});

test('arrow up sets the highlighted index', async () => {
  const { input, frontal } = await setup();
  frontal.state.isOpen = true;

  fireEvent.keyDown(input, { key: 'ArrowUp' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));

  fireEvent.keyDown(input, { key: 'ArrowUp' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 2 }));

  fireEvent.keyDown(input, { key: 'ArrowUp' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 1 }));

  fireEvent.keyDown(input, { key: 'ArrowUp' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));
});

test('enter does nothing on a closed list', async () => {
  const { input, frontal } = await setup();

  frontal.handle = jest.fn();
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('enter closes the list', async () => {
  const { input, frontal } = await setup();
  frontal.state.isOpen = true;
  frontal.state.highlightedItem = 'foo';
  frontal.state.highlightedIndex = 1;

  fireEvent.keyDown(input, { key: 'Enter' });
  expect(frontal.state).toMatchObject(
    expect.objectContaining({ isOpen: false, highlightedItem: null, highlightedIndex: null }),
  );
});

test('enter sets the value to the highlighted item', async () => {
  const { input, frontal } = await setup();
  frontal.state.isOpen = true;
  frontal.state.highlightedItem = 'foo';

  fireEvent.keyDown(input, { key: 'Enter' });
  expect(frontal.state).toMatchObject(
    expect.objectContaining({ inputText: 'foo', inputValue: 'foo', selectedItem: 'foo' }),
  );
});

test('escape does nothing on a closed list', async () => {
  const { input, frontal } = await setup();

  frontal.handle = jest.fn();
  fireEvent.keyDown(input, { key: 'Escape' });
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('escape resets the state', async () => {
  const { fixture, input, frontal } = await setup();
  frontal.state.isOpen = true;
  frontal.state.inputText = 'foo';
  frontal.state.inputValue = 'foo';
  frontal.state.selectedItem = 'foo';
  frontal.state.highlightedItem = 'bar';
  frontal.state.highlightedIndex = 1;

  fireEvent.keyDown(input, { key: 'Escape' });
  expect(frontal.state).toMatchObject(
    expect.objectContaining({
      isOpen: false,
      inputText: '',
      inputValue: '',
      highlightedItem: null,
      selectedItem: null,
      highlightedIndex: null,
    }),
  );
});

test('unhandled key does nothing', async () => {
  const { input, frontal } = await setup();
  frontal.state.isOpen = true;

  frontal.handle = jest.fn();
  fireEvent.keyDown(input, { key: 'Command' });
  expect(frontal.handle).not.toHaveBeenCalled();
});

async function setup() {
  const template = `
    <frontal>
      <ng-template>
        <input frontalInput/>
        <div frontalItem [index]="0"></div>
        <div frontalItem [index]="1"></div>
        <div frontalItem [index]="2"></div>
      </ng-template>
    </frontal>`;

  resetId();
  const { fixture, getComponentInstance, container } = await createComponent(template, {
    declarations: [FrontalComponent, FrontalInputDirective, FrontalItemDirective, StatusMessagePipe],
  });

  return {
    fixture,
    frontal: getComponentInstance<FrontalComponent>('frontal'),
    input: container.querySelector('input'),
  };
}
