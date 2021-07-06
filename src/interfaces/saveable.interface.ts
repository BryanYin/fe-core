
/**
 * 可与 string 互转的类。这里用 toSaveString() 与 toString() 区别。
 */
export interface IAbmStringSavable<T> {
    key: string;

    toSaveString(): string;

    parseFromString(data: string): T;
}
