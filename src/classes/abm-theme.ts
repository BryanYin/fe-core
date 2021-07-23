
import { IAbmStringSavable } from '../interfaces/saveable.interface';
import { AbmFilePaths, AbmFilePathType } from '../utils/abm-file-path';
import { AbmUtil } from '../utils/abm-util';

export type AbmThemeType = 'light' | 'dark' | 'unknown';

/**
 * 保存在 storage 中的 key
 */
export const ABM_THEME_KEY = 'ABM_THEME';

export type AbmThemeForSave = Pick<AbmTheme, 'name' | 'path' | 'themeType'>;

/**
 * 主题。 用于在应用程序和大屏切换主题。
 */
export class AbmTheme implements IAbmStringSavable<AbmTheme> {
    key = ABM_THEME_KEY;
    name: string;
    path: string;
    themeType: AbmThemeType;

    constructor();
    constructor(name: string);
    constructor(name: string, path: string, themeType: AbmThemeType);
    constructor(name?: string, path?: string, themeType?: AbmThemeType) {
        this.name = name ?? "default";
        this.path = path ?? this.inferPathFromName();
        this.themeType = themeType ?? this.inferTypeFromName();
    }

    /**
     * 默认主题配色用 css 文件，保存在项目的 assets/themes 下
     * TODO：是否需要考虑 scss？
     */
    public inferPathFromName(): string {
        return AbmUtil.buildUrl(AbmFilePaths.getPath(AbmFilePathType.THEME), this.name + '.css');
    }

    /**
     * 从主题名称获取类型，dark 或 light
     */
    public inferTypeFromName(): AbmThemeType {

        const lowerName = this.name.toLowerCase();

        if (lowerName.includes('light')) {
            return 'light';
        }

        if (lowerName.includes('dark')) {
            return 'dark';
        }

        return 'unknown';
    }

    toSaveString(): string {
        const saveable: AbmThemeForSave = {
            name: this.name,
            path: this.path,
            themeType: this.themeType,
        };
        return JSON.stringify(saveable);
    }
    parseFromString(data: string): AbmTheme {
        const obj: AbmThemeForSave = JSON.parse(data);
        return new AbmTheme(obj.name, obj.path, obj.themeType);
    }
}
