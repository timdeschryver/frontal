import {
  Component,
  ContentChild,
  TemplateRef,
  Directive,
  HostListener,
  HostBinding,
  ElementRef,
  Input,
  ContentChildren,
  QueryList,
  Inject,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface State {
  selectedItem: any;
  open: boolean;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  inputValue: string;
  inputText: string;
  inputChange: (event: KeyboardEvent) => void;
  inputBlur: () => void;
  highlightedIndex: number | null;
  inputKeydown: (event: KeyboardEvent) => void;
  itemClick: (value: FrontalItemDirective, index: number) => void;
  itemEnter: (value: FrontalItemDirective, index: number) => void;
  itemLeave: (value: FrontalItemDirective, index: number) => void;
  buttonClick: () => void;
  itemToString: (value: any) => string;
  reducer: null | ((state: State, action: Action) => Action);
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
  payload: any;
}

export const initialState: State = {
  selectedItem: null,
  open: false,
  toggleMenu: noop,
  openMenu: noop,
  closeMenu: noop,
  inputValue: '',
  inputText: '',
  inputChange: noop,
  inputBlur: noop,
  highlightedIndex: null,
  inputKeydown: noop,
  itemClick: noop,
  itemEnter: noop,
  itemLeave: noop,
  buttonClick: noop,
  itemToString: (value: any) => value,
  reducer: null,
};

@Directive({
  selector: '[frontalInput]',
  exportAs: 'frontalInput',
})
export class FrontalInputDirective implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('attr.role') role = 'combobox';
  @HostBinding('attr.autocomplete') autocomplete = 'off';
  @HostBinding('attr.aria-autocomplete') ariaAutocomplete = 'off';
  @HostBinding('attr.aria-expanded') ariaExpanded = false;
  @HostBinding('attr.id') attrId = `frontal-input-${this.frontal.id}`;

  @Input()
  get id() {
    return this.attrId;
  }

  set id(value: any) {
    this.attrId = value;
  }

  constructor(
    @Inject(ElementRef) private element: ElementRef,
    // prettier-ignore
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent,
  ) {}

  ngOnInit() {
    this.frontal.addListener({ id: 'input', listener: this.stateChange.bind(this) });
  }

  ngAfterViewInit() {
    const state = this.frontal.getState();
    this.setAriaExpanded(state.open);
    this.setValue(state.inputText);
  }

  ngOnDestroy() {
    this.frontal.removeListener('input');
  }

  stateChange(state: State, action: Action) {
    if (this.ariaExpanded !== state.open) {
      this.setAriaExpanded(state.open);
    }

    if (this.element.nativeElement.value !== state.inputText) {
      this.setValue(state.inputText);
    }
  }

  @HostListener('blur', ['$event'])
  blur(event: Event) {
    if (this.frontal.inputBlur) {
      this.frontal.inputBlur();
    }
  }

  @HostListener('input', ['$event'])
  input(event: KeyboardEvent) {
    if (this.frontal.inputChange) {
      this.frontal.inputChange(event);
    }
  }

  @HostListener('keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    if (this.frontal.inputKeydown) {
      this.frontal.inputKeydown(event);
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
  selector: '[frontalLabel]',
  exportAs: 'frontalLabel',
})
export class FrontalLabelDirective {
  @HostBinding('attr.for') attrFor = `frontal-input-${this.frontal.id}`;

  @Input()
  get for() {
    return this.attrFor;
  }

  set for(value: any) {
    this.attrFor = value;
  }

  constructor(
    // prettier-ignore
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent,
  ) {}
}

@Directive({
  selector: '[frontalItem]',
  exportAs: 'frontalItem',
})
export class FrontalItemDirective implements OnInit, OnDestroy {
  @Input() value: any;

  constructor(
    // prettier-ignore
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent,
  ) {}

  ngOnInit() {
    this.frontal.frontalItemsLength++;
  }

  ngOnDestroy(): void {
    this.frontal.frontalItemsLength--;
  }

  @HostListener('mousedown', ['$event'])
  mousedown(event: Event) {
    if (this.frontal.itemClick) {
      this.frontal.itemClick(this);
    }
  }

  @HostListener('mouseenter', ['$event'])
  enter(event: Event) {
    if (this.frontal.itemEnter) {
      this.frontal.itemEnter(this);
    }
  }

  @HostListener('mouseleave', ['$event'])
  mouseleave(event: Event) {
    if (this.frontal.itemLeave) {
      this.frontal.itemLeave(this);
    }
  }
}

@Directive({
  selector: '[frontalButton]',
  exportAs: 'frontalButton',
})
export class FrontalButtonDirective implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('attr.type') type = 'button';
  @HostBinding('attr.role') role = 'button';
  @HostBinding('attr.aria-label') ariaLabel = 'close menu';
  @HostBinding('attr.aria-expanded') ariaExpanded = false;
  @HostBinding('attr.aria-haspopup') ariaHasPopup = true;

  constructor(
    // prettier-ignore
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent,
  ) {}

  ngOnInit() {
    this.frontal.addListener({ id: 'button', listener: this.stateChange.bind(this) });
  }

  ngAfterViewInit() {
    const state = this.frontal.getState();
    this.setAriaExpanded(state.open);
  }

  ngOnDestroy() {
    this.frontal.removeListener('button');
  }

  stateChange(state: State, action: Action) {
    if (this.ariaExpanded !== state.open) {
      this.setAriaExpanded(state.open);
    }
  }

  @HostListener('click', ['$event'])
  click(event: Event) {
    if (this.frontal.buttonClick) {
      this.frontal.buttonClick();
    }
  }

  setAriaExpanded(value: boolean) {
    this.ariaExpanded = value;
    this.ariaLabel = value ? 'open menu' : 'close menu';
  }
}

