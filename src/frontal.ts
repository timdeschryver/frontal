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
} from '@angular/core';

export interface State {
  selectedItem: any;
  open: boolean;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  inputValue: string;
  input: (event: KeyboardEvent) => void;
  blur: () => void;
  highlightedIndex: number | null;
  keydown: (event: KeyboardEvent) => void;
  click: (value: FrontalItemDirective, index: number) => void;
  enter: (value: FrontalItemDirective, index: number) => void;
  leave: (value: FrontalItemDirective, index: number) => void;
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
  input: noop,
  blur: noop,
  highlightedIndex: null,
  keydown: noop,
  click: noop,
  enter: noop,
  leave: noop,
};

@Directive({
  selector: '[frontalInput]',
  exportAs: 'frontalInput',
})
export class FrontalInputDirective {
  onBlur: () => void;
  onInput: (event: KeyboardEvent) => void;
  onKeydown: (event: KeyboardEvent) => void;

  constructor(private element: ElementRef) {}

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
  constructor(private element: ElementRef) {}
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

@Component({
  selector: 'frontal',
  exportAs: 'frontal',
  template: `
    <ng-container *ngTemplateOutlet="template; context: state"></ng-container>
  `,
})
export class FrontalComponent implements AfterViewInit {
  @Input() reducer: (action: Action) => Action;

  @ContentChild(TemplateRef) template: TemplateRef<any>;
  @ContentChild(FrontalInputDirective) inputTemplate: FrontalInputDirective;
  @ContentChildren(FrontalItemDirective) items: QueryList<FrontalItemDirective>;

  state: State = initialState;
  differ: IterableDiffer<FrontalItemDirective>;

  constructor(private differs: IterableDiffers) {
    this.state = {
      ...initialState,
      toggleMenu: this.toggleMenu,
      openMenu: this.openMenu,
      closeMenu: this.closeMenu,
      input: this.input,
      blur: this.blur,
      keydown: this.keydown,
      click: this.itemClick,
      enter: this.itemEnter,
      leave: this.itemLeave,
    };

    this.differ = this.differs.find([]).create();
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.items.changes.subscribe(changes => {
        const changeDiff = this.differ.diff(changes);
        if (changeDiff) {
          changeDiff.forEachItem(change => {
            change.item.onClick = this.state.click.bind(null, change.item, change.currentIndex);
            change.item.onEnter = this.state.enter.bind(null, change.item, change.currentIndex);
            change.item.onLeave = this.state.leave.bind(null, change.item, change.currentIndex);
          });
        }
      });

      if (this.inputTemplate) {
        this.inputTemplate.onBlur = this.state.blur;
        this.inputTemplate.onInput = this.state.input;
        this.inputTemplate.onKeydown = this.state.keydown;
      }
    });
  }

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

  blur = () => {
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

  input = (event: KeyboardEvent) => {
    this.handle({
      type: StateChanges.InputChange,
      payload: {
        inputValue: (<HTMLInputElement>event.target).value,
        open: true,
        selectedItem: null,
      },
    });
  };

  keydown = (event: KeyboardEvent) => {
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
              this.items.length === 0
                ? null
                : ((this.state.highlightedIndex === null ? -1 : this.state.highlightedIndex) +
                    (event.shiftKey ? 5 : 1)) %
                  this.items.length,
          },
        },
        ArrowUp: {
          type: StateChanges.InputKeydownArrowUp,
          payload: {
            selectedItem: null,
            highlightedIndex:
              this.items.length === 0
                ? null
                : ((this.state.highlightedIndex === null ? 1 : this.state.highlightedIndex) -
                    (event.shiftKey ? 5 : 1) +
                    this.items.length) %
                  this.items.length,
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
      : this.items.find((item, index) => this.state.highlightedIndex === index);

  handle = (action: Action) => {
    const { payload } = this.reducer ? this.reducer(action) : action;
    const newState = {
      ...this.state,
      ...payload,
    };

    this.setInputTemplateProperties(this.inputTemplate, newState);
    this.state = newState;
  };

  setInputTemplateProperties = (input: FrontalInputDirective, state: State) => {
    if (input) {
      input.setAriaExpanded(state.open);
      input.setValue(state.inputValue);
    }
  };
}

function noop() {}
