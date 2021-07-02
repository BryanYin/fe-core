import { interval, Subscription } from 'rxjs';
import { CacheRefresher, IAbmCacheable, IAbmRefreshCacheable } from '../interfaces/cache.interface';
import { AbmUtil } from '../utils/abm-util';
import { AbmMap } from './abm-map';

/**
 * 缓存。以 Map 存储。虽然有过期时间，但是不会刷新。
 */
export class AbmCache<K, T> implements IAbmCacheable<K, T> {
    protected cache: AbmMap<K, { expire: number, value: T }> = new AbmMap();

    constructor(
        /**
         * 写入后过期时间，秒。0 表示不过期。
         */
        public expireAfterWrite: number
    ) {
        AbmUtil.assert(expireAfterWrite >= 0, 'expireAfterWrite should be >=0, 0 means never expire');
    }

    /**
     * 获取缓存。同时会用当前时间判断缓存是否过期，如未过期则返回 value，否则返回 null
     * @param key key
     */
    get(key: K): T | null {
        const expValue = this.cache.get(key);

        if (!expValue) {
            return null;
        }

        if (expValue.expire !== 0 && new Date().getTime() > expValue.expire) {
            return null;
        }

        return expValue.value;

    }

    /**
     * 设置缓存内容。用当前缓存配置的过期时长计算该值的过期时间。
     * @param key key
     * @param value value
     */
    set(key: K, value: T): T | null {
        const oldVal = this.get(key);

        this.cache.set(key,
            {
                expire: this.expireAfterWrite > 0 ? (new Date().getTime() + this.expireAfterWrite * 1000) : this.expireAfterWrite,
                value
            });

        return oldVal;
    }
}

/**
 * 可刷新缓存。
 */
export class AbmRefreshCache<K, T> extends AbmCache<K, T> implements IAbmRefreshCacheable<K, T>{

    protected cacheMethod: AbmMap<K, CacheRefresher<K, T>> = new AbmMap();

    public autoRefreshInt = 0;

    protected autoRefresher$: Subscription | null = null;

    constructor(
        public refreshAfterWrite: number,
    ) {
        super(refreshAfterWrite);
        this.autoRefresh();
    }

    /**
     * 为键值设置刷新方法。
     * @param key key
     * @param refresher 刷新键值的方法
     */
    setRefresher(key: K, refresher: CacheRefresher<K, T>): void {
        this.cacheMethod.set(key, refresher);
    }

    /**
     * 设置值的同时也设置其刷新方法
     * @param key key
     * @param value value
     * @param refresher 刷新键值的方法
     */
    setWithRefresher(key: K, value: T, refresher: CacheRefresher<K, T>): T | null {
        this.setRefresher(key, refresher);
        return this.set(key, value);
    }

    /**
     * 获取缓存。如果缓存已过期，则先返回过期内容，再异步刷新缓存。
     * @param key key
     */
    get(key: K): T | null {
        const expValue = this.cache.get(key);

        if (!expValue) {
            return null;
        }

        if (expValue.expire !== 0 && new Date().getTime() > expValue.expire) {
            const oldVal = expValue.value;

            setTimeout(() => {
                this.refresh(key);
            });

            return oldVal;
        }

        return expValue.value;

    }

    /**
     * 刷新键值的缓存。如果刷新方法未定义，则 throw error
     * @param key key
     */
    refresh(key: K): T | null {
        const refresher = this.cacheMethod.get(key);

        if (refresher) {
            const val = refresher(key);
            return this.set(key, val);
        } else {
            throw new Error('refresh method not set for key:' + key);
        }
    }

    /**
     * 刷新所有的缓存。
     */
    refreshAll(): void {
        this.cacheMethod.forEach((_v, k) => {
            this.refresh(k);
        });
    }

    /**
     * 自动刷新
     */
    autoRefresh(): void {
        if (this.autoRefreshInt > 0) {
            this.autoRefresher$ = interval(this.autoRefreshInt).subscribe(() => {
                this.refreshAll();
            });
        }
    }

    /**
     * 停止自动刷新
     */
    stopAutoRefresh(): void {
        if (this.autoRefresher$) {
            this.autoRefresher$.unsubscribe();
            this.autoRefresher$ = null;
        }
    }

}

/**
 * 方法缓存。用来缓存方法执行的结果。
 */
export class AbmMethodCache {
    constructor(
        /**
         * 方法名称
         */
        public methodName: string,
        /**
         * 方法
         */
        public originalMethod: any,
        /**
         * this 指针。用来执行方法。
         */
        public thisPtr: any,
        /**
         * 执行参数
         */
        public args: IArguments,
    ) { }

    /**
     * 包含 this 类名、方法名、方法参数的 string
     */
    toString(): string {
        const argArray = [];
        for (const element of this.args) {
            argArray.push(element);
        }

        const argStr = argArray.length > 0 ? argArray.map(a => a.toString()).join(',') : 'noarg';

        return [this.thisPtr.constructor.name, this.methodName, argStr].join('#');
    }
}
