import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FrontalComponent, FrontalLabelDirective, StatusMessagePipe, resetId } from '../src';

test('sanity check for attributes', () => {
  const { label } = setup();
  expect(label.nativeElement).toMatchSnapshot();
});

function setup() {
  resetId();

  TestBed.configureTestingModule({
    declarations: [TestComponent, FrontalComponent, FrontalLabelDirective, StatusMessagePipe],
  });

  TestBed.overrideComponent(TestComponent, {
    set: {
      template: `
        <frontal>
          <ng-template>
            <label frontalLabel></label>
          </ng-template>
        </frontal>`,
    },
  });

  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();

  return {
    fixture,
    frontal: fixture.debugElement.query(By.css('frontal')).componentInstance as FrontalComponent,
    label: fixture.debugElement.query(By.css('[frontalLabel]')),
  };
}

@Component({ selector: 'test', template: '' })
class TestComponent {}
