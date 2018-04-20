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
  OnDestroy,
  Output,
  EventEmitter,
  ViewRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Action, StateChanges } from './actions';
import { State, initialState, createState } from './state';
import { generateId } from './utils';

@Directive({
  selector: '[frontalInput]',
  exportAs: 'frontalInput',
})
export class FrontalInputDirective implements OnInit, OnDestroy {
  @HostBinding('attr.role') role = 'combobox';
  @HostBinding('attr.aria-autocomplete') ariaAutocomplete = 'list';
  @HostBinding('attr.autocomplete') autocomplete = 'off';
  @HostBinding('attr.aria-expanded') ariaExpanded = false;
  @HostBinding('attr.aria-activedescendant') ariaActiveDescendant = '';
  @HostBinding('attr.aria-labelledby') ariaLabeledBy = createFrontalLabelId(this.frontal.state.id);
  @HostBinding('attr.aria-controls') ariaControls = createFrontalListId(this.frontal.state.id);
  @HostBinding('attr.id') attrId = createFrontalInputId(this.frontal.state.id);

  constructor(
    @Inject(ElementRef) private element: ElementRef,
    // prettier-ignore
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent,
  ) {}

  ngOnInit() {
    this.frontal.addListener({ id: 'input', listener: this.stateChange.bind(this) });
    this.setAriaAttributes();
    this.setValue(this.frontal.state.inputText);
  }

  ngOnDestroy() {
    this.frontal.removeListener('input');
  }

  @HostListener('focus', ['$event'])
  focus(event: Event) {
    this.frontal.inputFocus();
  }

  @HostListener('blur', ['$event'])
  blur(event: Event) {
    this.frontal.inputBlur();
  }

  @HostListener('input', ['$event'])
  input(event: KeyboardEvent) {
    this.frontal.inputChange(event);
  }

  @HostListener('keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    this.frontal.inputKeydown(event);
  }

  private stateChange(state: State) {
    this.setAriaAttributes();

    if (this.element.nativeElement.value !== state.inputText) {
      this.setValue(state.inputText);
    }
  }

  private setAriaAttributes() {
    this.ariaExpanded = this.frontal.state.isOpen;
    const highlighted = this.frontal.getHighlightedItem(this.frontal.state.highlightedIndex);
    this.ariaActiveDescendant = highlighted ? highlighted.attrId : '';
  }

  private setValue(value: string) {
    this.element.nativeElement.value = value;
  }
}

@Directive({
  selector: '[frontalButton]',
  exportAs: 'frontalButton',
})
export class FrontalButtonDirective implements OnInit, OnDestroy {
  @HostBinding('attr.type') type = 'button';
  @HostBinding('attr.role') role = 'button';
  @HostBinding('attr.data-toggle') dataToggle = true;
  @HostBinding('attr.aria-haspopup') ariaHasPopup = 'listbox';
  @HostBinding('attr.aria-expanded') ariaExpanded = false;
  @HostBinding('attr.aria-label') ariaLabel = '';
  @HostBinding('attr.id') attrId = createFrontalButtonId(this.frontal.state.id);
  @HostBinding('attr.aria-labelledby') ariaLabeledBy = createFrontalLabelId(this.frontal.state.id);

  constructor(
    // prettier-ignore
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent,
  ) {}

  ngOnInit() {
    this.frontal.addListener({ id: 'button', listener: this.stateChange.bind(this) });
    this.setAriaAttributes();
  }

  ngOnDestroy() {
    this.frontal.removeListener('button');
  }

  @HostListener('click', ['$event'])
  click(event: MouseEvent) {
    this.frontal.buttonClick();
  }

  private stateChange(state: State) {
    this.setAriaAttributes();
  }

  private setAriaAttributes() {
    this.ariaExpanded = this.frontal.state.isOpen;
    this.ariaLabel = this.frontal.state.isOpen ? 'close menu' : 'open menu';
  }
}

@Directive({
  selector: '[frontalLabel]',
  exportAs: 'frontalLabel',
})
export class FrontalLabelDirective {
  @HostBinding('attr.id') attrId = createFrontalLabelId(this.frontal.state.id);
  @HostBinding('attr.for') attrFor = createFrontalInputId(this.frontal.state.id);

  constructor(
    // prettier-ignore
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent,
  ) {}
}

@Directive({
  selector: '[frontalList]',
  exportAs: 'frontalList',
})
export class FrontalListDirective {
  @HostBinding('attr.role') role = 'listbox';
  @HostBinding('attr.id') attrId = createFrontalListId(this.frontal.state.id);
  @HostBinding('attr.aria-labelledby') ariaLabeledBy = createFrontalLabelId(this.frontal.state.id);

  constructor(
    // prettier-ignore
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent,
  ) {}

  @HostListener('mousedown', ['$event'])
  mousedown(event: MouseEvent) {
    // event.preventDefault();
  }
}

