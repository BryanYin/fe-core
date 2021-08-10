import { AbmUtil } from "../abm-util";

test('Util object copy should work for object', () => {
    const obj = { a: 1, b: 'test', c: [1, 2] };
    expect(AbmUtil.deepCopy(obj)).toStrictEqual(obj);
});

test('Util object copy should work for array', () => {
    const obj = [1, 2];
    expect(AbmUtil.deepCopy(obj)).toStrictEqual(obj);
});

test('Util object copy should work for array of objects', () => {
    const obj = [{ a: 1 }, { b: 'bstring' }, { c: [1, 2] }];
    expect(AbmUtil.deepCopy(obj)).toStrictEqual(obj);
});
