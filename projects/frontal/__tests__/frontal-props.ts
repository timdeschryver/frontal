import { createComponent } from 'ngx-testing-library';
import { FrontalComponent, StatusMessagePipe, resetId, State, Action, StateChanges } from '../src';

test('reducer can change the state', async () => {
  const reducer = ({
    state,
    action,
    changes,
  }: {
    state: State;
    action: Action;
    changes: Partial<State>;
  }): Partial<State> => {
    switch (action.type) {
      case StateChanges.ListOpen:
        return {
          ...changes,
          highlightedIndex: 3,
        };
      default:
        return changes;
    }
  };

  const { frontal } = await setup({ reducer });
  frontal.openList();
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ isOpen: true, highlightedIndex: 3 }));

  frontal.closeList();
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ isOpen: false }));
});

test('itemToString should be used when provided', async () => {
  const itemToString = ({ name }: { name: string }) => name;
  const { frontal } = await setup({ itemToString });
  frontal.itemClick({ name: 'Tim' });

  expect(frontal.state.value).toMatchObject(expect.objectContaining({ inputText: 'Tim' }));
});

test('defaultHighlightedIndex sets the initial highlighted index', async () => {
  const { frontal } = await setup({ defaultHighlightedIndex: 0 });
  expect(frontal.state.value.highlightedIndex).toBe(0);
});

test('defaultHighlightedIndex is used to set the highlighted index on change', async () => {
  const { frontal } = await setup({ defaultHighlightedIndex: 0 });
  frontal.actions.subscribe(action => {
    expect(action).toMatchObject(
      expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: 0 }) }),
    );
  });
  frontal.inputChange({ target: { value: 'abc' } } as any);
});

test('defaultHighlightedIndex is used to set the highlighted index on list open', async () => {
  const { frontal } = await setup({ defaultHighlightedIndex: 0 });
  frontal.actions.subscribe(action => {
    expect(action).toMatchObject(
      expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: 0 }) }),
    );
  });
  frontal.openList();
});

test('defaultHighlightedIndex is used to set the highlighted index on list toggle', async () => {
  const { frontal } = await setup({ defaultHighlightedIndex: 0 });
  frontal.actions.subscribe(action => {
    expect(action).toMatchObject(
      expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: 0 }) }),
    );
  });
  frontal.toggleList();
});

test('toggleList resets the highlighted index', async () => {
  const { frontal } = await setup({ defaultHighlightedIndex: 0, isOpen: true });
  frontal.actions.subscribe(action => {
    expect(action).toMatchObject(
      expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: null }) }),
    );
  });
  frontal.toggleList();
});

test('closeList resets the highlighted index', async () => {
  const { frontal } = await setup({ defaultHighlightedIndex: 0, isOpen: true });
  frontal.actions.subscribe(action => {
    expect(action).toMatchObject(
      expect.objectContaining({ payload: expect.objectContaining({ highlightedIndex: null }) }),
    );
  });
  frontal.closeList();
});

test('change is getting called when input is changed', async () => {
  const { frontal } = await setup();
  frontal.change.emit = jest.fn();

  frontal.inputChange('abc');
  expect(frontal.change.emit).toHaveBeenCalledWith('abc');

  frontal.inputChange('abcd');
  expect(frontal.change.emit).toHaveBeenCalledWith('abcd');

  frontal.inputChange('abcd');
  // because the target value is the same, change isn't triggered
  expect(frontal.change.emit).toHaveBeenCalledTimes(2);
});

test('select is getting called with the item value', async () => {
  const { frontal } = await setup();
  frontal.select.emit = jest.fn();
  frontal.itemClick({ name: 'Tim' });

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
