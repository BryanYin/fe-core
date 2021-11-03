import { AbmMethodCache, AbmRefreshCache } from './abm-cache';
import { AbmMap } from './abm-map';

export class AbmStaticMethodCache {
    private static methodMap: AbmMap<string, AbmMethodCache>;
    public static cache: AbmRefreshCache<string, unknown>;

    public static init(expire: number): void {
        AbmStaticMethodCache.methodMap = new AbmMap();
        AbmStaticMethodCache.cache = new AbmRefreshCache(expire);
    }

    public static set(key: string, value: unknown, method?: AbmMethodCache): void {
        AbmStaticMethodCache.cache.set(key, value);

        if (method) {
            AbmStaticMethodCache.methodMap.set(key, method);
            AbmStaticMethodCache.cache.setRefresher(key, () => {
                return method.originalMethod.apply(method.thisPtr, method.args);
            });
        }
    }

    public static get(key: string): unknown {
        return AbmStaticMethodCache.cache.get(key);
    }

}

