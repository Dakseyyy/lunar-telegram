const dbClient = require('../../../helper/dbConnect/dbClient');
const fetchSolBal = require('../../../helper/fetchSolBal/fetchSolBal')
const genStartMessage = require('./walletMessage')
const startCommand = async (bot, msg, solPrice) => {
    
    const chatId = msg.chat?.id || msg.message.chat.id;
    const userId = msg.from?.id || msg.message.from.id


    try {

    let userWallet = await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])

    if (!userWallet) {
        bot.sendMessage(chatId, `🌙 Welcome to Lunar!\n\nLooks like you are new around here! 👋\n\nTo get started, you'll need a wallet to store your tokens.`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: '🔐 Create Wallet', callback_data: 'create_wallet'}]
                ]
            }
        })
    } else if (userWallet) {
        
        userWallet = userWallet.rows[0].wallet;
        let userBalanceSOL = await fetchSolBal(userWallet)
        const userBalanceUSD = await fetchSolBal(userWallet) * solPrice
        let hasBalance = userBalanceSOL > 0;

        const {message, markup} = await genStartMessage(userWallet, userBalanceSOL, userBalanceUSD.toFixed(5), hasBalance)
        
        await bot.sendMessage(chatId, message, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: markup
        })
    }
    } catch (e) {
        console.error(e)
    } 
    
    
}

module.exports = startCommand;