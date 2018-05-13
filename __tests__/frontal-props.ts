import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FrontalComponent,
  FrontalItemDirective,
  StatusMessagePipe,
  resetId,
  State,
  Action,
  StateChanges,
} from '../src';

test('reducer can change the state', () => {
  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case StateChanges.ListOpen:
        return {
          ...action,
          payload: {
            ...action.payload,
            ...{
              highlightedIndex: 3,
            },
          },
        };
      default:
        return action;
    }
  };

  const { frontal } = setup({ reducer });
  frontal.openMenu();
  expect(frontal.state).toMatchObject(expect.objectContaining({ isOpen: true, highlightedIndex: 3 }));

  frontal.closeMenu();
  expect(frontal.state).toMatchObject(expect.objectContaining({ isOpen: false }));
});

test('itemToString should be used when provided', () => {
  const itemToString = ({ name }: { name: string }) => name;
  const { frontal } = setup({ itemToString });
  frontal.itemClick({ value: { name: 'Tim' } } as FrontalItemDirective);

  expect(frontal.state).toMatchObject(expect.objectContaining({ inputText: 'Tim' }));
});

test('defaultHighlightedIndex sets the initial highlighted index', () => {
  const { frontal } = setup({ defaultHighlightedIndex: 0 });
  expect(frontal.state.highlightedIndex).toBe(0);
});

test('defaultHighlightedIndex is used to set the highlighted index on change', () => {
  const { frontal } = setup({ defaultHighlightedIndex: 0 });
  frontal.handle = jest.fn();
  frontal.inputChange({ target: { value: 'abc' } } as any);

  expect(frontal.handle).toHaveBeenCalledWith(
    expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: 0 }) }),
  );
});

test('defaultHighlightedIndex is used to set the highlighted index on menu open', () => {
  const { frontal } = setup({ defaultHighlightedIndex: 0 });
  frontal.handle = jest.fn();
  frontal.openMenu();

  expect(frontal.handle).toHaveBeenCalledWith(
    expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: 0 }) }),
  );
});

test('defaultHighlightedIndex is used to set the highlighted index on menu toggle', () => {
  const { frontal } = setup({ defaultHighlightedIndex: 0 });
  frontal.handle = jest.fn();
  frontal.toggleMenu();

  expect(frontal.handle).toHaveBeenCalledWith(
    expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: 0 }) }),
  );
});

test('toggleMenu resets the highlighted index', () => {
  const { frontal } = setup({ defaultHighlightedIndex: 0, isOpen: true });
  frontal.handle = jest.fn();
  frontal.toggleMenu();

  expect(frontal.handle).toHaveBeenCalledWith(
    expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: null }) }),
  );
});

test('closeMenu resets the highlighted index', () => {
  const { frontal } = setup({ defaultHighlightedIndex: 0, isOpen: true });
  frontal.handle = jest.fn();
  frontal.closeMenu();

  expect(frontal.handle).toHaveBeenCalledWith(
    expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: null }) }),
  );
});

test('change is getting called when input is changed', () => {
  const { frontal } = setup();
  frontal.change.emit = jest.fn();

  frontal.inputChange({ target: { value: 'abc' } } as any);
  expect(frontal.change.emit).toHaveBeenCalledWith('abc');

  frontal.inputChange({ target: { value: 'abcd' } } as any);
  expect(frontal.change.emit).toHaveBeenCalledWith('abcd');

  frontal.inputChange({ target: { value: 'abcd' } } as any);
  // because the target value is the same, change isn't triggered
  expect(frontal.change.emit).toHaveBeenCalledTimes(2);
});

test('select is getting called with the item value', () => {
  const { frontal } = setup();
  frontal.select.emit = jest.fn();
  frontal.itemClick({ value: { name: 'Tim' } } as FrontalItemDirective);

  expect(frontal.select.emit).toHaveBeenCalledWith({ name: 'Tim' });
});

function setup(parameters: Partial<FrontalComponent> = {}) {
  resetId();

  TestBed.configureTestingModule({
    declarations: [FrontalComponent, StatusMessagePipe],
  });

  const fixture = TestBed.createComponent(FrontalComponent);
  for (const [key, value] of Object.entries(parameters)) {
    (<any>fixture.componentInstance)[key] = value;
  }

  return {
    fixture,
    frontal: fixture.componentInstance,
  };
}
