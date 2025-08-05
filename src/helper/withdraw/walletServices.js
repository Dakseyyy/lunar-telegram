const decryptKey = require("../crypto/decryptKey");
const {Keypair} = require('@solana/web3.js');
const dbClient = require('../dbConnect/dbClient')
const bs58 = require('bs58')
// gets user wallet from db
async function getuserWallet(userId) {
    try {
          const userWallet = (await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])).rows[0].wallet;
          return userWallet
    } catch (e) {
        console.error(e);
    }
}

// gets user withdrawal wallet
async function getUserWithdrawWallet(userId) {
   try {
     const withdrawWallet = (await dbClient.query('SELECT withdrawal_address FROM withdraw_settings WHERE tg_user_id = $1', [userId])).rows[0].withdrawal_address;
    return withdrawWallet
   } catch(e) {
    console.error(e)
   }
}
// gets user private key and decodes it
async function getUserPrivateKey(wallet) {
   try {
     const walletSecrets = (await dbClient.query('SELECT * FROM wallet_secrets WHERE wallet = $1', [wallet])).rows[0];
     console.log(walletSecrets)
    const privateKey = decryptKey({...walletSecrets, cipher: walletSecrets.priv_key});
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    return keypair;
   } catch (e) {
    console.error(e)
   }
}

async function getUserSOLWithdrawAmount(userId) {
    try {
        const solAmount = (await dbClient.query('SELECT sol_amount FROM withdraw_settings WHERE tg_user_id = $1', [userId])).rows[0].sol_amount;
        return solAmount;
    } catch (e) {
        console.error(e);
    }
}




module.exports = {
    getUserPrivateKey,
    getuserWallet,
    getUserWithdrawWallet,
    getUserSOLWithdrawAmount
}