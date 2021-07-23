
import { Subject } from 'rxjs';
import { AbmMap } from '../classes/abm-map';
import { AbmTheme } from '../classes/abm-theme';
import { AbmLogger } from '../utils/abm-logger';
import { AbmWebStorage } from '../utils/abm-web-storage';

export class AbmThemeSingleton {


    private static instance: AbmThemeSingleton | undefined;

    public static getInstance(): AbmThemeSingleton {
        if (!this.instance) {
            this.instance = new AbmThemeSingleton();
        }
        return this.instance;
    }


    private _logger = AbmLogger.instance("AbmThemeSingleton");
    private storage: AbmWebStorage<AbmTheme>;

    private themes: AbmMap<string, AbmTheme> = new AbmMap();

    public selectedTheme = 'saga-blue';
    public theme$: Subject<AbmTheme> = new Subject();
    /** 切换主题事件，切换主题是更换 <link> 元素的内容，所以只需要用 Subject 即可 */
    public themeChangeEvent$: Subject<string> = new Subject();


    private constructor();
    private constructor(defaultTheme: string);
    private constructor(private _defaultTheme?: string) {
        if (this._defaultTheme) {
            this.selectedTheme = this._defaultTheme;
        }

        this.storage = new AbmWebStorage<AbmTheme>("local");

        const theme = this.storage.read(AbmTheme);
        if (theme) {
            this.setTheme(theme);
        }
    }

    public getThemes(): AbmTheme[] {
        return Array.from(this.themes.values());
    }

    public getTheme(themeName: string): AbmTheme | undefined {
        const theme = this.themes.get(themeName);

        if (!theme) {
            this._logger.error('No theme named: ' + themeName);
        }

        return theme;
    }

    public addTheme(theme: AbmTheme): void {
        this.themes.set(theme.name, theme);
    }

    public removeTheme(theme: AbmTheme | string): void {
        if (typeof theme === 'string') {
            this.themes.delete(theme);
        } else {
            this.themes.delete(theme.name);
        }
    }

    public clearStoredTheme(): boolean {
        return this.storage.delete(new AbmTheme());
    }

    public setTheme(theme: string | AbmTheme): void {
        if (!theme) {
            return;
        }

        let newTheme: AbmTheme | undefined;
        if (typeof theme !== 'string') {
            newTheme = theme;
        } else {
            newTheme = this.getTheme(theme);
        }

        if (!newTheme || newTheme.name === this.selectedTheme) {
            return;
        } else {
            this.selectedTheme = newTheme.name;
            this.storage.save(newTheme);

            const d = document.getElementById('abmThemeLink');
            if (d) {
                d.setAttribute('href', newTheme.path);
                this.theme$.next(newTheme);
            } else {
                throw new Error('css link of name abmThemeLink does not exist in current html');
            }

        }
    }
}

export const abmThemeInstance = AbmThemeSingleton.getInstance();
