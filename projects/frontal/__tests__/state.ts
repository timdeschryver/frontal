import { createState } from '../src';

test('createState', () => {
  expect(createState('123').id).toBe('123');
});
