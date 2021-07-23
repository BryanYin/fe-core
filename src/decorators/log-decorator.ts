import { AbmLogger } from '../utils/abm-logger';

/**
 * 方法计时装饰器。标注于方法，则可在 console 打印方法执行时间。
 */
export function AbmTimer(_target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function () {
        AbmLogger.timeStart(propertyKey);
        // eslint-disable-next-line prefer-rest-params
        const value = originalMethod.apply(this, arguments);
        AbmLogger.timeEnd(propertyKey);
        return value;
    };

    return descriptor;
}
