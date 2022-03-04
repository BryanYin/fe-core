import { AbmEncrypt } from "../abm-encrypt";

// 测试次数
const arrayLen = 100;
const phoneNos = new Array(arrayLen);
phoneNos.fill('This means en/de crypt works!');

test.each(phoneNos)('Encrypt and Decrypt %#', (a) => {
    expect(AbmEncrypt.decrypt(AbmEncrypt.encrypt(a))).toBe(a);
});
