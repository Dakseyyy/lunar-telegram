const {createWallet} = require('../../helper/createWallet/createWallet');
const dbClient = require('../../helper/dbConnect/dbClient')
const handleWalletCreation = async (chatId, messageId, userId, bot) => {
    const walletExists = await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])
    if (walletExists.rows[0]) {
        await bot.deleteMessage(chatId, messageId);
        return {
            success: false,
            error: 'User already has wallet.'
        }
    }


    try {
    const walletData = await createWallet(`${userId}`);
    const walletAddress = walletData.solanaAddress
    const insertResponse = await dbClient.query('INSERT INTO user_wallets (tg_user_id, wallet) VALUES ($1, $2) RETURNING *', [userId, walletAddress])

    if (insertResponse.rows[0]) {
        await bot.deleteMessage(chatId, messageId);
        await bot.sendMessage(chatId, `Welcome to Lunar! \nYour new wallet is: ${walletAddress}`)
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