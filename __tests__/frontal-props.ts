import { createComponent } from 'ngx-testing-library';
import {
  FrontalComponent,
  FrontalItemDirective,
  StatusMessagePipe,
  resetId,
  State,
  Action,
  StateChanges,
} from '../src';

test('reducer can change the state', async () => {
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

  const { frontal } = await setup({ reducer });
  frontal.openMenu();
  expect(frontal.state).toMatchObject(expect.objectContaining({ isOpen: true, highlightedIndex: 3 }));

  frontal.closeMenu();
  expect(frontal.state).toMatchObject(expect.objectContaining({ isOpen: false }));
});

test('itemToString should be used when provided', async () => {
  const itemToString = ({ name }: { name: string }) => name;
  const { frontal } = await setup({ itemToString });
  frontal.itemClick({ value: { name: 'Tim' } } as FrontalItemDirective);

  expect(frontal.state).toMatchObject(expect.objectContaining({ inputText: 'Tim' }));
});

test('defaultHighlightedIndex sets the initial highlighted index', async () => {
  const { frontal } = await setup({ defaultHighlightedIndex: 0 });
  expect(frontal.state.highlightedIndex).toBe(0);
});

test('defaultHighlightedIndex is used to set the highlighted index on change', async () => {
  const { frontal } = await setup({ defaultHighlightedIndex: 0 });
  frontal.handle = jest.fn();
  frontal.inputChange({ target: { value: 'abc' } } as any);

  expect(frontal.handle).toHaveBeenCalledWith(
    expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: 0 }) }),
  );
});

test('defaultHighlightedIndex is used to set the highlighted index on menu open', async () => {
  const { frontal } = await setup({ defaultHighlightedIndex: 0 });
  frontal.handle = jest.fn();
  frontal.openMenu();

  expect(frontal.handle).toHaveBeenCalledWith(
    expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: 0 }) }),
  );
});

test('defaultHighlightedIndex is used to set the highlighted index on menu toggle', async () => {
  const { frontal } = await setup({ defaultHighlightedIndex: 0 });
  frontal.handle = jest.fn();
  frontal.toggleMenu();

  expect(frontal.handle).toHaveBeenCalledWith(
    expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: 0 }) }),
  );
});

test('toggleMenu resets the highlighted index', async () => {
  const { frontal } = await setup({ defaultHighlightedIndex: 0, isOpen: true });
  frontal.handle = jest.fn();
  frontal.toggleMenu();

  expect(frontal.handle).toHaveBeenCalledWith(
    expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: null }) }),
  );
});

test('closeMenu resets the highlighted index', async () => {
  const { frontal } = await setup({ defaultHighlightedIndex: 0, isOpen: true });
  frontal.handle = jest.fn();
  frontal.closeMenu();

  expect(frontal.handle).toHaveBeenCalledWith(
    expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: null }) }),
  );
});

test('change is getting called when input is changed', async () => {
  const { frontal } = await setup();
  frontal.change.emit = jest.fn();

  frontal.inputChange({ target: { value: 'abc' } } as any);
  expect(frontal.change.emit).toHaveBeenCalledWith('abc');

  frontal.inputChange({ target: { value: 'abcd' } } as any);
  expect(frontal.change.emit).toHaveBeenCalledWith('abcd');

  frontal.inputChange({ target: { value: 'abcd' } } as any);
  // because the target value is the same, change isn't triggered
  expect(frontal.change.emit).toHaveBeenCalledTimes(2);
});

test('select is getting called with the item value', async () => {
  const { frontal } = await setup();
  frontal.select.emit = jest.fn();
  frontal.itemClick({ value: { name: 'Tim' } } as FrontalItemDirective);

  expect(frontal.select.emit).toHaveBeenCalledWith({ name: 'Tim' });
});

async function setup(parameters: Partial<FrontalComponent> = {}) {
  resetId();

  const { fixture } = await createComponent(
    {
      component: FrontalComponent,
      parameters,
    },
    {
      declarations: [FrontalComponent, StatusMessagePipe],
    },
  );

  return {
    frontal: fixture.componentInstance as FrontalComponent,
  };
}
