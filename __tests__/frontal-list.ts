import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FrontalComponent, FrontalListDirective, StatusMessagePipe, resetId } from '../src';

test('sanity check for attributes', () => {
  const { list } = setup();
  expect(list.nativeElement).toMatchSnapshot();
});

function setup() {
  resetId();

  TestBed.configureTestingModule({
    declarations: [TestComponent, FrontalComponent, FrontalListDirective, StatusMessagePipe],
  });

  TestBed.overrideComponent(TestComponent, {
    set: {
      template: `
        <frontal>
          <ng-template>
            <div frontalList></div>
          </ng-template>
        </frontal>`,
    },
  });

  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();

  return {
    fixture,
    frontal: fixture.debugElement.query(By.css('frontal')).componentInstance as FrontalComponent,
    list: fixture.debugElement.query(By.css('[frontalList]')),
  };
}

@Component({ selector: 'test', template: '' })
class TestComponent {}
