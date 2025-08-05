require('dotenv').config({path: '../../../.env'});
const crypto = require('crypto');
const encryptKey = (pkey) => {
    const password = process.env.ENCRYPTION_SECRET;
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(12);

    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const encrypted = Buffer.concat([
        cipher.update(pkey, 'utf8'),
        cipher.final()
    ]);
    const tag = cipher.getAuthTag();
    return {
        encrypted_pkey: Buffer.concat([encrypted, tag]).toString('base64'),
        salt: salt.toString('base64'),
        iv: iv.toString('base64')
    }
}

module.exports = encryptKey;

