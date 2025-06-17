const fetchSolBal = require('../../helper/fetchSolBal/fetchSolBal')
const dbClient = require('../../helper/dbConnect/dbClient')
const genStartMessage = require('../../commands/handlers/start/walletMessage')
const handleRefreshMessage = async (bot, callbackQuery, solPrice) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const userId = callbackQuery.from.id;
    const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

     try {

    let userWallet = await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])
        
        userWallet = userWallet.rows[0].wallet;
        let userBalanceSOL = await fetchSolBal(userWallet)
        const userBalanceUSD = await fetchSolBal(userWallet) * solPrice
        let hasBalance = userBalanceSOL > 0;

        const {message, markup, plainMessage} = await genStartMessage(userWallet, userBalanceSOL, userBalanceUSD.toFixed(5), hasBalance)
        const currentMessage = callbackQuery.message.text;
        console.log(currentMessage)
        console.log('-----')
        console.log(plainMessage)
        console.log('------')
         const newMessagePlain = message.replace(/<[^>]*>/g, '');
        if (currentMessage !== plainMessage) {
            console.log('not the same')
            await bot.editMessageText( message, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: markup
        })
        } else {
            console.log('the same')
        }
        
    
    } catch (e) {
        console.error(e.message || e)
    } 
}

module.exports = handleRefreshMessage;