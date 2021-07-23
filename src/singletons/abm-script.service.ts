import { Observable, Observer } from 'rxjs';
import { AbmNameValue } from '../classes/abm-namevalue';
import { AbmLogger } from '../utils/abm-logger';

export class AbmScript extends AbmNameValue<string> {
    public loaded: boolean;
    constructor(name: string, src: string, loaded = false) {
        super(name, src);
        this.loaded = loaded;
    }
}

export class AbmScriptSingleton {

    private static instance: AbmScriptSingleton | undefined;

    public static getInstance(): AbmScriptSingleton {
        if (!this.instance) {
            this.instance = new AbmScriptSingleton();
        }
        return this.instance;
    }

    protected _logger = AbmLogger.instance("AbmScriptSingleton");

    private scripts: Map<string, AbmScript> = new Map();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    public load(script: AbmScript): Observable<AbmScript> {
        return new Observable<AbmScript>((observer: Observer<AbmScript>) => {
            const existingScript = this.scripts.get(script.name);

            // Complete if already loaded
            if (existingScript?.loaded) {
                this._logger.info('Script ' + existingScript.name + ' already loaded');
                observer.next(existingScript);
                observer.complete();
            } else {
                // Add the script
                this.scripts.set(script.name, script);

                // Load the script
                const scriptElement = document.createElement('script');
                scriptElement.type = 'text/javascript';
                scriptElement.src = script.value as string;

                scriptElement.onload = () => {
                    script.loaded = true;
                    observer.next(script);
                    observer.complete();
                };

                scriptElement.onerror = (_err: any) => {
                    observer.error('Cannot load script ' + script.value);
                };

                document.getElementsByTagName('head')[0].appendChild(scriptElement);
                this._logger.info('Loaded script:' + script.name);
            }
        });
    }
}

export const abmScriptInstance = AbmScriptSingleton.getInstance();
