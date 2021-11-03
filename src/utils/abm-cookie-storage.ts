import { AbmCommonPrimitives } from "./abm-util";

export class AbmCookieStorage {
    public static setCookie(name: string, value: AbmCommonPrimitives, expiredays?: number): void {
        if (expiredays !== undefined) {
            const d = new Date();
            d.setTime(d.getTime() + (expiredays * 24 * 60 * 60 * 1000));
            document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d + ';path=/';
            // document.cookie = name + '=' + value + ';expires=' + d;
        } else {
            document.cookie = name + '=' + encodeURIComponent(value) + ';path=/';
            //  document.cookie = `${name}=${value}`;
        }
    }

    public static getCookie(name: string): string | undefined {
        const cookieArr = document.cookie.split(';');
        for (const cookie of cookieArr) {
            const cookieParts = cookie.split('=');
            if (cookieParts[0].trim() === name) {
                return decodeURIComponent(cookieParts[1]);
            }
        }
        return undefined;
    }
}
