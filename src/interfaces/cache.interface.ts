/**
 * 可缓存接口。
 */
export interface IAbmCacheable<K, T> {
    expireAfterWrite: number;

    get(key: K): T | null;

    set(key: K, value: T): T | null;
}

/**
 * 刷新缓存的方法类型。
 */
export type CacheRefresher<K, T> = (key: K) => T;

/**
 * 可刷新的缓存接口。
 */
export interface IAbmRefreshCacheable<K, T> extends IAbmCacheable<K, T> {
    refreshAfterWrite: number;

    setRefresher(key: K, refresher: CacheRefresher<K, T>): void;

    refresh(key: K): T | null;

    refreshAll(): void;

    autoRefresh(): void;

    stopAutoRefresh(): void;
}
