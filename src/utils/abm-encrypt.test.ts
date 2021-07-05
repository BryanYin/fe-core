import { AbmEncrypt } from "./abm-encrypt";

test('Encrypt and Decrypt works!', () => {
    expect(AbmEncrypt.decrypt(AbmEncrypt.encrypt("This means en/de crypt works!"))).toBe("This means en/de crypt works!")
});
