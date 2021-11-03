import { AbmMap } from '../classes/abm-map';

/**
 * 日志标记和颜色。默认用 ABM 橙。
 */
export const ABM_LOGGER_PREFIX = '%cABM';
export const ABM_LOGGER_COLOR = '#FD802E';

export enum LoggingLevel {
    NONE = 'NONE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

export class AbmLogger {
    public static prefix = ABM_LOGGER_PREFIX;
    private static color = 'color:' + ABM_LOGGER_COLOR;

    private static loggers: AbmMap<string, AbmLogger> = new AbmMap();

    public static level: LoggingLevel = LoggingLevel.INFO;
    private readonly _clazz: string;

    public static instance<T>(t: (new (...args: unknown[]) => T) | string): AbmLogger {

        const loggerName = typeof t === 'string' ? t : t.name;

        return AbmLogger.loggers.getOrDefaultThenSetDefault(loggerName, new AbmLogger(loggerName));
    }

    private constructor(cls: string) {
        this._clazz = ' ' + cls;
    }

    public static setColor(color: string): void {
        AbmLogger.color = 'color:' + color;
    }

    public static infoAbm(message: unknown, ...optionalParams: unknown[]): void {
        console.log(AbmLogger.prefix, AbmLogger.color, message, ...optionalParams);
    }

    public static warnAbm(message: unknown, ...optionalParams: unknown[]): void {
        console.warn(AbmLogger.prefix, AbmLogger.color, message, ...optionalParams);
    }

    public static errorAbm(message: unknown, ...optionalParams: unknown[]): void {
        console.error(AbmLogger.prefix, AbmLogger.color, message, ...optionalParams);
    }

    public static timeStart(label: string): void {
        console.log(AbmLogger.prefix, AbmLogger.color, '[' + label + '] start timing...');
        // tslint:disable-next-line: no-console
        console.time(label);
    }

    public static timeEnd(label: string): void {
        console.log(AbmLogger.prefix, AbmLogger.color, '[' + label + '] timing end:');
        // tslint:disable-next-line: no-console
        console.timeEnd(label);
    }

    public log(message: unknown, level = LoggingLevel.WARN, ...optionalParams: unknown[]): void {
        if (this.shouldLog(level)) {
            switch (level) {
                case LoggingLevel.ERROR:
                    console.error(AbmLogger.prefix + this._clazz, AbmLogger.color, message, ...optionalParams);
                    break;
                case LoggingLevel.WARN:
                    console.warn(AbmLogger.prefix + this._clazz, AbmLogger.color, message, ...optionalParams);
                    break;
                case LoggingLevel.INFO:
                    console.log(AbmLogger.prefix + this._clazz, AbmLogger.color, message, ...optionalParams);
                    break;
                default:
                    console.log(AbmLogger.prefix + this._clazz, AbmLogger.color, message, ...optionalParams);
            }
        }
    }

    private shouldLog(level: LoggingLevel) {
        if (AbmLogger.level === LoggingLevel.NONE) {
            return false;
        } else if (AbmLogger.level === LoggingLevel.ERROR) {
            return level === LoggingLevel.ERROR;
        } else if (AbmLogger.level === LoggingLevel.WARN) {
            return level === LoggingLevel.ERROR || level === LoggingLevel.WARN;
        } else if (AbmLogger.level === LoggingLevel.INFO) {
            return level === LoggingLevel.ERROR || level === LoggingLevel.WARN || level === LoggingLevel.INFO;
        } else {
            return true;
        }
    }

    public error(message: unknown, ...optionalParams: unknown[]): void {
        this.log(message, LoggingLevel.ERROR, ...optionalParams);
    }

    public warn(message: unknown, ...optionalParams: unknown[]): void {
        this.log(message, LoggingLevel.WARN, ...optionalParams);
    }

    public info(message: unknown, ...optionalParams: unknown[]): void {
        this.log(message, LoggingLevel.INFO, ...optionalParams);
    }

    public debug(message: unknown, ...optionalParams: unknown[]): void {
        this.log(message, LoggingLevel.DEBUG, ...optionalParams);
    }

    public infoOfRed(message: unknown, ...optionalParams: unknown[]): void {
        console.log(AbmLogger.prefix + this._clazz, 'color:red', message, ...optionalParams);
    }

    public infoOfGreen(message: unknown, ...optionalParams: unknown[]): void {
        console.log(AbmLogger.prefix + this._clazz, 'color:green', message, ...optionalParams);
    }
}
