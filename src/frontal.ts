import {
  Component,
  ContentChild,
  TemplateRef,
  OnInit,
  Directive,
  AfterContentChecked,
  HostListener,
  HostBinding,
  ElementRef,
  Input,
  ContentChildren,
  QueryList,
  IterableDiffers,
  AfterViewInit,
  IterableDiffer,
  Inject,
} from '@angular/core';

export interface State {
  selectedItem: any;
  open: boolean;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  inputValue: string;
  inputChange: (event: KeyboardEvent) => void;
  inputBlur: () => void;
  highlightedIndex: number | null;
  inputKeydown: (event: KeyboardEvent) => void;
  itemClick: (value: FrontalItemDirective, index: number) => void;
  itemEnter: (value: FrontalItemDirective, index: number) => void;
  itemLeave: (value: FrontalItemDirective, index: number) => void;
  buttonClick: () => void;
}

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

export interface Action {
  type: StateChanges;
  payload: {};
}

export const initialState: State = {
  selectedItem: null,
  open: false,
  toggleMenu: noop,
  openMenu: noop,
  closeMenu: noop,
  inputValue: '',
  inputChange: noop,
  inputBlur: noop,
  highlightedIndex: null,
  inputKeydown: noop,
  itemClick: noop,
  itemEnter: noop,
  itemLeave: noop,
  buttonClick: noop,
};

@Directive({
  selector: '[frontalInput]',
  exportAs: 'frontalInput',
})
export class FrontalInputDirective {
  onBlur: () => void;
  onInput: (event: KeyboardEvent) => void;
  onKeydown: (event: KeyboardEvent) => void;

  constructor(@Inject(ElementRef) private element: ElementRef) {}

  @HostBinding('attr.role') role = 'combobox';
  @HostBinding('attr.autocomplete') autocomplete = 'off';
  @HostBinding('attr.aria-autocomplete') ariaAutocomplete = 'off';
  @HostBinding('attr.aria-expanded') ariaExpanded = false;

  @HostListener('blur', ['$event'])
  blur(event: Event) {
    if (this.onBlur) {
      this.onBlur();
    }
  }

  @HostListener('input', ['$event'])
  input(event: KeyboardEvent) {
    if (this.onInput) {
      this.onInput(event);
    }
  }

  @HostListener('keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    if (this.onKeydown) {
      this.onKeydown(event);
    }
  }

  setAriaExpanded(value: boolean) {
    this.ariaExpanded = value;
  }

  setValue(value: string) {
    this.element.nativeElement.value = value;
  }
}

@Directive({
  selector: '[frontalItem]',
  exportAs: 'frontalItem',
})
export class FrontalItemDirective {
  @Input() value: any;
  @Input() toString: (value: any) => string;

  onClick: () => void;
  onEnter: () => void;
  onLeave: () => void;

  valueToString() {
    return this.toString ? this.toString(this.value) : this.value;
  }

  @HostListener('mousedown', ['$event'])
  mousedown(event: Event) {
    if (this.onClick) {
      this.onClick();
    }
  }

  @HostListener('mouseenter', ['$event'])
  enter(event: Event) {
    requestAnimationFrame(() => {
      if (this.onEnter) {
        this.onEnter();
      }
    });
  }

  @HostListener('mouseleave', ['$event'])
  mouseleave(event: Event) {
    if (this.onLeave) {
      this.onLeave();
    }
  }
}

@Directive({
  selector: '[frontalButton]',
  exportAs: 'frontalButton',
})
export class FrontalButtonDirective {
  @HostBinding('attr.type') type = 'button';
  @HostBinding('attr.role') role = 'button';
  @HostBinding('attr.aria-label') ariaLabel = 'close menu';
  @HostBinding('attr.aria-expanded') ariaExpanded = false;
  @HostBinding('attr.aria-haspopup') ariaHasPopup = true;

  onClick: () => void;

  @HostListener('click', ['$event'])
  click(event: Event) {
    if (this.onClick) {
      this.onClick();
    }
  }

  setAriaExpanded(value: boolean) {
    this.ariaExpanded = value;
    this.ariaLabel = value ? 'close menu' : 'open menu';
  }
}

@Component({
  selector: 'frontal',
  exportAs: 'frontal',
  template: `
    <ng-container *ngTemplateOutlet="template; context: getState()"></ng-container>
  `,
})
export class FrontalComponent implements AfterViewInit {
  @Input() reducer: (action: Action) => Action;

  @ContentChild(TemplateRef) template: TemplateRef<any>;
  @ContentChild(FrontalInputDirective) frontalInput: FrontalInputDirective;
  @ContentChild(FrontalButtonDirective) frontalButton: FrontalButtonDirective;
  @ContentChildren(FrontalItemDirective) frontalItems: QueryList<FrontalItemDirective>;

  private state: State = initialState;
  private differ: IterableDiffer<FrontalItemDirective>;

  constructor(@Inject(IterableDiffers) private differs: IterableDiffers) {
    this.state = {
      ...initialState,
      toggleMenu: this.toggleMenu,
      openMenu: this.openMenu,
      closeMenu: this.closeMenu,
      inputChange: this.inputChange,
      inputBlur: this.inputBlur,
      inputKeydown: this.inputKeydown,
      itemClick: this.itemClick,
      itemEnter: this.itemEnter,
      itemLeave: this.itemLeave,
      buttonClick: this.buttonClick,
    };

    this.differ = differs.find([]).create();
  }

