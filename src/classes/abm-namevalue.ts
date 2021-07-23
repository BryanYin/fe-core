import { IAbmClassToInterface } from '../interfaces/class-to-interface.interface';

export type AbmNameValueInterface<T> = Pick<AbmNameValue<T>, 'name' | 'value'>;

/**
 * Store a single name-value pair.
 *
 * Providing `toInterface()` method that could transfer a class object to plain interface object.
 */
export class AbmNameValue<T> implements IAbmClassToInterface<AbmNameValue<T>, AbmNameValueInterface<T>> {
    [name: string]: unknown;

    public name: string;
    public value: T | undefined;

    constructor(name?: string, value?: T) {
        this.name = name ?? '';
        this.value = value ?? undefined;
    }

    toInterface(): AbmNameValueInterface<T> {
        return { name: this.name, value: this.value };
    }

    fromInterface(data: AbmNameValueInterface<T>): AbmNameValue<T> {
        return new AbmNameValue(data.name, data.value);
    }
}

