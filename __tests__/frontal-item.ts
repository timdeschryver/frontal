import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FrontalComponent, FrontalItemDirective, StatusMessagePipe, resetId } from '../src';

test('sanity check for attributes', () => {
  const { items } = setup();
  expect(items.map(item => item.nativeElement)).toMatchSnapshot();
});

test('mouse down selects the item', () => {
  const { item, frontal } = setup();
  frontal.state.isOpen = true;
  frontal.state.highlightedIndex = 1;
  frontal.state.highlightedItem = 'foo';

  item.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
  expect(frontal.state).toMatchObject(
    expect.objectContaining({
      highlightedItem: null,
      highlightedIndex: null,
      selectedItem: 'uno',
      inputText: 'uno',
      inputValue: 'uno',
    }),
  );
});

test('mouse down closes the list', () => {
  const { item, frontal } = setup();
  frontal.state.isOpen = true;

  item.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
  expect(frontal.state).toMatchObject(expect.objectContaining({ isOpen: false }));
});

test('mouse move sets the highlighted index', () => {
  const { fixture, item, frontal } = setup();
  frontal.state.isOpen = true;
  item.nativeElement.dispatchEvent(new MouseEvent('mousemove'));

  expect(frontal.state).toMatchObject(
    expect.objectContaining({
      highlightedItem: 'uno',
      highlightedIndex: 0,
    }),
  );
});

test('mouse leave resets the highlighted index', () => {
  const { item, frontal } = setup();
  frontal.state.isOpen = true;
  frontal.state.highlightedIndex = 0;
  frontal.state.highlightedItem = 'uno';
  item.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
  expect(frontal.state).toMatchObject(
    expect.objectContaining({
      highlightedItem: null,
      highlightedIndex: null,
    }),
  );
});

test('highlighted index sets aria selected', () => {
  const { fixture, items, frontal } = setup();
  frontal.isOpen = true;

  items[1].nativeElement.dispatchEvent(new MouseEvent('mousemove'));
  expect(items[0].attributes['aria-selected']).toBe('false');
  expect(items[1].attributes['aria-selected']).toBe('true');

  items[0].nativeElement.dispatchEvent(new MouseEvent('mousemove'));
  expect(items[0].attributes['aria-selected']).toBe('true');
  expect(items[1].attributes['aria-selected']).toBe('false');
});

function setup() {
  resetId();

  TestBed.configureTestingModule({
    declarations: [TestComponent, FrontalComponent, FrontalItemDirective, StatusMessagePipe],
  });

  TestBed.overrideComponent(TestComponent, {
    set: {
      template: `
        <frontal>
          <ng-template>
            <div frontalItem [value]="'uno'" [index]="0"></div>
            <div frontalItem [value]="'dos'" [index]="1"></div>
            <div frontalItem [value]="'tres'" [index]="2"></div>
          </ng-template>
        </frontal>`,
    },
  });

  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();

  return {
    fixture,
    frontal: fixture.debugElement.query(By.css('frontal')).componentInstance as FrontalComponent,
    item: fixture.debugElement.query(By.css('[frontalItem]')),
    items: fixture.debugElement.queryAll(By.css('[frontalItem]')),
  };
}

@Component({ selector: 'test', template: '' })
class TestComponent {}
