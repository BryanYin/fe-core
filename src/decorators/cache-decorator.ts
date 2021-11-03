import { AbmMethodCache } from '../classes/abm-cache';
import { AbmStaticMethodCache } from '../classes/abm-method-cache';

/**
 * 方法缓存装饰器。标注在方法上。则方法结果会被缓存。
 */
export function AbmCacheable(_target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function () {

        // eslint-disable-next-line prefer-rest-params
        const methodCache = new AbmMethodCache(propertyKey, originalMethod, this, arguments);
        const key = methodCache.toString();
        const ret = AbmStaticMethodCache.get(key);

        if (ret) {
            return ret;
        } else {
            // eslint-disable-next-line prefer-rest-params
            const value = originalMethod.apply(this, arguments);
            AbmStaticMethodCache.set(key, value, methodCache);
            return value;
        }
    };

    return descriptor;
}
