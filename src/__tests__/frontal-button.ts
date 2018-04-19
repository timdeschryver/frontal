import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FrontalComponent, FrontalButtonDirective } from '../frontal.component';
import { StatusMessagePipe } from '../status.pipe';
import { resetId } from '../utils';

test('generates an id', () => {
  const { button } = setup();
  expect(button.attributes['id']).toBe('frontal-button-0');
});

test('generates an aria labelledby', () => {
  const { button } = setup();
  expect(button.attributes['aria-labelledby']).toBe('frontal-label-0');
});

test('clicking on the button toggles the list', () => {
  const { button, frontal: { state } } = setup();

  expect(state).toMatchObject(expect.objectContaining({ isOpen: false }));

  button.triggerEventHandler('click', {});
  expect(state).toMatchObject(expect.objectContaining({ isOpen: true }));

  button.triggerEventHandler('click', {});
  expect(state).toMatchObject(expect.objectContaining({ isOpen: false }));
});

test('clicking on the button toggles the aria label', () => {
  const { button } = setup();

  expect(button.attributes['aria-label']).toBe('open menu');

  button.triggerEventHandler('click', {});
  expect(button.attributes['aria-label']).toBe('close menu');

  button.triggerEventHandler('click', {});
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
