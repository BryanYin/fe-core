/**
 * 表格形式的存储，即 Map<R, Map<C,V>>。 提供方便的访问接口。
 */
export class AbmTable<R, C, V>{
    private table: Map<R, Map<C, V>> = new Map();

    public getWrappedMap(): Map<R, Map<C, V>> {
        return this.table;
    }

    /**
     * 设置某行某列的值。
     * @param row 行
     * @param column 列
     * @param value 值
     */
    public set(row: R, column: C, value: V): V | undefined {
        const oldRow = this.table.get(row);
        let oldValue: V | undefined;
        if (oldRow) {
            oldValue = oldRow.get(column);
            oldRow.set(column, value);
        } else {
            const newRow: Map<C, V> = new Map();
            newRow.set(column, value);
            this.table.set(row, newRow);
        }
        return oldValue;
    }

    public get(row: R, column: C): V | undefined {
        const dataRow = this.table.get(row);
        if (dataRow) {
            return dataRow.get(column);
        } else {
            return undefined;
        }
    }

    public setRow(row: R, columns: Map<C, V>): Map<C, V> | undefined {
        const oldRow = this.table.get(row);
        this.table.set(row, columns);
        return oldRow;
    }

    public getRow(row: R): Map<C, V> | undefined {
        return this.table.get(row);
    }

    public rowKeys(): R[] {
        return Array.from(this.table.keys());
    }

    public values(): V[] {
        const values: V[] = [];
        this.table.forEach(value => { value.forEach(v => values.push(v)); });
        return values;
    }
}
