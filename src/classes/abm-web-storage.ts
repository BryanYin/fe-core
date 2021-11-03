import { IAbmCRUD } from '../interfaces/crud.interface';
import { IAbmStringSavable } from '../interfaces/saveable.interface';
import { AbmLogger } from '../utils/abm-logger';

export class AbmWebStorage<T extends IAbmStringSavable<T>> implements IAbmCRUD<T>{

    protected _logger: AbmLogger = AbmLogger.instance('AbmWebStorage');

    protected storage: Storage;

    constructor(protected type: 'local' | 'session') {
        if (type === 'local') {
            this.storage = localStorage;
        } else {
            this.storage = sessionStorage;
        }
    }

    save(data: T): boolean {
        try {
            this.storage.setItem(data.key, data.toSaveString());
            return true;
        } catch (err) {
            this._logger.error(err);
            return false;
        }
    }

    delete(data: T): boolean {
        const content = this.storage.getItem(data.key);

        if (content) {
            this.storage.removeItem(data.key);
            return true;
        }

        return false;
    }

    read(type: new () => T, condition?: string): T | undefined {
        const data: T = new type();
        const result = this.storage.getItem(condition ?? data.key);

        if (!result) {
            return undefined;
        } else {
            return data.parseFromString(result);
        }
    }
}
