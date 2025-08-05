const createWallet = require('../../helper/createWallet/createWallet');
const encryptKey = require('../../helper/crypto/encryptKey');
const dbClient = require('../../helper/dbConnect/dbClient')
const exportWallet = require('../../helper/exportWallet/exportWallet')
const handleWalletCreation = async (chatId, messageId, userId, bot) => {
    const walletExists = await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])
    if (walletExists.rows[0]) {

        await bot.sendMessage(chatId, `You already have a wallet under the address: ${walletExists.rows[0].wallet}`)
        return {
            success: false,
            error: 'User already has wallet.'
        }
    }


    try {
    const walletData = await createWallet()
    const walletAddress = walletData.pubKey
    const encryptedWalletData = encryptKey(walletData.privKey)
    const insertResponse = await dbClient.query('INSERT INTO user_wallets (tg_user_id, wallet) VALUES ($1, $2) RETURNING *', [userId, walletAddress])
    await dbClient.query('INSERT INTO wallet_secrets (wallet, priv_key, salt, iv) VALUES ($1, $2, $3, $4) RETURNING *', [walletAddress, encryptedWalletData.encrypted_pkey, encryptedWalletData.salt, encryptedWalletData.iv]);
    const walletSecret = walletData.privKey

    if (insertResponse.rows[0]) {
        await bot.deleteMessage(chatId, messageId);
        console.log(walletAddress, walletSecret)
        await bot.sendMessage(chatId,
         `<b>✨ Your Wallet Has Been Created!</b>\n\nAddress: ${walletAddress}\n\nPrivate Key: <tg-spoiler>${walletSecret}</tg-spoiler>\n\n<b>🔑 Security Notice:</b>\nThis is the <i>only time</i> your private key will be shown. Store it securely and do <b>not</b> share it with anyone. Once this message is deleted, it cannot be recovered.`,
        {
            parse_mode: 'HTML',
            reply_markup: {
            inline_keyboard: [
                [{ text: '🗑️ Close', callback_data: 'delete_message' }]
            ]
            }
        }
        );
        return {
            success: true,
            error: null
        }
    } else if (!insertResponse.rows[0]) {
        await bot.deleteMessage(chatId, messageId);
        await bot.sendMessage(chatId, 'Sorry, we could not create a wallet for you.')
        return {
            success: false,
            error: 'Failed to insert wallet address into database'
        }
    }
    } catch (err) {

        await bot.sendMessage(chatId, '⚠️ An error occurred while creating your wallet.');
        console.error(err)
        return {
            success: false,
            error: err
        }
    }
    
    
}

module.exports = handleWalletCreation;