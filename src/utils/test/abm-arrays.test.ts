import { AbmArrays } from '../abm-arrays';

const array = [{ a: 1, b: 'b1c1' }, { a: 2, b: "d2f2" }, { a: 3, b: "d3f3" }];

const dateArray = [{ date: '2024-02-01', a: 123 }, { date: '2021-10-01', a: 456 }];

const numberArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

test('no index found', () => {
    expect(AbmArrays.indexOf(array, 'b', 'b2', true)).toBe(-1);
});

test('sort by date works', () => {
    expect(AbmArrays.sort(dateArray, 'date')[0].date).toBe('2021-10-01');
});

test('chunk works', () => {
    expect(AbmArrays.chunk(numberArray, 3).length).toBe(4);
    expect(() => AbmArrays.chunk(numberArray, 0)).toThrow();
});
