import { ReplaySubject } from 'rxjs';

export class AbmGlobalMessageSingleton {

    private static instance: AbmGlobalMessageSingleton | undefined;

    public static getInstance(): AbmGlobalMessageSingleton {
        if (!this.instance) {
            this.instance = new AbmGlobalMessageSingleton();
        }
        return this.instance;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /** page switch event */
    public pageChangeEvent$: ReplaySubject<string> = new ReplaySubject<string>();
    /** menu change event */
    public menuChangeEvent$: ReplaySubject<string> = new ReplaySubject<string>();
}

export const abmMsgInstance = AbmGlobalMessageSingleton.getInstance();
