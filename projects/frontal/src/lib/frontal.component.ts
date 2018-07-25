import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ContentChild,
  TemplateRef,
  Directive,
  HostBinding,
  ElementRef,
  Input,
  Inject,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewRef,
  AfterViewInit,
  PLATFORM_ID,
  QueryList,
  ContentChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Subject, BehaviorSubject, animationFrameScheduler } from 'rxjs';
import { takeUntil, tap, scan, withLatestFrom, filter, auditTime, distinctUntilChanged, map } from 'rxjs/operators';
import {
  Action,
  StateChanges,
  updateState,
  listToggle,
  listOpen,
  listClose,
  buttonClick,
  inputBlur,
  inputFocus,
  inputChange,
  itemMouseLeave,
  itemMouseClick,
  itemMouseEnter,
  inputKeydownArrowDown,
  inputKeydownArrowUp,
  inputKeydownEnter,
  inputKeydownEsc,
  updateItems,
  setItem,
} from './actions';
import { State, createState } from './state';
import {
  generateId,
  createFrontalLabelId,
  createFrontalListId,
  createFrontalInputId,
  createFrontalButtonId,
  createFrontalItemId,
} from './utils';

@Directive({
  selector: '[frontalInput]',
  exportAs: 'frontalInput',
})
export class FrontalInputDirective implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('attr.role') role = 'combobox';
  @HostBinding('attr.aria-autocomplete') ariaAutocomplete = 'list';
  @HostBinding('attr.autocomplete') autocomplete = 'off';
  @HostBinding('attr.aria-expanded') ariaExpanded = false;
  @HostBinding('attr.aria-activedescendant') ariaActiveDescendant = '';
  @HostBinding('attr.aria-labelledby') ariaLabeledBy = '';
  @HostBinding('attr.aria-controls') ariaControls = '';
  @HostBinding('attr.id') attrId = '';
  private destroy = new Subject<void>();

  constructor(
    private element: ElementRef,
    @Inject(forwardRef(() => FrontalComponent))
    private frontal: FrontalComponent,
  ) {}

  ngOnInit() {
    this.ariaLabeledBy = createFrontalLabelId(this.frontal.id);
    this.ariaControls = createFrontalListId(this.frontal.id);
    this.attrId = createFrontalInputId(this.frontal.id);

    this.frontal.state.pipe(takeUntil(this.destroy)).subscribe(state => {
      this.setValue(state.inputText);
      this.setAriaAttributes(state);
    });
  }

  ngAfterViewInit() {
    fromEvent(this.element.nativeElement, 'focus')
      .pipe(takeUntil(this.destroy))
      .subscribe(_ => this.frontal.inputFocus());

    fromEvent(this.element.nativeElement, 'blur')
      .pipe(
        withLatestFrom(this.frontal.state),
        takeUntil(this.destroy),
      )
      .subscribe(_ => this.frontal.inputBlur());

    fromEvent<KeyboardEvent>(this.element.nativeElement, 'input')
      .pipe(takeUntil(this.destroy))
      .subscribe(event => this.frontal.inputChange((<HTMLInputElement>event.target).value));

    fromEvent<KeyboardEvent>(this.element.nativeElement, 'keydown')
      .pipe(
        withLatestFrom(this.frontal.state),
        takeUntil(this.destroy),
      )
      .subscribe(([event]) => {
        const handlers: { [key: string]: () => any } = {
          ArrowDown: () => {
            // Prevent cursor to change its place
            event.preventDefault();
            return this.frontal.inputArrowDown();
          },
          ArrowUp: () => {
            // Prevent cursor to change its place
            event.preventDefault();
            return this.frontal.inputArrowUp();
          },
          Enter: () => this.frontal.inputEnter(),
          Escape: () => this.frontal.inputEscape(),
        };

        const handler = handlers[event.key];
        if (handler) {
          handler();
        }
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  private setValue(value: string) {
    if (this.element.nativeElement.value !== value) {
      this.element.nativeElement.value = value;
    }
  }

  private setAriaAttributes({ isOpen, highlightedIndex }: State) {
    this.ariaExpanded = isOpen;
    const highlighted = this.frontal.getItemAtIndex(highlightedIndex);
    this.ariaActiveDescendant = highlighted ? highlighted.attrId : '';
  }
}

@Directive({
  selector: '[frontalButton]',
  exportAs: 'frontalButton',
})
export class FrontalButtonDirective implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('attr.type') type = 'button';
  @HostBinding('attr.role') role = 'button';
  @HostBinding('attr.data-toggle') dataToggle = true;
  @HostBinding('attr.aria-haspopup') ariaHasPopup = 'listbox';
  @HostBinding('attr.aria-expanded') ariaExpanded = false;
  @HostBinding('attr.aria-label') ariaLabel = '';
  @HostBinding('attr.id') attrId = createFrontalButtonId(this.frontal.id);
  @HostBinding('attr.aria-labelledby') ariaLabeledBy = createFrontalLabelId(this.frontal.id);
  private destroy = new Subject<void>();

  constructor(
    private element: ElementRef,
    @Inject(forwardRef(() => FrontalComponent))
    private frontal: FrontalComponent,
  ) {}

  ngOnInit() {
    this.frontal.state.pipe(takeUntil(this.destroy)).subscribe(state => this.setAriaAttributes(state));
  }

  ngAfterViewInit() {
    fromEvent(this.element.nativeElement, 'click')
      .pipe(takeUntil(this.destroy))
      .subscribe(_ => this.frontal.buttonClick());
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  private setAriaAttributes({ isOpen }: State) {
    this.ariaExpanded = isOpen;
    this.ariaLabel = isOpen ? 'close menu' : 'open menu';
  }
}

@Directive({
  selector: '[frontalLabel]',
  exportAs: 'frontalLabel',
})
export class FrontalLabelDirective implements OnDestroy {
  @HostBinding('attr.id') attrId = createFrontalLabelId(this.frontal.id);
  @HostBinding('attr.for') attrFor = createFrontalInputId(this.frontal.id);
  private destroy = new Subject<void>();

  constructor(
    @Inject(forwardRef(() => FrontalComponent))
    private frontal: FrontalComponent,
  ) {}

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}

@Directive({
  selector: '[frontalList]',
  exportAs: 'frontalList',
})
export class FrontalListDirective implements AfterViewInit, OnDestroy {
  @HostBinding('attr.role') role = 'listbox';
  @HostBinding('attr.id') attrId = createFrontalListId(this.frontal.id);
  @HostBinding('attr.aria-labelledby') ariaLabeledBy = createFrontalLabelId(this.frontal.id);
  private destroy = new Subject<void>();

  constructor(
    private element: ElementRef,
    @Inject(forwardRef(() => FrontalComponent))
    private frontal: FrontalComponent,
  ) {}

  ngAfterViewInit() {
    fromEvent<MouseEvent>(this.element.nativeElement, 'mousedown')
      .pipe(takeUntil(this.destroy))
      .subscribe(event => event.preventDefault());
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}

@Directive({
  selector: '[frontalItem]',
  exportAs: 'frontalItem',
})
export class FrontalItemDirective implements OnInit, AfterViewInit, OnDestroy {
  private destroy = new Subject<void>();

  @HostBinding('attr.role') role = 'option';
  @HostBinding('attr.aria-selected') ariaSelected = false;
  @HostBinding('attr.id') attrId = createFrontalItemId(this.frontal.id, generateId());
  @Input() value: any;

  constructor(
    private element: ElementRef,
    @Inject(forwardRef(() => FrontalComponent))
    private frontal: FrontalComponent,
  ) {}

  ngOnInit() {
    this.frontal.frontalItems.notifyOnChanges();
    this.frontal.state.pipe(takeUntil(this.destroy)).subscribe(state => this.setAriaAttributes(state));
  }

  ngAfterViewInit() {
    fromEvent(this.element.nativeElement, 'mousedown')
      .pipe(takeUntil(this.destroy))
      .subscribe(_ => this.frontal.itemClick(this.value));

    // MouseMove because we want a user interaction
    // MouseEnter selects an item when the mouse is hovering over an item while typing
    fromEvent(this.element.nativeElement, 'mousemove')
      .pipe(
        withLatestFrom(this.frontal.state),
        map(([_, state]) => ({
          currentIndex: state.highlightedIndex,
          myIndex: this.frontal.frontalItems.toArray().indexOf(this),
        })),
        filter(({ currentIndex, myIndex }) => currentIndex !== myIndex),
        takeUntil(this.destroy),
      )
      .subscribe(({ myIndex }) => this.frontal.itemEnter(myIndex));

    fromEvent(this.element.nativeElement, 'mouseleave')
      .pipe(takeUntil(this.destroy))
      .subscribe(_ => this.frontal.itemLeave());
  }

  ngOnDestroy() {
    this.frontal.frontalItems.notifyOnChanges();
    this.destroy.next();
    this.destroy.complete();
  }

  private setAriaAttributes({ highlightedIndex }: State) {
    const highlighted = this.frontal.getItemAtIndex(highlightedIndex);
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
    <ng-container *ngIf="state | async as frontalState">
      <ng-container *ngTemplateOutlet="template; context: frontalState"></ng-container>
      <p role="status" aria-live="assertive" [ngStyle]="statusStyle">{{ frontalState | statusMessage }}</p>
    </ng-container>
  `,
  providers: [FRONTAL_VALUE_ACCESSOR],
})
export class FrontalComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  private _id = generateId();
  private initialState = createState(this.id);
  private destroy = new Subject<void>();

  state = new BehaviorSubject(this.initialState);
  actions = new Subject<Action>();

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
  set reducer(
    fun: ({ state, action, changes }: { state: State; action: Action; changes: Partial<State> }) => Partial<State>,
  ) {
    this.actions.next(updateState({ reducer: fun }));
  }

  @Input()
  set itemToString(fun: (value: any) => string) {
    this.actions.next(updateState({ itemToString: fun }));
  }

  @Input()
  set isOpen(value: boolean) {
    this.actions.next(updateState({ isOpen: value }));
  }

  @Input()
  set defaultHighlightedIndex(value: number | null) {
    this.actions.next(updateState({ defaultHighlightedIndex: value, highlightedIndex: value }));
  }

  get id() {
    return this._id;
  }

  @Output() change = new EventEmitter<string>();
  @Output() select = new EventEmitter<any>();

  @ContentChild(TemplateRef) template!: TemplateRef<any>;
  @ContentChild(FrontalInputDirective) frontalInput!: FrontalInputDirective;
  @ContentChildren(FrontalItemDirective, { descendants: true })
  frontalItems!: QueryList<FrontalItemDirective>;

  private _onChange = (value: any) => {};

  constructor(private _changeDetector: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: any) {
    this.actions
      .pipe(
        scan(
          ({ state, oldState }: { state: State; oldState: State }, action: Action) => {
            const changes = this.stateReducer(state, action);
            const externalChanges = state.reducer({ state, changes, action });
            // tslint:disable-next-line:prefer-const
            let extraChanges: Partial<State> = {};

            if ('itemCount' in changes && changes.itemCount !== undefined && changes.itemCount !== state.itemCount) {
              const highlighted = this.getItemAtIndex(state.highlightedIndex);
              extraChanges.highlightedItem = highlighted ? highlighted.value : null;
            } else if (
              'highlightedIndex' in changes &&
              changes.highlightedIndex !== undefined &&
              changes.highlightedIndex !== state.highlightedIndex
            ) {
              const highlighted = this.getItemAtIndex(changes.highlightedIndex);
              extraChanges.highlightedItem = highlighted ? highlighted.value : null;
            }

            return {
              oldState: state,
              state: { ...state, ...externalChanges, ...extraChanges },
            };
          },
          { state: this.initialState, oldState: <State>{} },
        ),
        tap(this.emitSelect),
        tap(this.emitOnChange),
        takeUntil(this.destroy),
      )
      .subscribe(({ state }) => this.state.next(state));
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.frontalItems.changes
        .pipe(
          auditTime(0, animationFrameScheduler),
          tap(_ => this._changeDetector.markForCheck()),
          map((items: QueryList<FrontalItemDirective>) => items.length),
          distinctUntilChanged(),
        )
        .subscribe(itemCount => this.actions.next(updateItems(itemCount)));

      this.state
        .pipe(
          auditTime(0, animationFrameScheduler),
          filter(_ => {
            const viewRef = this._changeDetector as ViewRef;
            return viewRef && !viewRef.destroyed;
          }),
          takeUntil(this.destroy),
        )
        .subscribe(_ => this._changeDetector.detectChanges());

      this.frontalItems.notifyOnChanges();
    }
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  writeValue(value: any) {
    this.actions.next(setItem(value));
  }

  registerOnChange(fn: any) {
    this._onChange = fn;
  }

  registerOnTouched(fn: any) {}

  toggleList() {
    this.actions.next(listToggle());
  }

  openList() {
    this.actions.next(listOpen());
  }

  closeList() {
    this.actions.next(listClose());
  }

  buttonClick() {
    this.actions.next(buttonClick());
  }

  inputFocus() {
    this.actions.next(inputFocus());
  }

  inputBlur() {
    this.actions.next(inputBlur());
  }

  inputChange(value: string) {
    this.actions.next(inputChange(value));
  }

  inputArrowDown() {
    this.actions.next(inputKeydownArrowDown());
  }

  inputArrowUp() {
    this.actions.next(inputKeydownArrowUp());
  }

  inputEnter() {
    this.actions.next(inputKeydownEnter());
  }

  inputEscape() {
    this.actions.next(inputKeydownEsc());
  }

  itemClick(value: any) {
    this.actions.next(itemMouseClick(value));
  }

  itemEnter(index: number) {
    this.actions.next(itemMouseEnter(index));
  }

  itemLeave() {
    this.actions.next(itemMouseLeave());
  }

  getItemAtIndex(index: number | null) {
    return index !== null && this.frontalItems ? this.frontalItems.toArray()[index] : null;
  }

  private stateReducer(state: State, action: Action): Partial<State> {
    switch (action.type) {
      case StateChanges.UpdateState:
      case StateChanges.UpdateItems:
        return action.payload;
      case StateChanges.SetItem:
        const itemText = action.payload.item ? state.itemToString(action.payload.item) : '';
        return {
          highlightedIndex: null,
          selectedItem: action.payload.item,
          inputText: itemText,
          inputValue: itemText,
          isOpen: false,
        };
      case StateChanges.ListToggle:
        return {
          isOpen: !state.isOpen,
          highlightedIndex: state.isOpen ? null : state.defaultHighlightedIndex,
        };
      case StateChanges.ListOpen:
        return {
          isOpen: true,
          highlightedIndex: state.defaultHighlightedIndex,
        };
      case StateChanges.ListClose:
        return {
          isOpen: false,
          highlightedIndex: null,
        };
      case StateChanges.ButtonClick:
        return {
          isOpen: !state.isOpen,
          highlightedIndex: state.isOpen ? null : state.defaultHighlightedIndex,
        };
      case StateChanges.InputBlur:
        if (!state.isOpen) {
          return {};
        }

        const blurValue = state.highlightedItem ? state.itemToString(state.highlightedItem) : '';
        return {
          isOpen: false,
          highlightedIndex: null,
          selectedItem: state.highlightedItem,
          inputText: blurValue,
          inputValue: blurValue,
        };
      case StateChanges.InputFocus:
        return {};
      case StateChanges.InputChange:
        return {
          inputText: action.payload.value,
          inputValue: action.payload.value,
          isOpen: true,
          selectedItem: null,
          highlightedIndex: state.defaultHighlightedIndex,
        };
      case StateChanges.InputKeydownArrowDown:
        if (!state.isOpen) {
          return {};
        }

        return {
          selectedItem: null,
          highlightedIndex:
            state.itemCount === 0
              ? null
              : ((state.highlightedIndex === null ? -1 : state.highlightedIndex) + 1) % state.itemCount,
        };
      case StateChanges.InputKeydownArrowUp:
        if (!state.isOpen) {
          return {};
        }

        return {
          selectedItem: null,
          highlightedIndex:
            state.itemCount === 0
              ? null
              : ((state.highlightedIndex === null ? 1 : state.highlightedIndex) - 1 + state.itemCount) %
                state.itemCount,
        };
      case StateChanges.InputKeydownEnter:
        if (!state.isOpen) {
          return {};
        }

        const enterValue = state.highlightedItem ? state.itemToString(state.highlightedItem) : '';
        return {
          isOpen: false,
          highlightedIndex: null,
          selectedItem: state.highlightedItem,
          inputText: enterValue,
          inputValue: enterValue,
        };
      case StateChanges.InputKeydownEsc:
        if (!state.isOpen) {
          return {};
        }

        return {
          isOpen: false,
          highlightedIndex: null,
          selectedItem: null,
          inputText: '',
          inputValue: '',
        };
      case StateChanges.ItemMouseLeave:
        return {
          highlightedIndex: null,
        };
      case StateChanges.ItemMouseClick:
        const inputText = state.itemToString(action.payload.item);
        return {
          isOpen: false,
          highlightedIndex: null,
          selectedItem: action.payload.item,
          inputText,
          inputValue: inputText,
        };
      case StateChanges.ItemMouseEnter:
        return {
          highlightedIndex: action.payload.index,
        };
      default:
        return {};
    }
  }

  private emitSelect = ({ oldState, state }: { oldState: State; state: State }) => {
    if (state.selectedItem !== oldState.selectedItem) {
      this._onChange(state.selectedItem);
      if (state.selectedItem !== null) {
        this.select.emit(state.selectedItem);
      }
    }
  };

  private emitOnChange = ({ oldState, state }: { oldState: State; state: State }) => {
    if (state.inputValue !== oldState.inputValue) {
      this.change.emit(state.inputValue);
    }
  };
}
