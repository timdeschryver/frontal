export enum StateChanges {
  ListToggle = 'frontal_list_toggle',
  ListOpen = 'frontal_list_open',
  ListClose = 'frontal_list_close',
  InputFocus = 'frontal_input_focus',
  InputBlur = 'frontal_input_blur',
  InputChange = 'frontal_input_change',
  InputKeydownArrowDown = 'frontal_input_keydown_arrow_down',
  InputKeydownArrowUp = 'frontal_input_keydown_arrow_up',
  InputKeydownEnter = 'frontal_input_keydown_enter',
  InputKeydownEsc = 'frontal_input_keydown_esc',
  ItemMouseClick = 'frontal_item_mouseclick',
  ItemMouseEnter = 'frontal_item_mouseenter',
  ItemMouseLeave = 'frontal_item_mouseleave',
  ButtonClick = 'frontal_button_click',
}

export interface MenuToggle {
  type: StateChanges.ListToggle;
  payload: {
    isOpen: boolean;
  };
}

export interface InputFocus {
  type: StateChanges.InputFocus;
  payload: {};
}

export interface InputChange {
  type: StateChanges.InputChange;
  payload: {
    highlightedIndex: number | null;
    selectedItem: any;
    inputText: string;
    inputValue: string;
    isOpen: boolean;
  };
}

export interface MenuOpen {
  type: StateChanges.ListOpen;
  payload: {
    isOpen: boolean;
  };
}

export interface MenuClose {
  type: StateChanges.ListClose;
  payload: {
    isOpen: boolean;
  };
}

export interface ButtonClick {
  type: StateChanges.ButtonClick;
  payload: {
    isOpen: boolean;
  };
}

export interface InputBlur {
  type: StateChanges.InputBlur;
  payload: {
    isOpen: boolean;
    highlightedIndex: null;
    selectedItem: any;
    inputText: string;
    inputValue: string;
  };
}

export interface ItemMouseClick {
  type: StateChanges.ItemMouseClick;
  payload: {
    isOpen: boolean;
    highlightedIndex: null;
    selectedItem: any;
    inputText: string;
    inputValue: string;
  };
}

export interface ItemMouseEnter {
  type: StateChanges.ItemMouseEnter;
  payload: {
    highlightedIndex: number;
  };
}

export interface ItemMouseLeave {
  type: StateChanges.ItemMouseLeave;
  payload: {
    highlightedIndex: null;
  };
}

export interface InputKeydownArrowDown {
  type: StateChanges.InputKeydownArrowDown;
  payload: {
    selectedItem: null;
    highlightedIndex: number | null;
  };
}

export interface InputKeydownArrowUp {
  type: StateChanges.InputKeydownArrowUp;
  payload: {
    selectedItem: null;
    highlightedIndex: number | null;
  };
}

export interface InputKeydownEnter {
  type: StateChanges.InputKeydownEnter;
  payload: {
    isOpen: boolean;
    highlightedIndex: number | null;
    selectedItem: any;
    inputText: string;
    inputValue: string;
  };
}

export interface InputKeydownEsc {
  type: StateChanges.InputKeydownEsc;
  payload: {
    isOpen: boolean;
    highlightedIndex: number | null;
    selectedItem: any | null;
    inputText: string;
    inputValue: string;
  };
}

export type Action =
  | MenuToggle
  | InputChange
  | MenuOpen
  | MenuClose
  | ButtonClick
  | InputFocus
  | InputBlur
  | ItemMouseClick
  | ItemMouseEnter
  | ItemMouseLeave
  | InputKeydownArrowDown
  | InputKeydownArrowUp
  | InputKeydownEnter
  | InputKeydownEsc;
