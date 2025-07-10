// First, install the library if you haven't:
// npm install bs58

const bs58 = require('bs58');

function isValidSolanaAddress(address) {
  try {
    const decoded = bs58.decode(address);
    return decoded.length === 32;
  } catch (e) {
    // Decoding failed, so invalid base58 or incorrect length
    return false;
  }
}

module.exports = isValidSolanaAddress;
