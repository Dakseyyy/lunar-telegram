const getWallet = require('./getWallet');
const fetchSolBal = require('../../../helper/fetchSolBal/fetchSolBal')
const genStartMessage = require('./genStartMessage')
const processReferral = require('../referrals/processReferral')
const startCommand = async (bot, msg, solPrice) => {
    
    const chatId = msg.chat?.id || msg.message.chat.id;
    const userId = msg.from?.id || msg.message.from.id
    try {
        const userWallet = await getWallet(userId)

        if (/^\/start\s+.+/.test(msg.text)) {
            processReferral(msg.text)
        }


    if (userWallet.hasWallet === false) {
        bot.sendMessage(chatId, `🌙 Welcome to Lunar!\n\nLooks like you are new around here! 👋\n\nTo get started, you'll need a wallet to store your tokens.`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: '🔐 Create Wallet', callback_data: 'create_wallet'}]
                ]
            }
        })
    } else if (userWallet.hasWallet === true) {
        let start = Date.now();
        let userBalanceSOL = await fetchSolBal(userWallet.walletAddress) || 0
        const userBalanceUSD = userBalanceSOL * solPrice
        let end = Date.now();
        console.log(`Time taken to fetch user balance: ${(end - start).toFixed(2)}`)
        let hasBalance = userBalanceSOL > 0;

        const {message, markup, plainMessage} = await genStartMessage(userWallet.walletAddress, userBalanceSOL, userBalanceUSD.toFixed(5), hasBalance)
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