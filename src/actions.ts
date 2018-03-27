export enum StateChanges {
  MenuToggle = 'frontal_menu_toggle',
  MenuOpen = 'frontal_menu_open',
  MenuClose = 'frontal_menu_close',
  InputBlur = 'frontal_input_blur',
  InputChange = 'frontal_input_change',
  InputKeydownArrowDown = 'frontal_input_keydown_arrow_down',
  InputKeydownArrowUp = 'frontal_input_keydown_arrow_up',
  InputKeydownEnter = 'frontal_input_keydown_arrow_enter',
  InputKeydownEsc = 'frontal_input_keydown_arrow_esc',
  ItemMouseClick = 'frontal_item_mouseclick',
  ItemMouseEnter = 'frontal_item_mouseenter',
  ItemMouseLeave = 'frontal_item_mouseleave',
  ButtonClick = 'frontal_button_click',
}

export interface MenuToggle {
  type: StateChanges.MenuToggle;
  payload: {
    open: boolean;
  };
}

export interface InputChange {
  type: StateChanges.InputChange;
  payload: {
    selectedItem: any;
    inputText: string;
    inputValue: string;
  };
}

export interface MenuOpen {
  type: StateChanges.MenuOpen;
  payload: {
    open: boolean;
  };
}

export interface MenuClose {
  type: StateChanges.MenuClose;
  payload: {
    open: boolean;
  };
}

export interface ButtonClick {
  type: StateChanges.ButtonClick;
  payload: {
    open: boolean;
  };
}

export interface InputBlur {
  type: StateChanges.InputBlur;
  payload: {
    open: boolean;
    highlightedIndex: null;
    selectedItem: any;
    inputText: string;
    inputValue: string;
  };
}

export interface ItemMouseClick {
  type: StateChanges.ItemMouseClick;
  payload: {
    open: boolean;
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
    open: boolean;
    highlightedIndex: number | null;
    selectedItem: any;
    inputText: string;
    inputValue: string;
  };
}

export interface InputKeydownEsc {
  type: StateChanges.InputKeydownEsc;
  payload: {
    open: boolean;
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
  | InputBlur
  | ItemMouseClick
  | ItemMouseEnter
  | ItemMouseLeave
  | InputKeydownArrowDown
  | InputKeydownArrowUp
  | InputKeydownEnter
  | InputKeydownEsc;
