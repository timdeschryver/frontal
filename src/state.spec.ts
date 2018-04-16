import { createState } from './state';

describe('createState', () => {
  test('should generate an id', () => {
    expect(createState().id).toBeDefined();
  });
});
