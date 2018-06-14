import { Component } from '@angular/core';
import { createComponent, fireEvent } from 'ngx-testing-library';
import { FrontalComponent, FrontalButtonDirective, StatusMessagePipe, resetId } from '../src';

test('sanity check for attributes', async () => {
  const { button } = await setup();
  expect(button).toMatchSnapshot();
});

test('clicking on the button toggles the list', async () => {
  const { button, frontal: { state } } = await setup();

  fireEvent.click(button);
  expect(state).toMatchObject(expect.objectContaining({ isOpen: true, highlightedIndex: 0 }));

  fireEvent.click(button);
  expect(state).toMatchObject(expect.objectContaining({ isOpen: false, highlightedIndex: null }));
});

test('isOpen toggles the aria label', async () => {
  const { button } = await setup();

  fireEvent.click(button);
  expect(button.getAttribute('aria-label')).toBe('close menu');

  fireEvent.click(button);
  expect(button.getAttribute('aria-label')).toBe('open menu');
});

async function setup() {
  const template = `
    <frontal [defaultHighlightedIndex]="0">
      <ng-template>
        <button frontalButton></button>
      </ng-template>
    </frontal>`;

  resetId();
  const { getComponentInstance, container } = await createComponent(template, {
    declarations: [FrontalComponent, FrontalButtonDirective, StatusMessagePipe],
  });

  return {
    frontal: getComponentInstance<FrontalComponent>('frontal'),
    button: container.querySelector('button'),
  };
}
