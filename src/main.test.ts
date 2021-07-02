import { Abc, greet } from './main';

test('the data is peanut butter', () => {
  expect(1).toBe(1)
});

test('greeting', () => {
  expect(greet('Foo')).toBe('Hello Foo')
});

test('Abc ctor', () => {
  expect(new Abc(1).num).toBe(1)
})
