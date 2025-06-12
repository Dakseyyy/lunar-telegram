const dbClient = require('../../../helper/dbConnect/dbClient');

const startCommand = async (bot, msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id
    let resolveUser = await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])
    resolveUser = resolveUser.rows[0];
    if (!resolveUser) {
        bot.sendMessage(chatId, `🌙 Welcome to Lunar!\n\nLooks like you are new around here! 👋\n\nTo get started, you'll need a wallet to store your tokens.`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: '🔐 Create Wallet', callback_data: 'create_wallet'}]
                ]
            }
        })
    } else if (resolveUser) {
        bot.sendMessage(chatId, 'You already have a wallet!')
    }
    
    
}

module.exports = startCommand;