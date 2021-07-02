
/**
 * 可转换为接口。
 */
export interface IAbmMapToInterface<T> {
    toInterface(): any;

    fromInterface(data: any): T;
}