  getState = () => this.state;

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.frontalItems.forEach(this.bindItemEvents);
      this.bindInputEvents(this.frontalInput);
      this.bindButtonEvents(this.frontalButton);

      this.frontalItems.changes.subscribe(changes => {
        const changeDiff = this.differ.diff(changes);
        if (changeDiff) {
          changeDiff.forEachItem(change => {
            this.bindItemEvents(change.item, change.currentIndex);
          });
        }
      });
    });
  }

  bindItemEvents = (item: FrontalItemDirective, index: number | null) => {
    item.onClick = this.state.itemClick.bind(null, item, index);
    item.onEnter = this.state.itemEnter.bind(null, item, index);
    item.onLeave = this.state.itemLeave.bind(null, item, index);
  };

  bindInputEvents = (input: FrontalInputDirective) => {
    if (input) {
      input.onBlur = this.state.inputBlur;
      input.onInput = this.state.inputChange;
      input.onKeydown = this.state.inputKeydown;
    }
  };

  bindButtonEvents = (button: FrontalButtonDirective) => {
    if (button) {
      button.onClick = this.state.buttonClick;
    }
  };

  toggleMenu = () => {
    this.handle({
      type: StateChanges.MenuToggle,
      payload: {
        open: !this.state.open,
      },
    });
  };

  openMenu = () => {
    this.handle({
      type: StateChanges.MenuOpen,
      payload: {
        open: true,
      },
    });
  };

  closeMenu = () => {
    this.handle({
      type: StateChanges.MenuClose,
      payload: {
        open: false,
      },
    });
  };

  buttonClick = () => {
    this.handle({
      type: StateChanges.ButtonClick,
      payload: {
        open: !this.state.open,
      },
    });
  };

  inputBlur = () => {
    if (this.state.open) {
      this.handle({
        type: StateChanges.InputBlur,
        payload: {
          open: false,
          highlightedIndex: null,
          selectedItem: this.getHighlightedItem() ? this.getHighlightedItem()!.value : null,
          inputValue: this.getHighlightedItem() ? this.getHighlightedItem()!.valueToString() : '',
        },
      });
    }
  };

  inputChange = (event: KeyboardEvent) => {
    this.handle({
      type: StateChanges.InputChange,
      payload: {
        inputValue: (<HTMLInputElement>event.target).value,
        open: true,
        selectedItem: null,
      },
    });
  };

  inputKeydown = (event: KeyboardEvent) => {
    if (!this.state.open) {
      return;
    }

    requestAnimationFrame(() => {
      const handlers: { [key: string]: Action } = {
        ArrowDown: {
          type: StateChanges.InputKeydownArrowDown,
          payload: {
            selectedItem: null,
            highlightedIndex:
              this.frontalItems.length === 0
                ? null
                : ((this.state.highlightedIndex === null ? -1 : this.state.highlightedIndex) +
                    (event.shiftKey ? 5 : 1)) %
                  this.frontalItems.length,
          },
        },
        ArrowUp: {
          type: StateChanges.InputKeydownArrowUp,
          payload: {
            selectedItem: null,
            highlightedIndex:
              this.frontalItems.length === 0
                ? null
                : ((this.state.highlightedIndex === null ? 1 : this.state.highlightedIndex) -
                    (event.shiftKey ? 5 : 1) +
                    this.frontalItems.length) %
                  this.frontalItems.length,
          },
        },
        Enter: {
          type: StateChanges.InputKeydownEnter,
          payload: {
            open: false,
            highlightedIndex: null,
            selectedItem: this.getHighlightedItem() ? this.getHighlightedItem()!.value : null,
            inputValue: this.getHighlightedItem() ? this.getHighlightedItem()!.valueToString() : '',
          },
        },
        Escape: {
          type: StateChanges.InputKeydownEsc,
          payload: {
            open: false,
            highlightedIndex: null,
            selectedItem: null,
            inputValue: '',
          },
        },
      };

      const handler = handlers[event.key];
      if (handler) {
        this.handle(handler);
      }
    });
  };

  itemClick = (item: FrontalItemDirective, index: number) => {
    if (this.state.open && item) {
      this.handle({
        type: StateChanges.ItemMouseClick,
        payload: {
          open: false,
          highlightedIndex: null,
          selectedItem: item.value,
          inputValue: item.valueToString(),
        },
      });
    }
  };

  itemEnter = (item: FrontalItemDirective, index: number) => {
    if (this.state.open && item) {
      this.handle({
        type: StateChanges.ItemMouseEnter,
        payload: {
          highlightedIndex: index,
        },
      });
    }
  };

  itemLeave = (item: FrontalItemDirective, index: number) => {
    if (this.state.open && item) {
      this.handle({
        type: StateChanges.ItemMouseLeave,
        payload: {},
      });
    }
  };

  getHighlightedItem = () =>
    this.state.highlightedIndex === null
      ? null
      : this.frontalItems.find((item, index) => this.state.highlightedIndex === index);

  handle = (action: Action) => {
    const { payload } = this.reducer ? this.reducer(action) : action;
    const newState = {
      ...this.state,
      ...payload,
    };

    this.setInputProperties(this.frontalInput, newState);
    this.setButtonProperties(this.frontalButton, newState);
    this.state = newState;
  };

  setInputProperties = (input: FrontalInputDirective, state: State) => {
    if (input) {
      input.setAriaExpanded(state.open);
      input.setValue(state.inputValue);
    }
  };

  setButtonProperties = (button: FrontalButtonDirective, state: State) => {
    if (button) {
      button.setAriaExpanded(state.open);
    }
  };
}

function noop() {}
