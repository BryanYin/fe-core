/**
 *  Bi-map constucted by a K,V map and a V,K map, providing a two-way visit into map.
 */
export class AbmBiMap<K, V>{
    private kv: Map<K, V> = new Map();
    private vk: Map<V, K> = new Map();

    get size(): number {
        return this.kv.size;
    }

    /**
     * Get the wrapped K,V map
     * @returns the wrapped K,V map
     */
    public getWrappedKV(): Map<K, V> {
        return this.kv;
    }

    /**
     * Get the wrapped V,K map
     * @returns the wrapped V,K map
     */
    public getWrappedVK(): Map<V, K> {
        return this.vk;
    }

    /**
     * set key and value
     * @param key key
     * @param value new value
     * @returns the old value or undefined
     */
    public set(key: K, value: V): V | undefined {

        const oldValue = this.kv.get(key);

        this.kv.set(key, value);
        this.vk.set(value, key);
        return oldValue;
    }

    /**
     * Use key to get value.
     * @param key key
     * @returns the value or undefined if key does not exists.
     */
    public getFromKey(key: K): V | undefined {
        return this.kv.get(key);
    }

    /**
     * Use value to get key.
     * @param value value
     * @returns the key undefined if value does not exists.
     */
    public getFromValue(value: V): K | undefined {
        return this.vk.get(value);
    }

    /**
     * Get all keys.
     * @returns an iterable of keys 
     */
    public keys(): IterableIterator<K> {
        return this.kv.keys();
    }

    /**
     * Get all values.
     * @returns an iterable of values 
     */
    public values(): IterableIterator<V> {
        return this.kv.values();
    }

    /**
     * If map has the key.
     * @param key key
     * @returns true/false
     */
    public keysContains(key: K): boolean {
        return this.kv.has(key);
    }

    /**
     * If map has the value.
     * @param value value
     * @returns true/false
     */
    public valuesContains(value: V): boolean {
        return this.vk.has(value);
    }

    /**
     * if the map is empty.
     */
    public isEmpty(): boolean {
        return this.kv.size === 0;
    }

    /**
     * Get key-value array.
     */
    public kvEntries(): Array<[K, V]> {
        return Array.from(this.kv.entries());
    }

    /**
     * Get value-key array.
     */
    public vkEntries(): Array<[V, K]> {
        return Array.from(this.vk.entries());
    }

    /**
     * delete by key
     * @param key key
     * @returns true - success, false - failed
     */
    public deleteFromKey(key: K): boolean {
        const value = this.kv.get(key);
        let success = this.kv.delete(key);
        if (value !== null && value !== undefined) {
            success = this.vk.delete(value);
        }
        return success;
    }

    /**
     * delete by value.
     * @param val value
     * @returns true - success, false - failed
     */
    public deleteFromValue(val: V): boolean {
        const key = this.vk.get(val);
        let success = this.vk.delete(val);
        if (key !== null && key !== undefined) {
            success = this.kv.delete(key);
        }
        return success;
    }

    /**
     * Get value by key, if not exists then use default value.
     * @param key key
     * @param dValue default value if key not exists
     * @returns the value in map or default value provided
     */
    public getFromKeyOrDefault(key: K, dValue: V): V {
        const value = this.kv.get(key);

        if (value === null || value === undefined) {
            return dValue;
        } else {
            return value;
        }
    }

    /**
     * Get key by value, if not exists then use default key.
     * @param value value
     * @param dKey default key if value not exists
     * @returns the key in map or default key provided
     */
    public getFromValueOrDefault(value: V, dKey: K): K {
        const key = this.vk.get(value);

        if (key === null || key === undefined) {
            return dKey;
        } else {
            return key;
        }
    }

    /**
     * Get value, if not exists then use default value and set default value for the key
     * @param key key
     * @param dValue default value if key not exists
     * @returns the value in map or default value provided
     */
    public getFromKeyOrDefaultThenSetDefault(key: K, dValue: V): V {
        const value = this.kv.get(key);

        if (value === null || value === undefined) {
            this.kv.set(key, dValue);
            return dValue;
        } else {
            return value;
        }
    }

    /**
     * Get key, if not exists then use default key and set default key for the value
     * @param value value
     * @param dKey default key if value not exists
     * @returns the key in map or default key provided
     */
    public getFromValueOrDefaultThenSetDefault(value: V, dKey: K): K {
        const key = this.vk.get(value);

        if (key === null || key === undefined) {
            this.vk.set(value, dKey);
            return dKey;
        } else {
            return key;
        }
    }

}
