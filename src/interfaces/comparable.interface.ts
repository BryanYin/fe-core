export interface IAbmComparable<T> {
    equals(other: T): boolean;

    greaterThan?(other: T): boolean;

    lessThan?(other: T): boolean;
}
