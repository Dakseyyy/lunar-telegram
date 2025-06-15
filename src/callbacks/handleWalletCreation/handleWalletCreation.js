const {createWallet} = require('../../helper/createWallet/createWallet');
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
    const walletData = await createWallet(`${userId}`);
    const walletAddress = walletData.solanaAddress
    const walletId = walletData.walletId
    
    const insertResponse = await dbClient.query('INSERT INTO user_wallets (tg_user_id, wallet, turnkey_wallet_id) VALUES ($1, $2, $3) RETURNING *', [userId, walletAddress, walletId])
    const walletSecret = (await exportWallet(walletAddress)).decryptedBundle;

    if (insertResponse.rows[0]) {
        await bot.deleteMessage(chatId, messageId);
        await bot.sendMessage(chatId, `*✨ Your Wallet Has Been Created\\!* \n\nAddress: \`${walletAddress}\`\n\nPrivate Key: ||${walletSecret}||\n\n 🔑 Security Notice: \nThis is the *only time* your private key will be shown\\. Store it securely and do *not* share it with anyone\\. Once this message is deleted, it can not be recovered\\.`,
         {parse_mode: 'MarkdownV2', reply_markup: {
            inline_keyboard: [
                [
                    {text: '🗑️ Close', callback_data: 'delete_message'}
                ]
            ]
         }} 
    
    )
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
          await bot.deleteMessage(chatId, messageId);
        await bot.sendMessage(chatId, '⚠️ An error occurred while creating your wallet.');
        console.error(err)
        return {
            success: false,
            error: err
        }
    }
    
    
}

module.exports = handleWalletCreation;