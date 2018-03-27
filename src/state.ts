import { Action } from './actions';
import { FrontalItemDirective } from './frontal.component';

export interface State {
  selectedItem: any;
  highlightedIndex: number | null;
  inputValue: string;
  inputText: string;
  open: boolean;
  reducer: (state: State, action: Action) => Action;
  itemToString: (value: any) => string;
  onSelect: (value: any) => void;
  onChange: (value: string) => void;
}

export const initialState: State = {
  selectedItem: null,
  highlightedIndex: null,
  inputValue: '',
  inputText: '',
  open: false,
  reducer: (state: State, action: Action) => action,
  itemToString: (value: any) => value,
  onSelect: noop,
  onChange: noop,
};

function noop() {}
