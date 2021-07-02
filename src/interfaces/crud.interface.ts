import { Observable } from 'rxjs';

export type AbmStorageType = 'localStorage' | 'sessionStorage' | 'database' | 'api';

/**
 * CRUD 接口。
 */
export interface IAbmCRUD<T> {
    save(data: T): Observable<boolean>;

    delete(data: T | string): Observable<T | string | undefined>;

    read(type: new () => T, condition?: any): Observable<T[] | T | undefined>;

    /** optional, can use save() instead, if need return T, then use update() */
    update?(data: T): Observable<T | undefined>;
}
