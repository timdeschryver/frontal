import { By } from '@angular/platform-browser';
import { createComponent } from 'ngx-testing-library';
import {
  FrontalComponent,
  FrontalInputDirective,
  FrontalItemDirective,
  StatusMessagePipe,
  resetId,
  State,
  InputBlur,
  StateChanges,
} from '../src';
import { updateState, inputBlur, Action } from '../src/actions';
import { take, filter } from 'rxjs/operators';
import { pipe } from 'rxjs';

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

  const stateCopy = { ...state.value };
  focus(textbox);
  expect(state.value).toEqual(stateCopy);
});

test('input opens the list', async () => {
  const { textbox, input, frontal } = await setup();

  input(textbox);
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ isOpen: true }));
});

test('input sets the value and text', async () => {
  const { textbox, input, frontal } = await setup();

  textbox.value = 'foo';
  input(textbox);
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ inputText: 'foo', inputValue: 'foo' }));
});

test('input resets the selected and highlighted item', async () => {
  const { input, textbox, frontal } = await setup({
    selectedItem: 'foo',
    highlightedItem: 'bar',
    highlightedIndex: 1,
  });

  input(textbox);
  expect(frontal.state.value).toMatchObject(
    expect.objectContaining({ selectedItem: null, highlightedItem: null, highlightedIndex: null }),
  );
});

test('inputText sets the input value', async () => {
  const { textbox, input, frontal, focus } = await setup({ inputText: 'foo' });
  focus(textbox);
  expect(textbox.value).toBe('foo');
});

test('blur does nothing on a closed list', async () => {
  const { frontal, blur, textbox } = await setup();

  const stateCopy = { ...frontal.state.value };
  blur(textbox);
  expect(stateCopy).toEqual(frontal.state.value);
});

test('blur closes the list', async () => {
  const { frontal, blur, textbox } = await setup({ isOpen: true });
  blur(textbox);
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ isOpen: false }));
});

test('blur sets the value to the highlighted item', async () => {
  const { textbox, frontal, blur } = await setup({ isOpen: true, highlightedIndex: 0, highlightedItem: 'foo' });
  blur(textbox);
  expect(frontal.state.value).toMatchObject(
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
  const { focus, textbox, frontal } = await setup({ highlightedIndex: 1 });
  // we want to trigger a change
  focus(textbox);
  expect(textbox.getAttribute('aria-activedescendant')).toBe('frontal-item-0-2');
});

test('arrow down does nothing on a closed list', async () => {
  const { textbox, frontal, keyDown } = await setup();

  const stateCopy = { ...frontal.state.value };
  keyDown(textbox, { key: 'ArrowDown' });
  expect(stateCopy).toEqual(frontal.state.value);
});

test('arrow down resets the selected item', async () => {
  const { textbox, frontal, keyDown } = await setup({ isOpen: true, selectedItem: 'foo' });
  keyDown(textbox, { key: 'ArrowDown' });
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ selectedItem: null }));
});

test('arrow down sets the highlighted index', async () => {
  const { textbox, frontal, keyDown } = await setup({ isOpen: true });

  keyDown(textbox, { key: 'ArrowDown' });
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));

  keyDown(textbox, { key: 'ArrowDown' });
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ highlightedIndex: 1 }));

  keyDown(textbox, { key: 'ArrowDown' });
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ highlightedIndex: 2 }));

  // there are only 3 items, so move back to the top
  keyDown(textbox, { key: 'ArrowDown' });
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));
});

test('arrow up does nothing on a closed list', async () => {
  const { textbox, frontal, keyDown } = await setup();

  const stateCopy = { ...frontal.state.value };
  keyDown(textbox, { key: 'ArrowUp' });
  expect(stateCopy).toEqual(frontal.state.value);
});

test('arrow up resets the selected item', async () => {
  const { textbox, frontal, keyDown } = await setup({ isOpen: true, selectedItem: 'foo' });
  keyDown(textbox, { key: 'ArrowUp' });
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ selectedItem: null }));
});

test('arrow up sets the highlighted index', async () => {
  const { textbox, frontal, keyDown } = await setup({ isOpen: true });

  keyDown(textbox, { key: 'ArrowUp' });
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));

  keyDown(textbox, { key: 'ArrowUp' });
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ highlightedIndex: 2 }));

  keyDown(textbox, { key: 'ArrowUp' });
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ highlightedIndex: 1 }));

  keyDown(textbox, { key: 'ArrowUp' });
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));
});

test('enter does nothing on a closed list', async () => {
  const { textbox, frontal, keyDown } = await setup();

  const stateCopy = { ...frontal.state.value };
  keyDown(textbox, { key: 'Enter' });
  expect(stateCopy).toEqual(frontal.state.value);
});

test('enter closes the list', async () => {
  const { textbox, frontal, keyDown } = await setup({ isOpen: true, highlightedIndex: 0, highlightedItem: 'foo' });
  keyDown(textbox, { key: 'Enter' });
  expect(frontal.state.value).toMatchObject(
    expect.objectContaining({ isOpen: false, highlightedItem: null, highlightedIndex: null }),
  );
});

test('enter sets the value to the highlighted item', async () => {
  const { textbox, frontal, keyDown } = await setup({ isOpen: true, highlightedIndex: 0, highlightedItem: 'foo' });
  keyDown(textbox, { key: 'Enter' });
  expect(frontal.state.value).toMatchObject(
    expect.objectContaining({ inputText: 'foo', inputValue: 'foo', selectedItem: 'foo' }),
  );
});

test('escape does nothing on a closed list', async () => {
  const { textbox, frontal, keyDown } = await setup();

  const stateCopy = { ...frontal.state.value };
  keyDown(textbox, { key: 'Escape' });
  expect(stateCopy).toEqual(frontal.state.value);
});

test('escape resets the state', async () => {
  const { fixture, textbox, frontal, keyDown } = await setup({
    isOpen: true,
    inputText: 'foo',
    inputValue: 'foo',
    selectedItem: 'foo',
    highlightedItem: 'bar',
    highlightedIndex: 1,
  });
  keyDown(textbox, { key: 'Escape' });
  expect(frontal.state.value).toMatchObject(
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
  const { textbox, frontal, keyDown } = await setup({ isOpen: true });
  frontal.actions.pipe(filterUpdateActionsOut()).subscribe(action => {
    fail(`This shouldn't be called but is called with: ${JSON.stringify(action)}`);
  });
  keyDown(textbox, { key: 'Command' });
});

const filterUpdateActionsOut = () =>
  pipe(
    filter((action: Action) => action.type !== StateChanges.UpdateState && action.type !== StateChanges.UpdateItems),
  );

async function setup(initialState?: Partial<State>) {
  const template = `
    <frontal>
      <ng-template>
        <input frontalInput/>
        <div frontalItem [value]="'foo'"></div>
        <div frontalItem [value]="'bar'"></div>
        <div frontalItem [value]="'baz'"></div>
      </ng-template>
    </frontal>`;

  resetId();
  const { fixture, container, focus, input, blur, keyDown } = await createComponent(template, {
    declarations: [FrontalComponent, FrontalInputDirective, FrontalItemDirective, StatusMessagePipe],
  });

  const frontal = fixture.debugElement.query(By.css('frontal')).componentInstance as FrontalComponent;

  if (initialState) {
    frontal.actions.next(updateState(initialState));
  }

  fixture.changeDetectorRef.detectChanges();
  await fixture.whenStable();

  return {
    frontal,
    fixture,
    textbox: container.querySelector('input') as HTMLInputElement,
    focus,
    blur,
    keyDown,
    input,
  };
}
