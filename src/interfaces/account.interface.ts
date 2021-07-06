import { Observable } from 'rxjs';
import { AbmUser } from '../classes/abm-user';

/**
 * 用户注册服务，泛型为用户类
 */
export interface IAbmAccountRegisterService<T> {
    /**
     * 注册用户，返回用户信息或者是否成功。
     * @param id 用户 id
     * @param password 密码
     * @param otherInfo 其他信息
     */
    register(id: string, password: string, otherInfo?: any): Observable<T | boolean>;

    /**
     * 注销
     * @param id 用户 id
     */
    unregister(id: string): Observable<boolean>;
}

/**
 * 用户服务
 */
export interface IAbmAccountService<T> {

    user: T;

    /**
     * 使用内部的 user 登录
     */
    login(): Observable<T>;

    /**
     * 使用用户名密码登录
     * @param id 用户名
     * @param password 密码
     */
    login(id: string, password: string): Observable<T>;

    /**
     * 保存用户至浏览器，返回是否保存成功
     * @param user 当前用户
     */
    saveUser(user: AbmUser): Observable<boolean>;

    /**
     * 从浏览器存储读取用
     */
    loadStoredUser(): Observable<AbmUser>;


    /**
     * 登出, 返回成功还是失败。
     */
    logout(): Observable<boolean>;

    /**
     * 更新用户 token, 返回更新了 token 的用户。
     */
    refreshToken(): Observable<AbmUser>;

    /**
     * 当前用户是否过期。
     */
    expired(): boolean;
}
