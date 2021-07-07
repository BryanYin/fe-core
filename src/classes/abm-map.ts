/**
 * Extends JS origin Map. Providing:
 *
 * getOrDefault - get value, if not exists then use default value.
 *
 * getOrDefaultThenSetDefault - get value, if not exists then use default value and set default value for the key
 */
export class AbmMap<K, V> extends Map<K, V>{
  /**
   * Get value, if not exists then use default value.
   * @param key key
   * @param dValue default value if key not exists
   * @returns the value in map or default value provided
   */
  public getOrDefault(key: K, dValue: V): V {
    const value = this.get(key);

    if (value === null || value === undefined) {
      return dValue;
    } else {
      return value;
    }
  }

  /**
   * Get value, if not exists then use default value and set default value for the key
   * @param key key
   * @param dValue default value if key not exists
   * @returns he value in map or default value provided
   */
  public getOrDefaultThenSetDefault(key: K, dValue: V): V {
    const value = this.get(key);

    if (value === null || value === undefined) {
      this.set(key, dValue);
      return dValue;
    } else {
      return value;
    }
  }
}