@Directive({
  selector: '[frontalItem]',
  exportAs: 'frontalItem',
})
export class FrontalItemDirective implements OnInit, OnDestroy {
  @HostBinding('attr.role') role = 'option';
  @HostBinding('attr.aria-selected') ariaSelected = false;
  @HostBinding('attr.id') attrId = createFrontalItemId(this.frontal.state.id, generateId());

  @Input() value: any;

  constructor(
    // prettier-ignore
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent,
  ) {}

  ngOnInit() {
    this.frontal.addFrontalItem();
    this.frontal.addListener({ id: this.attrId, listener: this.stateChange.bind(this) });
    this.setAriaAttributes();
  }

  ngOnDestroy() {
    this.frontal.removeFrontalItem();
    this.frontal.removeListener(this.attrId);
  }

  @HostListener('mousedown', ['$event'])
  mousedown(event: MouseEvent) {
    this.frontal.itemClick(this);
  }

  @HostListener('mousemove', ['$event'])
  mousemove(event: MouseEvent) {
    this.frontal.itemMove(this);
  }

  @HostListener('mouseleave', ['$event'])
  mouseleave(event: MouseEvent) {
    this.frontal.itemLeave(this);
  }

  private stateChange(state: State) {
    this.setAriaAttributes();
  }

