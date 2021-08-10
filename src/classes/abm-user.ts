import { IAbmClassToInterface } from '../interfaces/class-to-interface.interface';
import { IAbmComparable } from '../interfaces/comparable.interface';
import { IAbmStringSavable } from '../interfaces/saveable.interface';
import { AbmEncrypt } from '../utils/abm-encrypt';

/**
 * User information stored in certain storage.
 */
export interface AbmUserForSave {
    displayName: string;
    /** encrypted */
    id: string;
    /** encrypted */
    password: string;
    rememberMe: boolean;
    token: string;
    tokenExpire: string;
    refreshToken: string;
    customProps: string;
}

/**
 * Login fields type
 */
export type AbmLoginFormType = Pick<AbmUserForSave, 'id' | 'password' | 'rememberMe'>;

/**
 * User status
 */
export type AbmUserStatus = 'NEW' | 'LOGIN' | 'EXPIRED' | 'LOGOUT';

/**
 * User class.
 */
export class AbmUser implements IAbmStringSavable<AbmUser>, IAbmComparable<AbmUser>, IAbmClassToInterface<AbmUser, AbmUserForSave> {

    public static readonly STORAGE_KEY = 'ABM_USER';

    public static readonly TOKEN_NEVER_EXPIRE = new Date(2199, 11, 31); // can i live that longer? :)

    public key = AbmUser.STORAGE_KEY;

    public status: AbmUserStatus;
    public displayName: string | undefined;
    public token: string | undefined;
    public refreshToken: string | undefined;
    private tokenExpire: Date | undefined;
    private customProps: Record<string, unknown> = {};

    /**
     * Ctor
     * @param id user id
     * @param password user password without encrypt
     * @param rememberMe remember me
     */
    constructor(
        public id = '',
        public password = '',
        public rememberMe = false) {
        this.status = 'NEW';
        this.tokenExpire = AbmUser.TOKEN_NEVER_EXPIRE;
    }

    public getEncryptId(): string {
        return AbmEncrypt.encrypt(this.id);
    }

    public getEncryptedPwd(): string {
        return AbmEncrypt.encrypt(this.password);
    }

    public getTokenExpire(): Date | undefined {
        return this.tokenExpire;
    }

    public getTokenExpireISOString(): string | undefined {
        return this.tokenExpire?.toISOString();
    }

    /**
     * 设置 token expire 时间，根据 token 是否已经过期设置用户状态。ISO 格式：
     *
     * YYYY-MM-DDTHH:mm:ss.sssZ
     */
    public setTokenExpireFromString(expire: string): void {
        this.tokenExpire = new Date(expire);

        // 如果第一次没成功，尝试把空格换成 T
        if (this.tokenExpire === null) {
            this.tokenExpire = new Date(expire.replace(' ', 'T'));
        }

        if (this.tokenExpire === null) {
            throw new Error('setTokenExpireFromString: date format incorrect');
        }
        this.checkUserStatus();
    }

    public removeToken(): void {
        this.token = undefined;
        this.tokenExpire = new Date();
    }

    public setTokenExpire(expire: Date): void {
        this.tokenExpire = expire;
        this.checkUserStatus();
    }

    public setCustomProps(props: Record<string, unknown>): void {
        this.customProps = props;
    }

    public getCustomProps<T>(): T {
        return this.customProps as T;
    }

    public checkUserStatus(): boolean {

        if (this.token && this.tokenExpire && this.tokenExpire.getTime() > new Date().getTime()) {
            this.status = 'LOGIN';
        } else {
            this.status = 'EXPIRED';
        }
        return this.status === 'LOGIN';
    }

    /**
     * 初始化 token 和 token expire
     * @param token token
     * @param tokenExpireStr token Expire String YYYY-MM-DDTHH:mm:ss.sssZ
     */
    public initToken(token: string, tokenExpireStr: string, refreshToken?: string): AbmUser {
        this.token = token;
        this.setTokenExpireFromString(tokenExpireStr);
        this.refreshToken = refreshToken;
        return this;
    }

    public toInterface(): AbmUserForSave {
        const obj: AbmUserForSave = {
            displayName: this.displayName ?? 'undefined',
            id: this.getEncryptId(),
            password: this.getEncryptedPwd(),
            rememberMe: this.rememberMe,
            token: this.token ?? 'undefined',
            tokenExpire: this.getTokenExpireISOString() ?? 'undefined',
            refreshToken: this.refreshToken ?? 'undefined',
            customProps: JSON.stringify(this.customProps),
        };
        return obj;
    }
    public fromInterface(data: AbmUserForSave): AbmUser {
        this.id = AbmEncrypt.decrypt(data.id);
        this.password = AbmEncrypt.decrypt(data.password);
        this.rememberMe = data.rememberMe;
        this.token = data.token;
        this.setTokenExpireFromString(data.tokenExpire);
        this.refreshToken = data.refreshToken;
        this.customProps = JSON.parse(data.customProps);
        return this;
    }

    public toSaveString(): string {
        const obj = this.toInterface();

        return JSON.stringify(obj);
    }

    public parseFromString(data: string): AbmUser {
        const obj: AbmUserForSave = JSON.parse(data);
        return this.fromInterface(obj);
    }

    public equals(other: AbmUser): boolean {
        if (!other) {
            return false;
        } else {
            return this.id === other.id && this.password === other.password;
        }
    }

}
