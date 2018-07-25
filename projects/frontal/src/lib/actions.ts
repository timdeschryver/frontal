import { State } from './state';

export enum StateChanges {
  UpdateState = 'frontal_update_state',
  UpdateItems = 'frontal_update_item',
  SetItem = 'frontal_set_value',
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

export interface UpdateState {
  type: StateChanges.UpdateState;
  payload: Partial<State>;
}

export const updateState = (payload: Partial<State>): UpdateState => ({
  type: StateChanges.UpdateState,
  payload: payload,
});

export interface UpdateItems {
  type: StateChanges.UpdateItems;
  payload: {
    itemCount: number;
  };
}

export const updateItems = (itemCount: number): UpdateItems => ({
  type: StateChanges.UpdateItems,
  payload: {
    itemCount,
  },
});

export interface SetItem {
  type: StateChanges.SetItem;
  payload: {
    item: any;
  };
}

export const setItem = (item: any): SetItem => ({
  type: StateChanges.SetItem,
  payload: {
    item,
  },
});

export interface ListToggle {
  type: StateChanges.ListToggle;
}

export const listToggle = (): ListToggle => ({
  type: StateChanges.ListToggle,
});

export interface InputFocus {
  type: StateChanges.InputFocus;
}

export const inputFocus = (): InputFocus => ({
  type: StateChanges.InputFocus,
});

export interface InputChange {
  type: StateChanges.InputChange;
  payload: {
    value: string;
  };
}

export const inputChange = (value: string): InputChange => {
  return {
    type: StateChanges.InputChange,
    payload: {
      value,
    },
  };
};

export interface ListOpen {
  type: StateChanges.ListOpen;
}

export const listOpen = (): ListOpen => ({
  type: StateChanges.ListOpen,
});

export interface ListClose {
  type: StateChanges.ListClose;
}

export const listClose = (): ListClose => ({
  type: StateChanges.ListClose,
});

export interface ButtonClick {
  type: StateChanges.ButtonClick;
}

export const buttonClick = (): ButtonClick => ({
  type: StateChanges.ButtonClick,
});

export interface InputBlur {
  type: StateChanges.InputBlur;
}

export const inputBlur = (): InputBlur => ({
  type: StateChanges.InputBlur,
});

export interface ItemMouseClick {
  type: StateChanges.ItemMouseClick;
  payload: {
    item: any;
  };
}

export const itemMouseClick = (item: any): ItemMouseClick => ({
  type: StateChanges.ItemMouseClick,
  payload: {
    item,
  },
});

export interface ItemMouseEnter {
  type: StateChanges.ItemMouseEnter;
  payload: {
    index: number;
  };
}

export const itemMouseEnter = (index: number): ItemMouseEnter => ({
  type: StateChanges.ItemMouseEnter,
  payload: {
    index,
  },
});

export interface ItemMouseLeave {
  type: StateChanges.ItemMouseLeave;
}

export const itemMouseLeave = (): ItemMouseLeave => ({
  type: StateChanges.ItemMouseLeave,
});

export interface InputKeydownArrowDown {
  type: StateChanges.InputKeydownArrowDown;
}

export const inputKeydownArrowDown = (): InputKeydownArrowDown => ({
  type: StateChanges.InputKeydownArrowDown,
});

export interface InputKeydownArrowUp {
  type: StateChanges.InputKeydownArrowUp;
}

export const inputKeydownArrowUp = (): InputKeydownArrowUp => ({
  type: StateChanges.InputKeydownArrowUp,
});

export interface InputKeydownEnter {
  type: StateChanges.InputKeydownEnter;
}

export const inputKeydownEnter = (): InputKeydownEnter => ({
  type: StateChanges.InputKeydownEnter,
});

export interface InputKeydownEsc {
  type: StateChanges.InputKeydownEsc;
}

export const inputKeydownEsc = (): InputKeydownEsc => ({
  type: StateChanges.InputKeydownEsc,
});

export type Action =
  | UpdateState
  | UpdateItems
  | SetItem
  | ListToggle
  | InputChange
  | ListOpen
  | ListClose
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
