const dbClient = require('../../../helper/dbConnect/dbClient');
const fetchSolBal = require('../../../helper/fetchSolBal/fetchSolBal')
const genStartMessage = require('./genStartMessage')
const startCommand = async (bot, msg, solPrice) => {
    
    const chatId = msg.chat?.id || msg.message.chat.id;
    const userId = msg.from?.id || msg.message.from.id


    try {
    let start = Date.now();
    let userWallet = await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])
    let end = Date.now();

    console.log(`Time taken to fetch user wallet: ${(end - start).toFixed(2)}`)
    if (!userWallet.rows[0]) {
        bot.sendMessage(chatId, `🌙 Welcome to Lunar!\n\nLooks like you are new around here! 👋\n\nTo get started, you'll need a wallet to store your tokens.`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: '🔐 Create Wallet', callback_data: 'create_wallet'}]
                ]
            }
        })
    } else if (userWallet) {
        userWallet = userWallet.rows[0].wallet;
        let start = Date.now();
        let userBalanceSOL = await fetchSolBal(userWallet) || 0
        const userBalanceUSD = userBalanceSOL * solPrice
        let end = Date.now();
        console.log(`Time taken to fetch user balance: ${(end - start).toFixed(2)}`)
        let hasBalance = userBalanceSOL > 0;

        const {message, markup, plainMessage} = await genStartMessage(userWallet, userBalanceSOL, userBalanceUSD.toFixed(5), hasBalance)
        if (msg.message) {
            if (plainMessage !== msg.message.text) {
                await bot.editMessageText( message, {
            chat_id: chatId,
            message_id: msg.message.message_id,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: markup })
            }
            
        
        } else{
            await bot.sendMessage(chatId, message, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: markup
            })
        }
        
    }
    } catch (e) {
        console.error(e)
    } 
    
    
}

module.exports = startCommand;