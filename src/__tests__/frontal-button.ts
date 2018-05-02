import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FrontalComponent, FrontalButtonDirective } from '../frontal.component';
import { StatusMessagePipe } from '../status.pipe';
import { resetId } from '../utils';

test('sanity check for attributes', () => {
  const { button } = setup();
  expect(button.nativeElement).toMatchSnapshot();
});

test('clicking on the button toggles the list', () => {
  const { button, frontal: { state } } = setup();

  expect(state).toMatchObject(expect.objectContaining({ isOpen: false }));

  button.nativeElement.dispatchEvent(new MouseEvent('click'));
  expect(state).toMatchObject(expect.objectContaining({ isOpen: true }));

  button.nativeElement.dispatchEvent(new MouseEvent('click'));
  expect(state).toMatchObject(expect.objectContaining({ isOpen: false }));
});

test('isOpen toggles the aria label', () => {
  const { button } = setup();

  button.nativeElement.dispatchEvent(new MouseEvent('click'));
  expect(button.attributes['aria-label']).toBe('close menu');

  button.nativeElement.dispatchEvent(new MouseEvent('click'));
  expect(button.attributes['aria-label']).toBe('open menu');
});

function setup() {
  resetId();

  TestBed.configureTestingModule({
    declarations: [TestComponent, FrontalComponent, FrontalButtonDirective, StatusMessagePipe],
  });

  TestBed.overrideComponent(TestComponent, {
    set: {
      template: `
        <frontal>
          <ng-template>
            <button frontalButton></button>
          </ng-template>
        </frontal>`,
    },
  });

  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();

  return {
    fixture,
    frontal: fixture.debugElement.query(By.css('frontal')).componentInstance as FrontalComponent,
    button: fixture.debugElement.query(By.css('[frontalButton]')),
  };
}

@Component({ selector: 'test', template: '' })
class TestComponent {}
