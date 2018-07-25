import { By } from '@angular/platform-browser';
import { createComponent } from 'ngx-testing-library';
import { FrontalComponent, FrontalListDirective, StatusMessagePipe, resetId, updateState, State } from '../src';

test('sanity check for attributes', async () => {
  const { list } = await setup();
  expect(list).toMatchSnapshot();
});

test('listOpen opens the list', async () => {
  const { frontal } = await setup();
  frontal.openList();

  expect(frontal.state.value).toMatchObject(expect.objectContaining({ isOpen: true }));
});

test('listOpen sets the highlighted index', async () => {
  const { frontal } = await setup({ defaultHighlightedIndex: 3 });
  frontal.openList();

  expect(frontal.state.value).toMatchObject(expect.objectContaining({ isOpen: true, highlightedIndex: 3 }));
});

test('lostClose closes the list', async () => {
  const { frontal } = await setup({ highlightedIndex: 3 });
  frontal.closeList();

  expect(frontal.state.value).toMatchObject(expect.objectContaining({ isOpen: false, highlightedIndex: null }));
});

test('toggleList opens and closes the list', async () => {
  const { frontal } = await setup();

  frontal.toggleList();
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ isOpen: true }));

  frontal.toggleList();
  expect(frontal.state.value).toMatchObject(expect.objectContaining({ isOpen: false }));
});

async function setup(initialState: Partial<State> = {}) {
  const template = `
    <frontal>
      <ng-template>
        <div frontalList></div>
      </ng-template>
    </frontal>`;

  resetId();
  const { fixture, container } = await createComponent(template, {
    declarations: [FrontalComponent, FrontalListDirective, StatusMessagePipe],
  });

  const frontal = fixture.debugElement.query(By.css('frontal')).componentInstance as FrontalComponent;

  if (initialState) {
    frontal.actions.next(updateState(initialState));
  }

  return {
    frontal,
    list: container.querySelector('[frontalList]'),
  };
}
