require('dotenv').config({path: '../../../.env'});
const crypto = require('crypto');
const decryptKey = ({cipher, salt, iv}) => {
    const password = process.env.ENCRYPTION_SECRET;
    const saltBuf = Buffer.from(salt, 'base64')
    const ivBuf = Buffer.from(iv, 'base64')
    const dataBuf = Buffer.from(cipher, 'base64');

    const key = crypto.pbkdf2Sync(password, saltBuf, 100000, 32, 'sha256');

    const tag = dataBuf.slice(dataBuf.length - 16);
    const encrypted = dataBuf.slice(0, dataBuf.length - 16);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, ivBuf);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ])
    return decrypted.toString('utf8');
}
module.exports = decryptKey;