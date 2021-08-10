/* eslint-disable prefer-rest-params */
import { interval, Subscription } from 'rxjs';
import { AbmTable } from '../classes/abm-table';

export interface AbmRefresher {
    sub$: Subscription | undefined;
    freq: number;
}

export class AbmRefreshStore {

    public static table: AbmTable<string, string, AbmRefresher> = new AbmTable();

    public static getMethodSub(cls: string, mtd: string): AbmRefresher | undefined {
        const ref = AbmRefreshStore.table.get(cls, mtd);
        return ref;
    }

    public static getClassSubs(cls: string): AbmRefresher[] | undefined {
        const row = AbmRefreshStore.table.getRow(cls);
        if (!row) {
            return undefined;
        }
        return Array.from(row.values());
    }

    public static setMethodSub(cls: string, mtd: string, ref: AbmRefresher): void {
        const existRef = AbmRefreshStore.getMethodSub(cls, mtd);
        if (existRef?.sub$) {
            existRef.sub$.unsubscribe();
        }
        AbmRefreshStore.table.set(cls, mtd, ref);
    }
}

export type AbmTypedPropertyDesc = TypedPropertyDescriptor<(...args: any[]) => any>;

/**
 * Method decorator, mark the method to be called periodically.
 * @param freq refresh frequency, seconds
 */
export function AbmStartRefresh(freq = 30) {
    return function (_target: any, propertyKey: string, descriptor: AbmTypedPropertyDesc): AbmTypedPropertyDesc {
        const originalMethod = descriptor.value;

        descriptor.value = function () {
            const result = originalMethod?.apply(this, arguments as any);

            freq = freq > 0 ? freq : 0;
            if (freq === 0) {
                return result;
            }
            const cls = this.constructor.name;
            const ref: AbmRefresher = { sub$: undefined, freq };

            if (typeof (this as any)[propertyKey] === 'function') {
                ref.sub$ = interval(ref.freq * 1000).subscribe(() => {
                    (this as any)[propertyKey]();
                });

                AbmRefreshStore.setMethodSub(cls, propertyKey, ref);
            }
            return result;
        };

        return descriptor;
    };
}


/**
 * method decorator, using this decorator to clear Subscriptions.
 */
export function AbmStopRefresh(_target: any, _propertyKey: string, descriptor: AbmTypedPropertyDesc): AbmTypedPropertyDesc {
    const originalMethod = descriptor.value;

    descriptor.value = function () {
        const result = originalMethod?.apply(this, arguments as any);
        const cls = this.constructor.name;

        const refs = AbmRefreshStore.getClassSubs(cls);

        refs?.forEach(r => {
            r.sub$?.unsubscribe();
            r.sub$ = undefined;
        });

        return result;
    };

    return descriptor;
}


