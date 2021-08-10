
import { AbmBiMap } from '../classes/abm-bimap';

export enum AbmHttpMethod {
    NOT_SUPPORTED,
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export type AbmObjectType<T> = Partial<Record<keyof T, unknown>>;

export class AbmDataMapping<S extends AbmObjectType<S>, T extends AbmObjectType<T>> {
    public srcTgtMap: AbmBiMap<keyof S, keyof T>;
    constructor(
        public name: string,
        public source: (keyof S)[],
        public target: (keyof T)[],
    ) {
        if (source.length !== target.length) {
            throw new Error('data mapping length inconsistent:' + source.toString() + target.toString());
        }
        this.srcTgtMap = new AbmBiMap();
        for (let i = 0; i < source.length; i++) {
            this.srcTgtMap.set(source[i], target[i]);
        }
    }

    public getTarget(src: keyof S): keyof T | undefined {
        return this.srcTgtMap.getFromKey(src);
    }

    public getSource(target: keyof T): keyof S | undefined {
        return this.srcTgtMap.getFromValue(target);
    }
}

/**
 * Http request definition.
 */
export class AbmHttpRequest {
    public name: string | undefined;
    public respMappingName: string | undefined;
    /**
     * 
     * @param indexName index name, unique id for the request. Suggest use string enum, it is easy to refer.
     * @param endpoint only endpoint part, server url will be configured in {@link AbmDataConnection}
     * @param method Request type
     * @param mockFile path to mock file, used in test env
     * @param header http header
     */
    constructor(
        public indexName: string,
        public endpoint: string,
        public method = AbmHttpMethod.GET,
        public header?: Record<string, unknown> | null,
        public mockFile?: string,
    ) {
        this.name = endpoint.split('/').pop();
    }

    /**
     * 同一个请求会用在不同的场景，需要时，可以通过该方法设置场景名称，方便记录日志。
     * @param name 场景名称
     */
    public withName(name: string): AbmHttpRequest {
        this.name = name;
        return this;
    }

    /**
     * Fluent API for creating new request link by setting response mapping name.
     * @param mappingName response mapping name.
     * @returns this
     */
    public withMapping(mappingName: string): AbmHttpRequest {
        this.respMappingName = mappingName;
        return this;
    }
}

/**
 * 后台返回的数据结构。
 */
export class AbmResponseData<T> {
    constructor(
        public code: number,
        public success: boolean,
        public msg: string,
        public data: T,
    ) { }
}

export type AbmMenuType = 'nav' | 'side';
export type AbmOnOffType = 'on' | 'off';

export enum AbmServerType {
    DEFAULT,
    DATA,
    CONTROL,
    FILE,
    IDP,
    SP,
}

/**
 * 服务器配置。前端对应的后台服务器配置。
 */
export interface AbmServerConfig {
    [name: string]: unknown;

    enable: boolean;
    type: AbmServerType | string;
    url: string;
    api: string;
}
