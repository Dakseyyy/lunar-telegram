const dbClient = require('../../helper/dbConnect/dbClient')
const genFeeContextMessage = require('./genFeeContextMessage')
const feeInputHandler = require('./feeInputHandler')
const isUserBusy = require('../../memory/isUserBusy/isUserBusy')

const activeHandlers = new Map()
const handleCustomFees = async(bot, callbackQuery) => {
    
    try {
    const handler = feeInputHandler(bot, callbackQuery)
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id;
    const messageId = callbackQuery.message.message_id;
if (callbackQuery.data === 'back_to_fees') {
    isUserBusy.delete(userId);
    const existingHandler = activeHandlers.get(userId);
    if (existingHandler) {
        bot.off('message', existingHandler);
        activeHandlers.delete(userId)
    }
    return;
}
const existingHandler = activeHandlers.get(userId);
        if (existingHandler) {
            bot.off('message', existingHandler);
        }
        isUserBusy.set(userId, true)
        console.log(isUserBusy.get(userId))
        const {message, markup} = genFeeContextMessage(callbackQuery.data)
        bot.editMessageText(message,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'HTML',
            reply_markup: markup
        })
        bot.on('message', handler)
        activeHandlers.set(userId, handler)
    } catch (e) {
        console.error(e.message || e.error)
    }
   
        

}

module.exports = handleCustomFees;