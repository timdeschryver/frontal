import { createState } from '../state';

describe('createState', () => {
  test('generates an id', () => {
    expect(createState().id).toBeDefined();
  });
});
