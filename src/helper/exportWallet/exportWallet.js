const turnkeyClient = require('../turnkeyClient/turnkeyClient');
const {
  generateP256KeyPair,
  decryptExportBundle,
} = require("@turnkey/crypto");

require('dotenv').config({path: '../../../.env'});
const dbClient = require('../dbConnect/dbClient')

const exportWallet = async (walletAddress) => {
    try {
        const organizationId = process.env.TURNKEY_ORGANIZATION_ID;
        const getWalletId = await dbClient.query('SELECT turnkey_wallet_id FROM user_wallets WHERE wallet = $1', [walletAddress]);
        if (!getWalletId.rows[0]) {
            console.error('Failed to get wallet ID from db');
            return {
                success: false,
                error: 'Failed to get wallet ID from db'
            }
        }
        const walletId = getWalletId.rows[0].turnkey_wallet_id;
        const keyPair = generateP256KeyPair();
        const privateKey = keyPair.privateKey;
        const publicKey = keyPair.publicKeyUncompressed;
        const exportResult = await turnkeyClient.exportWallet({
            walletId: walletId,
            targetPublicKey: publicKey
        })

        const decryptedBundle = await decryptExportBundle({
            exportBundle: exportResult.exportBundle,
            embeddedKey: privateKey,
            organizationId,
            returnMnemonic: true
        })
        console.log(`Success! The wallet secret mnemonic is: ${decryptedBundle}`)

    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
}

module.exports = exportWallet;