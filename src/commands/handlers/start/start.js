const dbClient = require('../../../helper/dbConnect/dbClient');

const startCommand = async (bot, msg) => {
    

    const chatId = msg.chat?.id || msg.message.chat.id;
    const userId = msg.from?.id || msg.message.from.id
    try {
    let userWallet = await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])
    userWallet = userWallet.rows[0].wallet;
    if (!userWallet) {
        bot.sendMessage(chatId, `🌙 Welcome to Lunar!\n\nLooks like you are new around here! 👋\n\nTo get started, you'll need a wallet to store your tokens.`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: '🔐 Create Wallet', callback_data: 'create_wallet'}]
                ]
            }
        })
    } else if (userWallet) {
        bot.sendMessage(chatId, `🌙Welcome to Lunar\\! \n\nYour trading journey starts here\\. \n\nWallet: \`${userWallet}\`\n[🡕 Solscan](https://solscan.io/account/${userWallet}) • _Tap to copy_\nBalance: \`0 SOL\`\\($0\\.00 USD\\)\n\n🔴 You currently have no SOL\\. \nTo begin trading, deposit SOL into your wallet\\.`, {
            parse_mode: 'MarkdownV2',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: 'Buy', callback_data: 'buy'},
                        { text: 'Sell', callback_data: 'sell'}
                    ]
                ]
            }
        })
    }
    } catch (e) {
        console.error(e)
    } 
    
    
}

module.exports = startCommand;