  private setAriaAttributes() {
    const highlighted = this.frontal.getHighlightedItem(this.frontal.state.highlightedIndex);
    this.ariaSelected = (highlighted && highlighted.attrId === this.attrId) || false;
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
    <ng-container *ngTemplateOutlet="template; context: state"></ng-container>
    <p role="status" aria-live="assertive" [ngStyle]="statusStyle">{{ state | statusMessage }}</p>
  `,
  providers: [FRONTAL_VALUE_ACCESSOR],
})
export class FrontalComponent implements ControlValueAccessor {
  state: State = createState();
  statusStyle = {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  };

  @Input()
  set reducer(fun: (state: State, action: Action) => Action) {
    this.state.reducer = fun;
  }

  @Input()
  set itemToString(fun: (value: any) => string) {
    this.state.itemToString = fun;
  }

  @Input()
  set isOpen(value: boolean) {
    this.state.isOpen = value;
  }

  @Output() change = new EventEmitter<string>();
  @Output() select = new EventEmitter<any>();

  @ContentChild(TemplateRef) template!: TemplateRef<any>;
  @ContentChild(FrontalInputDirective) frontalInput!: FrontalInputDirective;
  @ContentChildren(FrontalItemDirective, { descendants: true })
  frontalItems!: QueryList<FrontalItemDirective>;

  private _stateListeners: { id: string; listener: ((state: State) => void) }[] = [];
  private _onChange = (value: any) => {};
  private _onTouched = () => {};

  constructor(private _changeDetector: ChangeDetectorRef) {}

  writeValue(value: any) {
    // otherwise the reactive form doesn't render
    setTimeout(() => {
      const inputText = value ? this.state.itemToString(value) : '';
      this.handle({
        type: StateChanges.InputChange,
        payload: {
          highlightedIndex: null,
          selectedItem: value,
          inputText,
          inputValue: inputText,
          isOpen: false,
        },
      });
    });
  }

  registerOnChange(fn: any) {
    this._onChange = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

  addListener({ id, listener }: { id: string; listener: (state: State) => void }) {
    this._stateListeners = [...this._stateListeners, { id, listener }];
  }

  removeListener(id: string) {
    this._stateListeners = this._stateListeners.filter(p => p.id !== id);
  }

  toggleMenu() {
    this.handle({
      type: StateChanges.ListToggle,
      payload: {
        isOpen: !this.state.isOpen,
      },
    });
  }

  openMenu() {
    this.handle({
      type: StateChanges.ListOpen,
      payload: {
        isOpen: true,
      },
    });
  }

  closeMenu() {
    this.handle({
      type: StateChanges.ListClose,
      payload: {
        isOpen: false,
      },
    });
  }

  buttonClick() {
    this.handle({
      type: StateChanges.ButtonClick,
      payload: {
        isOpen: !this.state.isOpen,
      },
    });
  }

  inputFocus() {
    this.handle({
      type: StateChanges.InputFocus,
      payload: {},
    });
  }

  inputBlur() {
    if (this.state.isOpen) {
      const { selectedItem, inputValue } = this.getSelected();
      this.handle({
        type: StateChanges.InputBlur,
        payload: {
          isOpen: false,
          highlightedIndex: null,
          selectedItem,
          inputText: inputValue,
          inputValue,
        },
      });
    }
  }

  inputChange(event: KeyboardEvent) {
    const inputText = (<HTMLInputElement>event.target).value;
    this.handle({
      type: StateChanges.InputChange,
      payload: {
        inputText,
        inputValue: inputText,
        isOpen: true,
        selectedItem: null,
        highlightedIndex: null,
      },
    });
  }

  inputKeydown(event: KeyboardEvent) {
    if (!this.state.isOpen) {
      return;
    }

    const handlers: { [key: string]: () => Action } = {
      ArrowDown: () => {
        // prevent cursor to change its place
        event.preventDefault();
        return {
          type: StateChanges.InputKeydownArrowDown,
          payload: {
            selectedItem: null,
            highlightedIndex:
              this.state.itemCount === 0
                ? null
                : ((this.state.highlightedIndex === null ? -1 : this.state.highlightedIndex) + 1) %
                  this.state.itemCount,
          },
        };
      },
      ArrowUp: () => {
        // prevent cursor to change its place
        event.preventDefault();
        return {
          type: StateChanges.InputKeydownArrowUp,
          payload: {
            selectedItem: null,
            highlightedIndex:
              this.state.itemCount === 0
                ? null
                : ((this.state.highlightedIndex === null ? 1 : this.state.highlightedIndex) -
                    1 +
                    this.state.itemCount) %
                  this.state.itemCount,
          },
        };
      },
      Enter: () => {
        const { selectedItem, inputValue } = this.getSelected();
        return {
          type: StateChanges.InputKeydownEnter,
          payload: {
            isOpen: false,
            highlightedIndex: null,
            selectedItem,
            inputText: inputValue,
            inputValue,
          },
        };
      },
      Escape: () => ({
        type: StateChanges.InputKeydownEsc,
        payload: {
          isOpen: false,
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
  }

  itemClick(item: FrontalItemDirective) {
    const inputText = this.state.itemToString(item.value);
    if (this.state.isOpen) {
      this.handle({
        type: StateChanges.ItemMouseClick,
        payload: {
          isOpen: false,
          highlightedIndex: null,
          selectedItem: item.value,
          inputText,
          inputValue: inputText,
        },
      });
    }
  }

  // MouseMove because we want a user interaction
  // MouseEnter selects an item when the mouse is hovering over an item while typing
  itemMove(item: FrontalItemDirective) {
    if (this.state.isOpen) {
      const index = this.frontalItems.toArray().indexOf(item);
      if (index !== -1 && index !== this.state.highlightedIndex) {
        this.handle({
          type: StateChanges.ItemMouseEnter,
          payload: {
            highlightedIndex: index,
          },
        });
      }
    }
  }

  itemLeave(item: FrontalItemDirective) {
    if (this.state.isOpen) {
      this.handle({
        type: StateChanges.ItemMouseLeave,
        payload: {
          highlightedIndex: null,
        },
      });
    }
  }

  getHighlightedItem(index: number | null) {
    return index === null ? null : this.frontalItems.find((_: FrontalItemDirective, idx: number) => index === idx);
  }

  getSelected() {
    const inputValue = this.state.highlightedItem ? this.state.itemToString(this.state.highlightedItem) : '';
    return { selectedItem: this.state.highlightedItem, inputValue };
  }

  handle(action: Action) {
    const { payload } = this.state.reducer(this.state, action);
    const newState = {
      ...this.state,
      ...payload,
    };

    if (newState.highlightedIndex !== this.state.highlightedIndex) {
      const highlighted =
        newState.highlightedIndex === null ? null : this.getHighlightedItem(newState.highlightedIndex);
      newState.highlightedItem = highlighted ? highlighted.value : null;
    }

    if (newState.selectedItem !== this.state.selectedItem) {
      this._onChange(newState.selectedItem);
      if (newState.selectedItem !== null) {
        this.select.emit(newState.selectedItem);
      }
    }

    if (this.state.inputValue !== newState.inputValue) {
      this.change.emit(newState.inputValue);
    }

    this.state = newState;
    this._stateListeners.forEach(({ listener }) => listener(this.state));

    this._changeDetector.detectChanges();
  }

  addFrontalItem() {
    this.state = {
      ...this.state,
      itemCount: this.state.itemCount + 1,
    };

    this._changeDetector.detectChanges();
  }

  removeFrontalItem() {
    this.state = {
      ...this.state,
      itemCount: this.state.itemCount - 1,
    };

    setTimeout(() => {
      const viewRef = this._changeDetector as ViewRef;
      if (viewRef && !viewRef.destroyed) {
        this._changeDetector.detectChanges();
      }
    });
  }
}

function createFrontalInputId(id: string) {
  return `frontal-input-${id}`;
}

function createFrontalButtonId(id: string) {
  return `frontal-button-${id}`;
}

function createFrontalLabelId(id: string) {
  return `frontal-label-${id}`;
}

function createFrontalListId(id: string) {
  return `frontal-list-${id}`;
}

function createFrontalItemId(frontalId: string, id: string) {
  return `frontal-item-${frontalId}-${id}`;
}
