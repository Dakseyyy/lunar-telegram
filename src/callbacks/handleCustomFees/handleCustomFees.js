const dbClient = require('../../helper/dbConnect/dbClient')
const genFeeContextMessage = require('./genFeeContextMessage')
const feeInputHandler = require('./feeInputHandler')
const isUserBusy = require('../../memory/isUserBusy/isUserBusy')
const userStates = require('../../memory/userStates/userStates')

const handleCustomFees = async(bot, callbackQuery) => {
    
    try {
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id;
    const messageId = callbackQuery.message.message_id;
    if (callbackQuery.data === 'back_to_fees') {
        isUserBusy.delete(userId);
        userStates.delete(chatId)
        console.log(userStates.has(chatId))
        return;
}

        isUserBusy.set(userId, true)
        console.log(callbackQuery.data);
        userStates.set(chatId, {state: callbackQuery.data, toDelete: messageId});
        const {message, markup} = genFeeContextMessage(callbackQuery.data)
        bot.editMessageText(message,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'HTML',
            reply_markup: markup
        })
    } catch (e) {
        console.error(e.message || e.error)
    }
   
        

}

module.exports = handleCustomFees;