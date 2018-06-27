import { By } from '@angular/platform-browser';
import { createComponent } from 'ngx-testing-library';
import { FrontalComponent, FrontalInputDirective, FrontalItemDirective, StatusMessagePipe, resetId } from '../src';

test('sanity check for attributes', async () => {
  const { textbox } = await setup();
  expect(textbox).toMatchSnapshot();
});

test("focusing the input doesn't change the state", async () => {
  const {
    textbox,
    frontal: { state },
    focus,
  } = await setup();

  const stateCopy = { ...state };
  focus(textbox);
  expect(state).toEqual(stateCopy);
});

test('input opens the list', async () => {
  const { textbox, input, frontal } = await setup();

  input(textbox);
  expect(frontal.state).toMatchObject(expect.objectContaining({ isOpen: true }));
});

test('input sets the value and text', async () => {
  const { textbox, input, frontal } = await setup();

  textbox.value = 'foo';
  input(textbox);
  expect(frontal.state).toMatchObject(expect.objectContaining({ inputText: 'foo', inputValue: 'foo' }));
});

test('input resets the selected and highlighted item', async () => {
  const { input, textbox, frontal } = await setup();
  frontal.state.selectedItem = 'foo';
  frontal.state.highlightedItem = 'bar';
  frontal.state.highlightedIndex = 1;

  input(textbox);
  expect(frontal.state).toMatchObject(
    expect.objectContaining({ selectedItem: null, highlightedItem: null, highlightedIndex: null }),
  );
});

test('inputText sets the input value', async () => {
  const { textbox, input, frontal, focus } = await setup();
  frontal.state.inputText = 'foo';
  focus(textbox);
  expect(textbox.value).toBe('foo');
});

test('blur does nothing on a closed list', async () => {
  const { frontal, blur, textbox } = await setup();

  frontal.handle = jest.fn();
  blur(textbox);
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('blur closes the list', async () => {
  const { frontal, blur, textbox } = await setup();
  frontal.state.isOpen = true;

  blur(textbox);
  expect(frontal.state).toMatchObject(expect.objectContaining({ isOpen: false }));
});

test('blur sets the value to the highlighted item', async () => {
  const { textbox, frontal, blur } = await setup();
  frontal.state.isOpen = true;
  frontal.state.highlightedItem = 'foo';

  blur(textbox);
  expect(frontal.state).toMatchObject(
    expect.objectContaining({ inputValue: 'foo', inputText: 'foo', selectedItem: 'foo' }),
  );
});

test('isOpen toggles aria expanded', async () => {
  const { textbox, input, blur } = await setup();

  input(textbox);
  expect(textbox.getAttribute('aria-expanded')).toBe('true');

  blur(textbox);
  expect(textbox.getAttribute('aria-expanded')).toBe('false');
});

test('highlighted item sets aria activedescendant to the highlighted id', async () => {
  const { focus, textbox, frontal } = await setup();
  frontal.state.highlightedIndex = 1;

  // we want to trigger a change
  focus(textbox);
  expect(textbox.getAttribute('aria-activedescendant')).toBe('frontal-item-0-2');
});

test('arrow down does nothing on a closed list', async () => {
  const { textbox, frontal, keyDown } = await setup();

  frontal.handle = jest.fn();
  keyDown(textbox, { key: 'ArrowDown' });
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('arrow down resets the selected item', async () => {
  const { textbox, frontal, keyDown } = await setup();
  frontal.state.isOpen = true;
  frontal.state.selectedItem = 'foo';

  keyDown(textbox, { key: 'ArrowDown' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ selectedItem: null }));
});

test('arrow down sets the highlighted index', async () => {
  const { textbox, frontal, keyDown } = await setup();
  frontal.state.isOpen = true;

  keyDown(textbox, { key: 'ArrowDown' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));

  keyDown(textbox, { key: 'ArrowDown' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 1 }));

  keyDown(textbox, { key: 'ArrowDown' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 2 }));

  // there are only 3 items, so move back to the top
  keyDown(textbox, { key: 'ArrowDown' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));
});

test('arrow up does nothing on a closed list', async () => {
  const { textbox, frontal, keyDown } = await setup();

  frontal.handle = jest.fn();
  keyDown(textbox, { key: 'ArrowUp' });
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('arrow up resets the selected item', async () => {
  const { textbox, frontal, keyDown } = await setup();
  frontal.state.isOpen = true;
  frontal.state.selectedItem = 'foo';

  keyDown(textbox, { key: 'ArrowUp' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ selectedItem: null }));
});

test('arrow up sets the highlighted index', async () => {
  const { textbox, frontal, keyDown } = await setup();
  frontal.state.isOpen = true;

  keyDown(textbox, { key: 'ArrowUp' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));

  keyDown(textbox, { key: 'ArrowUp' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 2 }));

  keyDown(textbox, { key: 'ArrowUp' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 1 }));

  keyDown(textbox, { key: 'ArrowUp' });
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));
});

test('enter does nothing on a closed list', async () => {
  const { textbox, frontal, keyDown } = await setup();

  frontal.handle = jest.fn();
  keyDown(textbox, { key: 'Enter' });
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('enter closes the list', async () => {
  const { textbox, frontal, keyDown } = await setup();
  frontal.state.isOpen = true;
  frontal.state.highlightedItem = 'foo';
  frontal.state.highlightedIndex = 1;

  keyDown(textbox, { key: 'Enter' });
  expect(frontal.state).toMatchObject(
    expect.objectContaining({ isOpen: false, highlightedItem: null, highlightedIndex: null }),
  );
});

test('enter sets the value to the highlighted item', async () => {
  const { textbox, frontal, keyDown } = await setup();
  frontal.state.isOpen = true;
  frontal.state.highlightedItem = 'foo';

  keyDown(textbox, { key: 'Enter' });
  expect(frontal.state).toMatchObject(
    expect.objectContaining({ inputText: 'foo', inputValue: 'foo', selectedItem: 'foo' }),
  );
});

test('escape does nothing on a closed list', async () => {
  const { textbox, frontal, keyDown } = await setup();

  frontal.handle = jest.fn();
  keyDown(textbox, { key: 'Escape' });
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('escape resets the state', async () => {
  const { fixture, textbox, frontal, keyDown } = await setup();
  frontal.state.isOpen = true;
  frontal.state.inputText = 'foo';
  frontal.state.inputValue = 'foo';
  frontal.state.selectedItem = 'foo';
  frontal.state.highlightedItem = 'bar';
  frontal.state.highlightedIndex = 1;

  keyDown(textbox, { key: 'Escape' });
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
  const { textbox, frontal, keyDown } = await setup();
  frontal.state.isOpen = true;

  frontal.handle = jest.fn();
  keyDown(textbox, { key: 'Command' });
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
  const { fixture, container, focus, input, blur, keyDown } = await createComponent(template, {
    declarations: [FrontalComponent, FrontalInputDirective, FrontalItemDirective, StatusMessagePipe],
  });

  return {
    fixture,
    frontal: fixture.debugElement.query(By.css('frontal')).componentInstance,
    textbox: container.querySelector('input') as HTMLInputElement,
    focus,
    blur,
    keyDown,
    input,
  };
}
