import { Component } from '@angular/core';
import { createComponent } from 'ngx-testing-library';
import { FrontalComponent, FrontalListDirective, StatusMessagePipe, resetId } from '../src';

test('sanity check for attributes', async () => {
  const { list } = await setup();
  expect(list).toMatchSnapshot();
});

async function setup() {
  const template = `
    <frontal>
      <ng-template>
        <div frontalList></div>
      </ng-template>
    </frontal>`;

  resetId();
  const { container } = await createComponent(template, {
    declarations: [FrontalComponent, FrontalListDirective, StatusMessagePipe],
  });

  return {
    list: container.querySelector('[frontalList]'),
  };
}
