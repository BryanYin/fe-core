import { IAbmClassToInterface } from '../interfaces/class-to-interface.interface';

/**
 * NameValue，比较重要的一个类，存储单一的 key-value 类型。
 *
 * 提供 toInterface() 方法转换为 接口。在 ECharts 中使用必须转换。
 */
export class AbmNameValue<T> implements IAbmClassToInterface<AbmNameValue<T>> {
    public name: string;
    public value: T | undefined;

    constructor(name?: string, value?: T) {
        this.name = name ?? '';
        this.value = value ?? undefined;
    }


    toInterface(): { name: string; value: T | undefined; } {
        return { name: this.name, value: this.value };
    }

    fromInterface(data: { name: string; value: T | undefined; }): AbmNameValue<T> {
        for (const property of ['name', 'value']) {
            if (property && !Object.prototype.hasOwnProperty.call(data, property)) {
                throw new Error('data does not have property: ' + property);
            }
        }
        return new AbmNameValue(data.name, data.value);
    }
}
