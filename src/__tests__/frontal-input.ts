import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FrontalComponent, FrontalInputDirective, FrontalItemDirective } from '../frontal.component';
import { StatusMessagePipe } from '../status.pipe';
import { resetId } from '../utils';

test('sanity check for attributes', () => {
  const { input } = setup();
  expect(input.nativeElement).toMatchSnapshot();
});

test("focusing the input doesn't change the state", () => {
  const { input, frontal: { state } } = setup();

  const stateCopy = { ...state };
  input.nativeElement.dispatchEvent(new Event('focus'));
  expect(state).toEqual(stateCopy);
});

test('input opens the list', () => {
  const { fixture, input, frontal } = setup();

  input.nativeElement.dispatchEvent(new Event('input'));
  expect(frontal.state).toMatchObject(expect.objectContaining({ isOpen: true }));
});

test('input sets the value and text', () => {
  const { input, frontal } = setup();

  input.nativeElement.value = 'foo';
  input.nativeElement.dispatchEvent(new Event('input'));
  expect(frontal.state).toMatchObject(expect.objectContaining({ inputText: 'foo', inputValue: 'foo' }));
});

test('input resets the selected and highlighted item', () => {
  const { input, frontal } = setup();
  frontal.state.selectedItem = 'foo';
  frontal.state.highlightedItem = 'bar';
  frontal.state.highlightedIndex = 1;

  input.nativeElement.dispatchEvent(new Event('input'));
  expect(frontal.state).toMatchObject(
    expect.objectContaining({ selectedItem: null, highlightedItem: null, highlightedIndex: null }),
  );
});

test('inputText sets the input value', () => {
  const { input, frontal } = setup();
  frontal.state.inputText = 'foo';
  input.nativeElement.dispatchEvent(new Event('focus'));
  expect(input.nativeElement.value).toBe('foo');
});

test('blur does nothing on a closed list', () => {
  const { input, frontal } = setup();

  spyOn(frontal, 'handle');
  input.nativeElement.dispatchEvent(new Event('blur'));
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('blur closes the list', () => {
  const { input, frontal } = setup();
  frontal.state.isOpen = true;

  input.nativeElement.dispatchEvent(new Event('blur'));
  expect(frontal.state).toMatchObject(expect.objectContaining({ isOpen: false }));
});

test('blur sets the value to the highlighted item', () => {
  const { input, frontal } = setup();
  frontal.state.isOpen = true;
  frontal.state.highlightedItem = 'foo';

  input.nativeElement.dispatchEvent(new Event('blur'));
  expect(frontal.state).toMatchObject(
    expect.objectContaining({ inputValue: 'foo', inputText: 'foo', selectedItem: 'foo' }),
  );
});

test('isOpen toggles aria expanded', () => {
  const { input } = setup();

  input.nativeElement.dispatchEvent(new Event('input'));
  expect(input.attributes['aria-expanded']).toBe('true');

  input.nativeElement.dispatchEvent(new Event('blur'));
  expect(input.attributes['aria-expanded']).toBe('false');
});

test('highlighted item sets aria activedescendant to the highlighted id', () => {
  const { fixture, input, frontal } = setup();
  frontal.state.highlightedIndex = 1;
  fixture.detectChanges();

  // we want to trigger a change
  input.nativeElement.dispatchEvent(new Event('focus'));
  expect(input.attributes['aria-activedescendant']).toBe('frontal-item-0-2');
});

test('highlighted item sets aria activedescendant to an empty string when there is no highlighted item', () => {
  const { input, frontal } = setup();

  spyOn(frontal, 'getHighlightedItem').and.returnValue(null);
  input.nativeElement.dispatchEvent(new Event('focus'));
  expect(input.attributes['aria-activedescendant']).toBe('');
});

test('arrow down does nothing on a closed list', () => {
  const { input, frontal } = setup();

  spyOn(frontal, 'handle');
  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('arrow down resets the selected item', () => {
  const { input, frontal } = setup();
  frontal.state.isOpen = true;
  frontal.state.selectedItem = 'foo';

  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  expect(frontal.state).toMatchObject(expect.objectContaining({ selectedItem: null }));
});

test('arrow down sets the highlighted index', () => {
  const { input, frontal } = setup();
  frontal.state.isOpen = true;

  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));

  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 1 }));

  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 2 }));

  // there are only 3 items, so move back to the top
  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));
});

test('arrow up does nothing on a closed list', () => {
  const { input, frontal } = setup();

  spyOn(frontal, 'handle');
  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('arrow up resets the selected item', () => {
  const { input, frontal } = setup();
  frontal.state.isOpen = true;
  frontal.state.selectedItem = 'foo';

  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
  expect(frontal.state).toMatchObject(expect.objectContaining({ selectedItem: null }));
});

test('arrow up sets the highlighted index', () => {
  const { input, frontal } = setup();
  frontal.state.isOpen = true;

  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));

  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 2 }));

  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 1 }));

  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
  expect(frontal.state).toMatchObject(expect.objectContaining({ highlightedIndex: 0 }));
});

test('enter does nothing on a closed list', () => {
  const { input, frontal } = setup();

  spyOn(frontal, 'handle');
  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('enter closes the list', () => {
  const { input, frontal } = setup();
  frontal.state.isOpen = true;
  frontal.state.highlightedItem = 'foo';
  frontal.state.highlightedIndex = 1;

  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  expect(frontal.state).toMatchObject(
    expect.objectContaining({ isOpen: false, highlightedItem: null, highlightedIndex: null }),
  );
});

test('enter sets the value to the highlighted item', () => {
  const { input, frontal } = setup();
  frontal.state.isOpen = true;
  frontal.state.highlightedItem = 'foo';

  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  expect(frontal.state).toMatchObject(
    expect.objectContaining({ inputText: 'foo', inputValue: 'foo', selectedItem: 'foo' }),
  );
});

test('escape does nothing on a closed list', () => {
  const { input, frontal } = setup();

  spyOn(frontal, 'handle');
  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  expect(frontal.handle).not.toHaveBeenCalled();
});

test('escape resets the state', () => {
  const { input, frontal } = setup();
  frontal.state.isOpen = true;
  frontal.state.inputText = 'foo';
  frontal.state.inputValue = 'foo';
  frontal.state.selectedItem = 'foo';
  frontal.state.highlightedItem = 'bar';
  frontal.state.highlightedIndex = 1;

  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
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

test('unhandled key does nothing', () => {
  const { input, frontal } = setup();
  frontal.state.isOpen = true;

  spyOn(frontal, 'handle');
  input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Command' }));
  expect(frontal.handle).not.toHaveBeenCalled();
});

function setup() {
  resetId();

  TestBed.configureTestingModule({
    declarations: [TestComponent, FrontalComponent, FrontalInputDirective, FrontalItemDirective, StatusMessagePipe],
  });

  TestBed.overrideComponent(TestComponent, {
    set: {
      template: `
        <frontal>
          <ng-template>
            <input frontalInput/>
            <div frontalItem></div>
            <div frontalItem></div>
            <div frontalItem></div>
          </ng-template>
        </frontal>`,
    },
  });

  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();

  return {
    fixture,
    frontal: fixture.debugElement.query(By.css('frontal')).componentInstance as FrontalComponent,
    input: fixture.debugElement.query(By.css('[frontalInput]')),
  };
}

@Component({ selector: 'test', template: '' })
class TestComponent {}
