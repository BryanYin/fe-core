
export enum AbmServerType {
    COMMON,
    DATASERVER,
    CONTROLSERVER,
    FILESERVER,
}

/**
 * 服务器配置。前端对应的后台服务器配置。
 */
export interface AbmServerConfig {
    [name: string]: unknown;

    enable: boolean;
    type: AbmServerType;
    url: string;
    api: string;
}

/**
 * websocket 控制配置
 */
export interface AbmControlConfig extends AbmServerConfig {
    serverId: string;
    reconInterval: number; // seconds
    connectOnInit: boolean;
}

/**
 * ABM 程序配置，包含所有的配置。用 AbmCoreConfigService 加载
 */
export interface AbmConfig {
    [name: string]: unknown;

    useMock: boolean;
    refreshInterval: number;
    servers: AbmServerConfig[];
}

export interface IAbmInitiableConfig {
    loadConfig(): Promise<AbmConfig>;
}
