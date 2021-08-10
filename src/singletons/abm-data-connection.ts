import { Observable, ReplaySubject } from 'rxjs';
import { ajax, AjaxConfig } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';
import { AbmDataMapping, AbmHttpMethod, AbmHttpRequest, AbmObjectType, AbmResponseData, AbmServerType } from '../global/types';
import { AbmFilePaths, AbmFilePathType } from '../utils/abm-file-path';
import { AbmLogger } from '../utils/abm-logger';
import { AbmUtil } from '../utils/abm-util';

export enum DATA_STATUS {
    NORMAL,
    WARN,
    ERROR,
}

export type AbmHttpOptions = {
    params?: Record<string, string>;
    body?: Record<string, unknown>;
    opt?: Omit<AjaxConfig, 'url' | 'method' | 'queryParams' | 'body'>;
};

export class AbmDataConnection {

    private static _logger = AbmLogger.instance("AbmDataService");

    protected static instances: Map<string | AbmServerType, AbmDataConnection> = new Map();

    /**
     * get a data connection instance.
     * @param name instance name, if not provied then return default instance.
     */
    public static getInstance(name?: string | AbmServerType): AbmDataConnection {
        let instance: AbmDataConnection | undefined;
        if (name) {
            instance = this.instances.get(name);
        } else {
            instance = this.instances.get(AbmServerType.DEFAULT);
        }

        if (instance) {
            return instance;
        } else {
            if (!name) {
                throw new Error('default data connection not initialized, call AbmDataConnection#initInstance first.');
            } else {
                throw new Error(name.toString() + ' data connection not initialized, call AbmDataConnection#initInstance first.');
            }
        }
    }

    public static initInstance(name: string | AbmServerType, serverUrl: string, requests: AbmHttpRequest[], useMock = false): AbmDataConnection {
        let adc: AbmDataConnection | undefined = this.instances.get(name);

        if (adc) {
            const printName = typeof name === 'string' ? name : AbmServerType[name];
            AbmLogger.warnAbm('Data connection of name ' + printName + ' already exists, make sure you are init the correct instance');
            return adc;
        }

        adc = new AbmDataConnection(serverUrl, requests, useMock);
        this.instances.set(name, adc);
        return adc;
    }

    public static simpleGet<T>(url: string, headers?: Record<string, string>): Observable<T> {
        return ajax.get<T>(url, headers).pipe(map(resp => {
            return resp.response;
        }), catchError(err => {
            throw err;
        }));
    }

    private apiUrl: string;
    private useMock: boolean;

    public dataStatus$: ReplaySubject<DATA_STATUS> = new ReplaySubject();

    private requests: Map<string, AbmHttpRequest> = new Map();

    private isCheckingErr = false;
    private dataErrCount: Map<string, number> = new Map();

    private header: Record<string, string> | undefined;

    constructor(serverUrl: string, requests: AbmHttpRequest[], useMock = false) {
        this.useMock = useMock;
        this.apiUrl = this.useMock ? AbmFilePaths.getPath(AbmFilePathType.MOCK) : serverUrl;
        this.addRequests(requests);
    }

    public setHeader(header: Record<string, string> | undefined): void {
        this.header = header;
    }

    public getHeader(): Record<string, string> | undefined {
        return this.header;
    }

    private _countApiStatus(endpoint: string, isError: boolean) {

        const count = this.dataErrCount.get(endpoint) || 0;

        if (isError) {
            this.dataErrCount.set(endpoint, count + 1);
        } else {
            this.dataErrCount.set(endpoint, 0);
        }

        if (!this.isCheckingErr) {
            this._checkError();
        }
    }

    private _checkError() {
        this.isCheckingErr = true;
        setTimeout(() => {
            const errorCount = Array.from(this.dataErrCount.values()).reduce((a, b) => a + b, 0);
            if (errorCount > 2) {
                this.dataStatus$.next(DATA_STATUS.ERROR);
            } else if (errorCount > 0) {
                this.dataStatus$.next(DATA_STATUS.WARN);
            } else {
                this.dataStatus$.next(DATA_STATUS.NORMAL);
            }
            this.isCheckingErr = false;
        }, Math.round(10));
    }

    public addRequests(requests: AbmHttpRequest[] | AbmHttpRequest): void {

        if (!requests) {
            return;
        }

        if (Array.isArray(requests)) {
            requests.forEach(r => this.requests.set(r.indexName, r));
        } else {
            this.requests.set(requests.indexName, requests);
        }
    }

    public getRequest(indexName: string, newName?: string): AbmHttpRequest {
        const request = this.requests.get(indexName);
        if (!request) {
            throw new Error('Can not find request for:' + indexName);
        } else {
            return newName ? request.withName(newName) : request;
        }
    }

    public clearStatus(): void {
        this.dataErrCount.clear();
    }

    public dataMapping<S extends AbmObjectType<S>, T extends AbmObjectType<T>>(
        input: Array<S>, mapping: AbmDataMapping<S, T>, c: new () => T): Array<T> {

        if (!input || !mapping) {
            throw new Error('No Input Data or mapping');
        }

        if (input.length === 0) {
            return new Array<T>();
        }

        const output: Array<T> = new Array(input.length);

        let sourceKey: keyof S;
        let targetKey: keyof T;
        for (let i = 0; i < input.length; i++) {
            output[i] = new c();
            for (let j = 0; j < mapping.source.length; j++) {
                sourceKey = mapping.source[j];
                targetKey = mapping.target[j];
                output[i][targetKey] = input[i][sourceKey] as never;
            }
        }

        return output;
    }

    public requestAbmResponse<T>(request: AbmHttpRequest, ops?: AbmHttpOptions): Observable<AbmResponseData<T>> {
        return this.request<AbmResponseData<T>>(request, ops).pipe(map(result => {
            if (!result || result.success === false) {
                this._countApiStatus(request.endpoint, true);
                AbmDataConnection._logger.error('Error:' + '[' + request.name + ']' + result.msg);
            }
            return result;
        }), catchError(err => {
            this._countApiStatus(request.endpoint, true);
            throw err;
        }));
    }

    public request<T>(request: AbmHttpRequest, ops?: AbmHttpOptions): Observable<T> {

        if (request.method === AbmHttpMethod.NOT_SUPPORTED) {
            throw new Error('Request ' + request.name + ' not supported method:NOT_SUPPORTED');
        }

        const url = AbmUtil.buildUrl(this.apiUrl, this.useMock ? (request.mockFile ?? '') : request.endpoint);
        const method = this.useMock ? AbmHttpMethod.GET : request.method;

        const ajaxRequest: AjaxConfig = { url, method };

        if (request.header) {
            ajaxRequest.headers = request.header;
        } else if (this.header) {
            ajaxRequest.headers = this.header;
        }

        if (ops?.params) {
            ajaxRequest.queryParams = ops.params;
        }

        if (ops?.body) {
            ajaxRequest.body = ops.body;
        }

        if (ops?.opt) {
            Object.assign(ajaxRequest, ops.opt);
        }

        return ajax<T>(ajaxRequest).pipe(map(resp => {
            if (!resp.response) {
                this._countApiStatus(request.endpoint, true);
                AbmDataConnection._logger.error('Error:' + '[' + request.name + ']' + '无查询结果');
            } else {
                this._countApiStatus(request.endpoint, false);
            }
            return resp.response;
        }), catchError(err => {
            this._countApiStatus(request.endpoint, true);
            throw err;
        }));
    }

}
