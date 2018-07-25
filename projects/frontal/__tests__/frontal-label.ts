import { createComponent } from 'ngx-testing-library';
import { FrontalComponent, FrontalLabelDirective, StatusMessagePipe, resetId } from '../src';

test('sanity check for attributes', async () => {
  const { label } = await setup();
  expect(label).toMatchSnapshot();
});

async function setup() {
  const template = `
    <frontal>
      <ng-template>
        <label frontalLabel></label>
      </ng-template>
    </frontal>`;

  resetId();
  const { container } = await createComponent(template, {
    declarations: [FrontalComponent, FrontalLabelDirective, StatusMessagePipe],
  });

  return {
    label: container.querySelector('label'),
  };
}
