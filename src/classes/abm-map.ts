/**
 * 扩展 Map。提供下列方法：
 *
 * getOrDefault - 获取值，如不存在，则使用默认值。
 *
 * getOrDefaultThenPutDefault - 获取值，如不存在，则使用默认值，并将默认值设置为 key 的值。
 */
export class AbmMap<K, V> extends Map<K, V>{
  public getOrDefault(key: K, dValue: V): V {
    const value = this.get(key);

    if (value === null || value === undefined) {
      return dValue;
    } else {
      return value;
    }
  }

  public getOrDefaultThenPutDefault(key: K, dValue: V): V {
    const value = this.get(key);

    if (value === null || value === undefined) {
      this.set(key, dValue);
      return dValue;
    } else {
      return value;
    }
  }
}
