const bs58 = require("bs58");



function isValidCA(input) {
    try {
        const decoded = bs58.decodeUnsafe(input);
        return decoded.length === 32;
    } catch (e) {
        console.error(e);
    }
}

module.exports = isValidCA;