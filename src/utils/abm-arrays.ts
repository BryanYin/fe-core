import { AbmObjectType } from "../global/types";
import { AbmCommonPrimitives, AbmUtil } from "./abm-util";

/**
 * Array utilities.
 */
export class AbmArrays {
    public static find<T extends AbmObjectType<T>>(array: T[], field: keyof T, value: AbmCommonPrimitives, contain = false): T | undefined {

        const index = this.indexOf(array, field, value, contain);

        return index >= 0 ? array[index] : undefined;
    }

    public static include<T extends AbmObjectType<T>>(array: T[], field: keyof T, value: AbmCommonPrimitives, contain = false): boolean {
        const index = this.indexOf(array, field, value, contain);

        return index >= 0;
    }

    public static indexOf<T extends AbmObjectType<T>>(array: T[], field: keyof T, value: AbmCommonPrimitives, contain = false): number {
        if (array?.length === 0) {
            return -1;
        }

        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (element[field] === value) {
                return i;
            }

            if (contain && typeof element[field] === 'string' && (element[field] as string).includes(value.toString())) {
                return i;
            }
        }
        return -1;
    }

    public static findFirstMatch<T extends AbmObjectType<T>>(array: T[], fieldPath: string, matches: string | string[]): T | undefined {
        if (!(array?.length > 0)) {
            return undefined;
        }

        let what: string[];
        if (typeof matches === 'string') {
            what = [matches];
        } else {
            what = matches;
        }

        for (const one of array) {
            if (what.includes(AbmUtil.deepValue(one, fieldPath) as string)) {
                return one;
            }
        }
        return undefined;
    }

    public static sort<T extends AbmObjectType<T>>(array: T[], sortBy?: (keyof T) | (keyof T)[], desc = false): T[] {
        if (!array || array.length === 0) {
            return array;
        }

        return array.sort((a, b) => {
            if (a === null || a === undefined) {
                return b === null || b === undefined ? 0 : (desc ? -1 : 1);
            }

            if (sortBy === undefined &&
                (typeof a === 'string' || typeof a === 'number') &&
                (typeof b === 'string' || typeof b === 'number')) {
                return AbmUtil.compare(a, b);
            }

            let result = 0;
            let fields: (keyof T)[];
            if (typeof sortBy === 'string') {
                fields = [sortBy];
            } else {
                fields = sortBy as (keyof T)[];
            }
            for (const f of fields) {
                result = AbmUtil.compare(a[f] as any, b[f] as any);
                if (result !== 0) {
                    return desc ? -result : result;
                }
            }
            return result;
        });
    }

    public static create<T>(length?: number, fill?: T): T[] {
        let ret: T[];
        if (length === undefined) {
            ret = [];
        } else {
            ret = new Array(length);
        }

        if (fill) {
            ret.fill(fill);
        }

        return ret;
    }

    public static remove<T extends AbmObjectType<T>>(array: T[], field: keyof T, value: AbmCommonPrimitives, contain = false): T[] {
        const ret = array.filter(a => {
            return contain ? !(a[field] as string).includes(value.toString()) : a[field] !== value;
        });
        return ret;
    }

    public static replace<T extends AbmObjectType<T>>(array: T[], newItem: T, field: keyof T, key: AbmCommonPrimitives): T[] | undefined {
        const i = this.indexOf(array, field, key);
        if (i >= 0) {
            return array.splice(i, 1, newItem);
        } else {
            return undefined;
        }

    }

    public static loopGetAtIndex<T>(array: T[], idx: number): T {
        return array[idx % array.length];
    }

}
