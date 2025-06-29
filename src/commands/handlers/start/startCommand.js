const getWallet = require('./getWallet');
const fetchSolBal = require('../../../helper/fetchSolBal/fetchSolBal')
const genStartMessage = require('./genStartMessage')
const processReferral = require('../referrals/processReferral')
const startCommand = async (bot, msg, solPrice, context) => {
    
    const chatId = msg.chat?.id || msg.message.chat.id;
    const userId = msg.from?.id || msg.message.from.id
    try {
        const userWallet = await getWallet(userId)

        if (/^\/start\s+.+/.test(msg.text)) {
            processReferral(bot, msg)
        }


    if (userWallet.hasWallet === false) {
        const {message, markup} = genStartMessage(null, null, null, null, 'new_user')
        bot.sendMessage(chatId, message, {
            reply_markup: markup
        });

    } else if (userWallet.hasWallet === true) {
        let start = Date.now();
        let userBalanceSOL = await fetchSolBal(userWallet.walletAddress) || 0
        const userBalanceUSD = userBalanceSOL * solPrice
        let end = Date.now();
        console.log(`Time taken to fetch user balance: ${(end - start).toFixed(2)}`)
        let hasBalance = userBalanceSOL > 0;

        const {message, markup, plainMessage} = await genStartMessage(userWallet.walletAddress, userBalanceSOL, userBalanceUSD.toFixed(5), hasBalance, 'existing_user')
        if (msg.message && context !== 'send') {
            if (plainMessage !== msg.message.text) {
                await bot.editMessageText( message, {
            chat_id: chatId,
            message_id: msg.message.message_id,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: markup })
            }
            
        
        } else if (context === 'send'){
            
            await bot.sendMessage(chatId, message, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: markup
            })
        } else {
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