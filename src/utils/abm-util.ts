import { Subscription } from 'rxjs';
import { AbmNameValue } from '../classes/abm-namevalue';

export type AbmCommonPrimitives = string | number | boolean;

export const quarterMap = ['', '一', '二', '三', '四'];

export const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const DAYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
export const HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

export const SCALE_POS = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000, 1_000_000_000];
export const SCALE_NEG = [0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001, 0.0000001, 0.00000001, 0.000000001, 0.0000000001];

export class AbmUtil {

    public static deepCopy(obj: any): unknown {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }

        if (obj instanceof Array) {
            return obj.reduce((arr, item, i) => {
                arr[i] = AbmUtil.deepCopy(item);
                return arr;
            }, []);
        }

        if (obj instanceof Object) {
            return Object.keys(obj).reduce((newObj: any, key) => {
                newObj[key] = AbmUtil.deepCopy(obj[key]);
                return newObj;
            }, {})
        }

        return obj;
    }

    /**
     * compare 2 number
     *
     * return:
     * -1: op1 < op2
     *  1: op1 > op2
     *
     * @param op1 op1
     * @param op2 op2
     */
    public static compare(op1: number, op2: number): number;
    /**
     * compare 2 string
     *
     * return:
     * -1: op1 < op2
     *  1: op1 > op2
     *
     * @param op1 op1
     * @param op2 op2
     */
    public static compare(op1: string, op2: string): number;
    public static compare(op1: any, op2: any): number {

        if (typeof op1 === 'number') {
            return op1 - op2;
        }

        const str1 = op1.toString();
        const str2 = op2.toString();
        if (str1.length !== str2.length) {
            return str1.length < str2.length ? -1 : 1;
        }
        return str1.localeCompare(str2);
    }

    public static getPropertyOrDefault<T extends Record<string, unknown>>(obj: T, property: string, defaultVal?: unknown): unknown {
        if (Object.prototype.hasOwnProperty.call(obj, property)) {
            return obj[property] as T;
        } else if (defaultVal) {
            return defaultVal as T;
        } else {
            return undefined;
        }
    }

    public static checkProperties(data: unknown, ...properties: string[]): void {
        for (const property of properties) {
            if (property && !Object.prototype.hasOwnProperty.call(data, property)) {
                throw new Error(property + ' is not property of data');
            }
        }
    }

    public static getFileNameFromUrl(url: string): string | undefined {
        return url.split('/').pop()?.split('#')[0].split('?')[0];
    }

    public static bodyToParamStr(body: Record<string, AbmCommonPrimitives>): string {
        let ret = '?';
        for (const k in body) {
            const value = body[k];
            if (ret === '?') {
                ret = ret + k + '=' + value.toString();
            } else {
                ret = ret + '&' + k + '=' + value.toString();
            }
        }
        return ret;
    }

    public static hourStr(i: number): string {
        const j = Math.round(i);
        return (j + 100).toString().substr(1) + ':00';
    }

    public static quarterStr(i: number): string {
        this.assert(i >= 1 && i <= 4, 'Quarter index out of bounds:' + i);

        return quarterMap[i] + '季度';
    }

    public static sleep(ms: number): Promise<unknown> {
        const ret = new Promise(resolve => setTimeout(resolve, ms));
        return ret;
    }

    public static dateAdd(days: number, target?: Date): Date {

        const from = target ? new Date(target) : new Date();

        if (days === 0) {
            return from;
        }

        return new Date(from.setDate(from.getDate() + days));
    }

    /**
     * Transfer {key1:[v1,v2],key2:[v3,v4]} -> [{key1:v1,key2:v3},{key1:v2,key2:v4}]
     */
    public static zipData(obj: { [key: string]: unknown[] }): { [key: string]: unknown }[] {
        const ret: { [key: string]: unknown }[] = [];
        for (const k in obj) {
            const arr = obj[k];
            for (let i = 0; i < arr.length; i++) {
                const each = arr[i];
                if (ret[i]) {
                    ret[i][k] = each;
                } else {
                    const yo: { [key: string]: unknown } = {};
                    yo[k] = each;
                    ret.push(yo);
                }
            }
        }
        return ret;
    }

    /**
     * Transfer [{key1:v1,key2:v3},{key1:v2,key2:v4}] -> {key1:[v1,v2],key2:[v3,v4]}
     */
    public static unzipData(obj: { [key: string]: unknown }[]): { [key: string]: unknown[] } {
        const ret: { [key: string]: unknown[] } = {};

        for (const o of obj) {
            for (const k in o) {
                if (Object.prototype.hasOwnProperty.call(ret, k)) {
                    ret[k].push(o[k]);
                } else {
                    ret[k] = [o[k]];
                }

            }
        }
        return ret;
    }

    /**
     * get keys and values from an object.
     *
     * @param obj the object to be transferred
     */
    public static keysAndValues(obj: { [key: string]: unknown }): { keys: string[], values: unknown[] } {
        const keys = new Array<string>();
        const values = new Array<unknown>();
        for (const key in obj) {
            keys.push(key);
            values.push(obj[key]);
        }
        return { keys, values };
    }

    public static maxMinAvg(data: number[], decimal = 0): { max: number, min: number, avg: number } {
        if (data.length === 0) {
            return { max: 0, min: 0, avg: 0 };
        }

        const max = Math.max(...data) || 0;
        const min = Math.min(...data) || 0;
        const avg = (data.reduce((a, b) => a + b, 0)) / data.length || 0;
        return { max, min, avg: +(avg.toFixed(decimal)) };
    }


    public static hexToRgb(hex: string, alpha?: number): { r: number, g: number, b: number, str: string } | undefined {
        const rgb: number[] | undefined = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)?.map(x => parseInt(x, 16));

        if (rgb) {
            const rgbObj: ReturnType<typeof AbmUtil.hexToRgb> = { r: rgb[0], g: rgb[1], b: rgb[2], str: '' };

            rgbObj.str = alpha && alpha >= 0 ? ('rgba(' + rgbObj.r + ',' + rgbObj.g + ',' + rgbObj.b + ',' + alpha + ')') :
                ('rgb(' + rgbObj.r + ',' + rgbObj.g + ',' + rgbObj.b + ')');

            return rgbObj;

        }
        return undefined;
    }

    public static echartSize(size = 16): number {
        const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        return clientWidth ? size * (clientWidth / 1920) : size;
    }

    public static formPath(...paths: string[]): string {
        let url = '';
        for (let i = 0; i < paths.length - 1; i++) {
            url += (paths[i].endsWith('/') ? paths[i] : (paths[i] + '/'));
        }

        return url + paths[paths.length - 1];
    }

    public static assert(condition: unknown, msg?: string): asserts condition {
        if (!condition) {
            throw new Error(msg ?? 'AbmUtil.assert fails!');
        }
    }

    public static enUnitScale(num: number, basicTitle = ''): { name: string, value: number | undefined, scale: number } {
        let scaled: AbmNameValue<number>;
        let scale = 1;
        if (num < 1000) {
            scaled = new AbmNameValue('', num);
        } else if (num < 1000_000) {
            scale = 1_000;
            scaled = new AbmNameValue('k', num / scale);
        } else if (num < 1000_000_000) {
            scale = 1_000_000;
            scaled = new AbmNameValue('M', num / scale);
        } else if (num < 1000_000_000_000) {
            scale = 1_000_000_000;
            scaled = new AbmNameValue('Mk', num / scale);
        } else {
            scale = 1_000_000_000_000;
            scaled = new AbmNameValue('MM', num / scale);
        }

        scaled.name = (scaled.name + basicTitle).replace('kk', 'M');

        return { ...scaled.toInterface(), scale: scale };
    }

    public static cnUnitScale(num: number, basicTitle = ''): { name: string, value: number | undefined, scale: number } {
        let scaled: AbmNameValue<number>;
        let scale = 1;
        if (num < 1_0000) {
            scaled = new AbmNameValue('', num);
        } else if (num < 10_0000) {
            scale = 1_0000;
            scaled = new AbmNameValue('万', num / scale);
        } else if (num < 1000_0000) {
            scale = 100_0000;
            scaled = new AbmNameValue('百万', num / scale);
        } else if (num < 1_0000_0000) {
            scale = 1000_0000;
            scaled = new AbmNameValue('千万', num / scale);
        } else {
            scale = 1_0000_0000;
            scaled = new AbmNameValue('亿', num / scale);
        }

        scaled.name = (scaled.name + basicTitle);

        return { ...scaled.toInterface(), scale: scale };
    }

    private static _getScale(num: number, basicTitle = '', language: 'en' | 'cn' = 'en'): { name: string, value: number | undefined, scale: number } {
        let res: { name: string, value: number | undefined, scale: number };

        if (language === 'en') {
            res = AbmUtil.enUnitScale(num, basicTitle);
        } else {
            res = AbmUtil.cnUnitScale(num, basicTitle);
        }
        return res;
    }

    public static transferUnitForMultiArray(nums: number[][], basicTitle = '', language: 'en' | 'cn' = 'en'): { name: string, nums: number[][] } {
        const omitZeros = nums.map(ns => ns.filter(n => n > 0));
        const min = Math.min(...omitZeros.map(ns => Math.min(...ns)));

        const res = AbmUtil._getScale(min, basicTitle, language);

        return { name: res.name, nums: nums.map(ns => ns.map(n => Math.round(n / res.scale))) };
    }

    public static transferUnitForArray(nums: number[], basicTitle = '', language: 'en' | 'cn' = 'en'): { name: string, nums: number[] } {
        const omitZeros = nums.filter(n => n > 0);
        const min = Math.min(...omitZeros);

        const res = AbmUtil._getScale(min, basicTitle, language);

        return { name: res.name, nums: nums.map(n => Math.round(n / res.scale)) };
    }

    /**
     *
     * @param type period type, currently support month, day, hour
     * @param all whether get periods untill today or get all periods.
     */
    public static getPeriods(type: 'M' | 'D' | 'H', all = false): number[] {
        let base: number[];
        let sliceTo: number;
        switch (type) {
            case 'M':
                base = MONTHS;
                if (all) { return base; }
                sliceTo = (new Date()).getMonth() + 1;
                break;
            case 'D':
                base = DAYS;
                if (all) { return base; }
                sliceTo = (new Date()).getDate();
                break;
            case 'H':
                base = HOURS;
                if (all) { return base; }
                sliceTo = (new Date()).getHours() + 1;
                break;
        }

        if (all) {
            return base;
        } else {
            return base.slice(0, sliceTo);
        }
    }

    public static get10Scale(scale: number): number {
        if (scale > -1 && scale < SCALE_POS.length) {
            return SCALE_POS[scale];
        } else if (scale < 0 && (-scale) <= SCALE_NEG.length) {
            return SCALE_NEG[-scale - 1];
        } else {
            return Math.pow(10, scale);
        }
    }

    /**
     * 默认返回从 0 ~ 100 之间的整数
     *
     * @param from 随机数起点， 默认 0
     * @param to 随机数终点， 默认 100
     * @param int 是否返回整数
     */
    public static randomInRange(from = 0, to = 100, int = true): number {
        AbmUtil.assert(from < to, 'from must be less than to');

        const result = Math.random() * (to - from) + from;

        return int ? Math.round(result) : result;
    }

    public static alignWithZeroPrefix(nums: number[]): string[] {

        const maxLength = Math.max(...nums).toString().length;

        const scale = AbmUtil.get10Scale(maxLength);

        return nums.map(n => (n + scale).toString().substr(1));
    }

    public static unsubscribe(...subs: (Subscription | undefined)[]): void {
        for (let sub of subs) {
            if (sub) {
                sub.unsubscribe();
                sub = undefined;
            }
        }
    }

    public static deepValue<T extends Record<string, unknown>>(obj: T, path: string): any {
        const paths = path.split('.');
        let current = obj;

        for (const p of paths) {
            if (current[p] === undefined && current[p] === null) {
                return current[p];
            } else {
                current = current[p] as T;
            }
        }
        return current;
    }

    private static pSBCr(d: any) {
        const i = parseInt, m = Math.round;
        const n = d.length, x: any = {};
        if (n > 9) {
            const [r, g, b, a] = d = d.split(","), n = d.length;
            if (n < 3 || n > 4) return null;
            x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
        } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
            else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
        } return x
    }

    /**
     * 
     * @param p < Percentage Float > typical range of -1.0 to 1.0
     * @param c0 < "from" Color String >
     * @param c1 < "to" Color String >
     * @param l < UseLinear Boolean >
     */
    public static pSBC(p: number, c0: string, c1?: string, l?: boolean): string | undefined {
        let r, g, b, P, f, t, h, a: any = typeof (c1) == "string";
        const m = Math.round;
        if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return undefined;

        h = c0.length > 9, h = a ? c1 && c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = AbmUtil.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? AbmUtil.pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }, p = P ? p * -1 : p, P = 1 - p;
        if (!f || !t) return undefined;
        if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
        else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
        a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
        if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
        else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
    }
}
