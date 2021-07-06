import { AbmArrays } from '../abm-arrays';

const array = [{ a: 1, b: 'b1c1' }, { a: 2, b: "d2f2" }, { a: 3, b: "d3f3" }];

test('no index found', () => {
    expect(AbmArrays.indexOf(array, 'b', 'b2', true)).toBe(-1)
});
