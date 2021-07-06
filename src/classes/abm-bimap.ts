/**
 * 双向 map
 */
export class AbmBiMap<K, V>{
    private kv: Map<K, V> = new Map();
    private vk: Map<V, K> = new Map();

    get size(): number {
        return this.kv.size;
    }

    public getWrappedKV(): Map<K, V> {
        return this.kv;
    }

    public getWrappedVK(): Map<V, K> {
        return this.vk;
    }

    /**
     * 设置 key-value，返回旧值
     * @param key key
     * @param value value
     */
    public set(key: K, value: V): V | undefined {

        const oldValue = this.kv.get(key);

        this.kv.set(key, value);
        this.vk.set(value, key);
        return oldValue;
    }

    /**
     * 由 key 获取值。
     * @param key key
     */
    public getFromKey(key: K): V | undefined {
        return this.kv.get(key);
    }

    /**
     * 由 value 获取值。
     * @param val value
     */
    public getFromValue(val: V): K | undefined {
        return this.vk.get(val);
    }

    /**
     * 获取所有 key
     */
    public keys(): IterableIterator<K> {
        return this.kv.keys();
    }

    /**
     * 获取所有 value
     */
    public values(): IterableIterator<V> {
        return this.kv.values();
    }

    /**
     * key 是否包含某元素
     * @param key key
     * @returns key 是否包含
     */
    public keysContains(key: K): boolean {
        return this.kv.has(key);
    }

    /**
     * value 是否包含某元素
     * @param value value
     * @returns value 是否包含
     */
    public valuesContains(value: V): boolean {
        return this.vk.has(value);
    }

    /**
     * 是否空
     */
    public isEmpty(): boolean {
        return this.kv.size === 0;
    }

    /**
     * 返回 key-value 键值对
     */
    public kvEntries(): [K, V][] {
        return Array.from(this.kv.entries());
    }

    /**
     * 返回 value-key 键值对
     */
    public vkEntries(): [V, K][] {
        return Array.from(this.vk.entries());
    }

    /**
     * 以 key 为关键字删除
     * @param key key
     */
    public deleteFromKey(key: K): boolean {
        const value = this.kv.get(key);
        let success = this.kv.delete(key);
        if (value) {
            success = this.vk.delete(value);
        }
        return success;
    }

    /**
     * 以 value 为关键字删除
     * @param val value
     */
    public deleteFromValue(val: V): boolean {
        const key = this.vk.get(val);
        let success = this.vk.delete(val);
        if (key) {
            success = this.kv.delete(key);
        }
        return success;
    }
}
