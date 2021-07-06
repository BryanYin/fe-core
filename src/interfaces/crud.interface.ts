import { Observable } from 'rxjs';

export type AbmStorageType = 'localStorage' | 'sessionStorage' | 'database' | 'api';

/**
 * CRUD 接口。
 */
export interface IAbmCRUD<T> {
    save(data: T): Observable<boolean> | boolean;

    delete(data: T | string): Observable<boolean> | boolean;

    read(type: new () => T, condition?: unknown): Observable<T[] | T | undefined> | T | T[] | undefined;

    /** optional, can use save() instead, if need return T, then use update() */
    update?(data: T): Observable<boolean>;
}
