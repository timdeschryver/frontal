import { createState } from '../src';

describe('createState', () => {
  test('generates an id', () => {
    expect(createState().id).toBeDefined();
  });
});
