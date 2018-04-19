import { State, createState } from '../state';
import { StatusMessagePipe } from '../status.pipe';

const fixtures: { input: Partial<State>; output: string }[] = [
  {
    input: {
      isOpen: true,
      highlightedItem: { display: 'boo' },
      itemToString: ({ display }: { display: string }) => display,
    },
    output: 'boo',
  },
  {
    input: {
      isOpen: true,
      itemCount: 1,
    },
    output: '1 result is available, use up and down arrow keys to navigate.',
  },
  {
    input: {
      isOpen: true,
      itemCount: 7,
    },
    output: '7 results are available, use up and down arrow keys to navigate.',
  },
  {
    input: {
      isOpen: true,
      itemCount: 0,
    },
    output: 'No results.',
  },
  {
    input: {
      isOpen: false,
      selectedItem: { display: 'boo' },
      itemToString: ({ display }: { display: string }) => display,
    },
    output: 'boo',
  },
  {
    input: {
      isOpen: false,
      selectedItem: null,
    },
    output: '',
  },
];

fixtures.forEach(({ input, output }) => {
  test(`${JSON.stringify(input)} results in ${output}`, () => {
    expect(new StatusMessagePipe().transform({ ...createState(), ...input })).toBe(output);
  });
});
