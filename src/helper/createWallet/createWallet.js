require('dotenv').config({path: '../../../.env'});
const rpc = require('../../clients/rpcClient');
const bs58 = require('bs58');
const solanaWeb3 = require('@solana/web3.js');
 async function createWallet() {
  try {
    const keypair = solanaWeb3.Keypair.generate();
    
    const pubKey = keypair.publicKey.toBase58();

    const privKey = bs58.encode(keypair.secretKey)

    return {
      pubKey, privKey
    }
  } catch(e) {
    console.error(e)
  }

}



// Export functions for use in other files
module.exports = createWallet;
