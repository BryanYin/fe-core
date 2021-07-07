
/**
 * Class could be transferred to an interface.
 * Used when interface and class have different fields or some fields need manual transfer.
 * T - interface type
 */
export interface IAbmClassToInterface<C, I> {
    toInterface(): I;

    fromInterface(data: I): C;
}
