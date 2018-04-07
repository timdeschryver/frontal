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
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent, // tslint:disable-line
  ) {}

  ngOnInit() {
    this.frontal.addListener({ id: 'input', listener: this.stateChange.bind(this) });
    this.setAriaAttributes();
    this.setValue(this.frontal.state.inputText);
  }

  ngOnDestroy() {
    this.frontal.removeListener('input');
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

    const highlighted = this.frontal.getHighlightedItem();
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
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent, // tslint:disable-line
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
    if (this.frontal.buttonClick) {
      this.frontal.buttonClick();
    }
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
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent, // tslint:disable-line
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
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent, // tslint:disable-line
  ) {}
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
    @Inject(forwardRef(() => FrontalComponent)) private frontal: FrontalComponent, // tslint:disable-line
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
    const highlighted = this.frontal.getHighlightedItem();
    this.ariaSelected = (highlighted && highlighted.attrId === this.attrId) || false;
  }
}

export const FRONTAL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FrontalComponent), // tslint:disable-line
  multi: true,
};

@Component({
  selector: 'frontal',
  exportAs: 'frontal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngTemplateOutlet="template; context: state"></ng-container>
  `,
  providers: [FRONTAL_VALUE_ACCESSOR],
})
export class FrontalComponent implements ControlValueAccessor {
  state: State = createState();

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

  @ContentChild(TemplateRef) template: TemplateRef<any>;
  @ContentChild(FrontalInputDirective) frontalInput: FrontalInputDirective;
  @ContentChildren(FrontalItemDirective, { descendants: true })
  frontalItems: QueryList<FrontalItemDirective>;

  private _stateListeners: { id: string; listener: ((state: State) => void) }[] = [];
  private _onChange = (value: any) => {};
  private _onTouched = () => {};

  constructor(private _changeDetector: ChangeDetectorRef) {}

  writeValue(value: any) {
    const inputText = value ? this.state.itemToString(value) : '';
    this.handle(
      {
        type: StateChanges.InputChange,
        payload: {
          highlightedIndex: null,
          selectedItem: value,
          inputText,
          inputValue: inputText,
        },
      },
      false,
    );
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

  inputBlur() {
    const { selectedItem, inputText } = this.getSelected();
    if (this.state.isOpen) {
      this.handle({
        type: StateChanges.InputBlur,
        payload: {
          isOpen: false,
          highlightedIndex: null,
          selectedItem,
          inputText,
          inputValue: inputText,
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
        const { selectedItem, inputText } = this.getSelected();
        return {
          type: StateChanges.InputKeydownEnter,
          payload: {
            isOpen: false,
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

  getHighlightedItem() {
    return this.state.highlightedIndex === null
      ? null
      : this.frontalItems.find((_: FrontalItemDirective, index: number) => this.state.highlightedIndex === index);
  }

  handle(action: Action, detactChanges: boolean = true) {
    const { payload } = this.state.reducer(this.state, action);
    const newState = {
      ...this.state,
      ...payload,
    };

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

    if (detactChanges) {
      this._changeDetector.detectChanges();
    }
  }

  getSelected() {
    let selectedItem = null;
    const highlighted = this.getHighlightedItem();
    if (highlighted) {
      selectedItem = highlighted.value;
    }
    const inputText = highlighted ? this.state.itemToString(highlighted.value) : '';
    return { selectedItem, inputText };
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