export const FRONTAL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FrontalComponent),
  multi: true,
};

@Component({
  selector: 'frontal',
  exportAs: 'frontal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngTemplateOutlet="template; context: getState()"></ng-container>
  `,
  providers: [FRONTAL_VALUE_ACCESSOR],
})
export class FrontalComponent implements ControlValueAccessor {
  id = +Date.now();
  frontalItemsLength = 0;

  @Input()
  get reducer() {
    return this.state.reducer;
  }

  set reducer(fn: null | ((state: State, action: Action) => Action)) {
    this.state.reducer = fn;
  }

  @Input()
  get itemToString() {
    return this.state.itemToString;
  }

  set itemToString(fn: (value: any) => string) {
    this.state.itemToString = fn;
  }

  @ContentChild(TemplateRef) template: TemplateRef<any>;
  @ContentChild(FrontalInputDirective) frontalInput: FrontalInputDirective;
  @ContentChildren(FrontalItemDirective) frontalItems: QueryList<FrontalItemDirective>;

  private stateListeners: { id: string; listener: ((state: State, action: Action) => void) }[] = [];
  private state: State = initialState;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(public cd: ChangeDetectorRef) {
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
  }

  writeValue(value: any) {
    const inputText = value ? this.state.itemToString(value) : '';
    this.handle(
      {
        type: StateChanges.InputChange,
        payload: {
          selectedItem: value,
          inputText,
          inputValue: inputText,
        },
      },
      false,
    );
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  addListener = ({ id, listener }: { id: string; listener: (state: State, action: Action) => void }) => {
    this.stateListeners = [...this.stateListeners, { id, listener }];
  };

  removeListener = (id: string) => {
    this.stateListeners = this.stateListeners.filter(p => p.id !== id);
  };

  getState = () => this.state;

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
    const { selectedItem, inputText } = this.getSelected();
    if (this.state.open) {
      this.handle({
        type: StateChanges.InputBlur,
        payload: {
          open: false,
          highlightedIndex: null,
          selectedItem,
          inputText,
          inputValue: inputText,
        },
      });
    }
  };

  inputChange = (event: KeyboardEvent) => {
    const inputText = (<HTMLInputElement>event.target).value;
    this.handle({
      type: StateChanges.InputChange,
      payload: {
        inputText,
        inputValue: inputText,
        open: true,
        selectedItem: null,
      },
    });
  };

  inputKeydown = (event: KeyboardEvent) => {
    if (!this.state.open) {
      return;
    }

    const handlers: { [key: string]: () => Action } = {
      ArrowDown: () => ({
        type: StateChanges.InputKeydownArrowDown,
        payload: {
          selectedItem: null,
          highlightedIndex:
            this.frontalItemsLength === 0
              ? null
              : ((this.state.highlightedIndex === null ? -1 : this.state.highlightedIndex) + 1) %
                this.frontalItemsLength,
        },
      }),
      ArrowUp: () => ({
        type: StateChanges.InputKeydownArrowUp,
        payload: {
          selectedItem: null,
          highlightedIndex:
            this.frontalItemsLength === 0
              ? null
              : ((this.state.highlightedIndex === null ? 1 : this.state.highlightedIndex) -
                  1 +
                  this.frontalItemsLength) %
                this.frontalItemsLength,
        },
      }),
      Enter: () => {
        const { selectedItem, inputText } = this.getSelected();
        return {
          type: StateChanges.InputKeydownEnter,
          payload: {
            open: false,
            highlightedIndex: null,
            selectedItem,
            inputText,
            inputValue: inputText,
          },
        };
      },
      Escape: () => ({
        type: StateChanges.InputKeydownEsc,
        payload: {
          open: false,
          highlightedIndex: null,
          selectedItem: null,
          inputText: '',
          inputValue: '',
        },
      }),
    };

    const handler = handlers[event.key];
    if (handler) {
      this.handle(handler());
    }
  };

  itemClick = (item: FrontalItemDirective) => {
    const inputText = this.state.itemToString(item.value);
    if (this.state.open) {
      this.handle({
        type: StateChanges.ItemMouseClick,
        payload: {
          open: false,
          highlightedIndex: null,
          selectedItem: item.value,
          inputText,
          inputValue: inputText,
        },
      });
    }
  };

  itemEnter = (item: FrontalItemDirective) => {
    if (this.state.open) {
      this.handle({
        type: StateChanges.ItemMouseEnter,
        payload: {
          highlightedIndex: this.frontalItems.toArray().indexOf(item),
        },
      });
    }
  };

  itemLeave = (item: FrontalItemDirective) => {
    if (this.state.open) {
      this.handle({
        type: StateChanges.ItemMouseLeave,
        payload: {
          highlightedIndex: null,
        },
      });
    }
  };

  getHighlightedItem = () =>
    this.state.highlightedIndex === null
      ? null
      : this.frontalItems.find((_: FrontalItemDirective, index: number) => this.state.highlightedIndex === index);

  handle = (action: Action, detactChanges: boolean = true) => {
    const { payload } = this.state.reducer ? this.state.reducer(this.state, action) : action;

    const newState = {
      ...this.state,
      ...payload,
    };

    if (newState.selectedItem !== this.state.selectedItem) {
      this.onChange(newState.selectedItem);
    }

    this.state = newState;
    this.stateListeners.forEach(({ listener }) => listener(this.state, { type: action.type, payload }));

    if (detactChanges) {
      this.cd.detectChanges();
    }
  };

  getSelected = () => {
    let selectedItem = null;
    const highlighted = this.getHighlightedItem();
    if (highlighted) {
      selectedItem = highlighted.value;
    }
    const inputText = highlighted ? this.state.itemToString(highlighted.value) : '';
    return { selectedItem, inputText };
  };
}

function noop() {}
