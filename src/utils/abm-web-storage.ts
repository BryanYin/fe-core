import { Observable, of } from 'rxjs';
import { IAbmCRUD } from '../interfaces/crud.interface';
import { IAbmStringSavable } from '../interfaces/saveable.interface';
import { AbmLogger } from './abm-logger';

export class AbmWebStorage<T extends IAbmStringSavable<T>> implements IAbmCRUD<T>{

    protected _logger: AbmLogger = AbmLogger.instance('AbmWebStorage');

    constructor(protected storage: Storage) { }

    save(data: T): Observable<boolean> {

        if (!this.isKeyValid(data)) {
            return of(false);
        }

        try {
            this.storage.setItem(data.key, data.toSaveString());
            return of(true);
        } catch (error) {
            return of(false);
        }
    }

    delete(key: string): Observable<string | undefined> {

        const content = this.storage.getItem(key);

        if (content) {
            this.storage.removeItem(key);
            return of(content);
        }

        return of(undefined);
    }


    read(type: new () => T, condition?: any): Observable<T | undefined> {
        if (typeof condition !== 'string') {
            this._logger.error('read condition is not string: ', condition);
        } else {
            const result = this.storage.getItem(condition);

            if (!result) {
                return of(undefined);
            } else {
                const data: T = new type();
                return of(data.parseFromString(result));
            }
        }
        return of(undefined);
    }

    private isKeyValid(data: T) {
        if (!data.key) {
            this._logger.error('Data does not have a key: ' + data.key);
            return false;
        }
        return true;
    }

}
