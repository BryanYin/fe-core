/* eslint-disable prefer-rest-params */
import { interval, Subscription } from 'rxjs';

/**
 * 带有刷新数据类的接口。包含三个属性：
 *
 * refresherSub - Subscription，用来做 interval subscribe 和 unsubscribe。
 *
 * refresherInt - number， 刷新频率（秒）
 *
 * refreshMethod - string，刷新方法名。
 */
export interface AbmHasRefresher {
    [name: string]: any;
    refreshSub: Subscription | undefined;
    refreshInt: number;
    refreshMethod: string;
}

export interface AbmRefreshOptions {
    method?: string;
    interval?: number;
}

/**
 * 类装饰器。可定时刷新数据的类。
 * @param refreshMethod 刷新数据的方法名，要求方法是 ()=>void 类型。因为在刷新的周期调用中，不会使用参数和返回任何参数。默认 loadData()
 * @param refreshInterval 刷新频率（秒），如果参数不传递，默认 60 秒。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AbmRefresher<T extends { new(...args: any[]): any; }>(options?: AbmRefreshOptions) {
    return (constructor: T): T => {
        const refreshInt = options?.interval && options.interval > 0 ? options?.interval : 60;

        return class extends constructor implements AbmHasRefresher {
            public refreshInt = refreshInt;
            public refreshSub = undefined;
            public refreshMethod = options?.method ?? 'loadData';
        };
    };
}

export type AbmTypedPropertyDesc = TypedPropertyDescriptor<(...args: any[]) => any>;

/**
 * 方法装饰器。开始定时刷新数据。一般用在 ngOnInit()
 */
export function AbmStartRefresh(_target: any, _propertyKey: string, descriptor: AbmTypedPropertyDesc): AbmTypedPropertyDesc {
    const originalMethod = descriptor.value;

    descriptor.value = function () {
        const result = originalMethod?.apply(this, arguments as any);
        const thisAlias = this as AbmHasRefresher;
        if (thisAlias.refreshInt && thisAlias.refreshInt > 0 && typeof thisAlias[thisAlias.refreshMethod] === 'function') {
            thisAlias.refreshSub = interval(thisAlias.refreshInt * 1000).subscribe(() => {
                thisAlias[thisAlias.refreshMethod]();
            });
        }
        return result;
    };

    return descriptor;
}


/**
 * 方法装饰器。停止定时刷新数据。一般用在 ngOnDestroy()
 */
export function AbmStopRefresh(_target: any, _propertyKey: string, descriptor: AbmTypedPropertyDesc): AbmTypedPropertyDesc {
    const originalMethod = descriptor.value;

    descriptor.value = function () {
        const result = originalMethod?.apply(this, arguments as any);
        const thisAlias = this as AbmHasRefresher;
        if (thisAlias.refreshSub) {
            thisAlias.refreshSub.unsubscribe();
            thisAlias.refreshSub = undefined;
        }

        return result;
    };

    return descriptor;
}


