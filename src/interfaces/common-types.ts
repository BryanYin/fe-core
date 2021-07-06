
/** 时间日期格式 */
export const ABM_DATETIME_FORMAT_BASIC = 'YYYYMMDDHHmmss';
export const ABM_DATETIME_FORMAT_ISO = 'YYYY-MM-DDTHH:mm:ss.sssZ';
export const ABM_DATETIME_FORMAT_YYYYMMDD = 'YYYYMMDD';

export enum AbmServerType {
    COMMON = 'COMMON',
    DATA = 'DATA',
    CONTROL = 'CONTROL',
    FILE = 'FILE',
    IDP = 'IDP',
    SP = 'SP',
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
