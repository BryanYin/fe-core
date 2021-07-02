import { AbmLogger } from './abm-logger';

export class AbmEncrypt {

    private static _logger = AbmLogger.instance(AbmEncrypt);

    private static salt = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', '-',
        's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b',
        'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '-',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', '-',
        's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-'
    ];

    // |______|__ro|
    public static basicEncrypt(pwd: string): string {

        if (!pwd) {
            return '';
        }

        let encrypt = '';

        let sumCode = 0;
        for (let i = 0; i < pwd.length; i++) {
            sumCode += pwd.charCodeAt(i);
        }
        const offset = sumCode % 10;

        for (let i = 0; i < pwd.length; i++) {
            encrypt += String.fromCharCode(pwd.charCodeAt(i) + (i % 2 === 0 ? offset : -offset));
        }
        return encrypt + pwd.charAt(0) + pwd.charAt(pwd.length - 1) + Math.round(Math.random() * 10) + offset;
    }

    public static basicDecrypt(enc: string): string {

        if (!enc) {
            return '';
        }

        if (enc.length < 6) {
            AbmEncrypt._logger.error('Not a encrypt format: ' + enc);
            return '';
        }
        const encrypted = enc.substring(0, enc.length - 4);
        const offset = +enc.charAt(enc.length - 1);

        let decrypt = '';

        for (let i = 0; i < encrypted.length; i++) {
            decrypt += String.fromCharCode(encrypted.charCodeAt(i) + (i % 2 === 0 ? -offset : offset));
        }
        return decrypt;
    }

    public static addSalt(value: string): string {
        if (value !== null && value !== undefined) {
            const length = value.length;

            let newvalue = '';
            for (let i = 0; i < length; i++) {
                newvalue += AbmEncrypt.salt[Math.floor(Math.random() * 60)] + value[(i)];
            }
            return newvalue;
        } else {
            return '';
        }
    }

    public static removeSalt(value: string): string {
        if (value !== null && value !== undefined) {
            const length = value.length;
            let newvalue = '';
            for (let i = 0; i < length; i++) {
                if (i % 2 !== 0) {
                    newvalue = newvalue + value[i];
                }
            }
            return newvalue;
        } else {
            return '';
        }
    }

    public static encrypt(pwd: string): string {

        const pwdWithsalt = AbmEncrypt.basicEncrypt(AbmEncrypt.addSalt(pwd));

        if (btoa) {
            return btoa(pwdWithsalt);
        }

        return pwdWithsalt;
    }
    public static decrypt(enc: string): string {

        const pwdWithoutsalt = AbmEncrypt.removeSalt(AbmEncrypt.basicDecrypt(enc));

        if (atob) {
            return atob(pwdWithoutsalt);
        }

        return pwdWithoutsalt;
    }
}
