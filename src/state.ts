import { Action } from './actions';
import { FrontalItemDirective } from './frontal.component';
import { generateId } from './utils';

export interface State {
  id: string;
  selectedItem: any | null;
  highlightedIndex: number | null;
  defaultHighlightedIndex: number | null;
  highlightedItem: any | null;
  inputValue: string;
  inputText: string;
  isOpen: boolean;
  itemCount: number;
  reducer: (state: State, action: Action) => Action;
  itemToString: (value: any) => string;
}

export const initialState: State = {
  id: '',
  selectedItem: null,
  highlightedIndex: null,
  defaultHighlightedIndex: null,
  highlightedItem: null,
  inputValue: '',
  inputText: '',
  isOpen: false,
  itemCount: 0,
  reducer: (state: State, action: Action) => action,
  itemToString: (value: any) => value,
};

export const createState = (): State => ({
  ...initialState,
  id: generateId(),
});
