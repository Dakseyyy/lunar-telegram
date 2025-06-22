const dbClient = require('../../helper/dbConnect/dbClient')
const isValidNumber = require('../../helper/isValidNumber/isValidNumber')
const genFeesMessage = require('../handleFeesCommand/genFeesMessage')
const processUserFees = require('../handleFeesCommand/processUserFees')
const genFeeContextMessage = require('./genFeeContextMessage')
const isUserBusy = require('../../memory/isUserBusy/isUserBusy')
const feeInputHandler = (bot, callbackQuery) => {
    
const chatId = callbackQuery.message.chat.id;
    let messageId = callbackQuery.message.message_id;
    const context = callbackQuery.data
    return async function handler(msg) {
        try {
            if (isValidNumber(msg.text)){
                const userInput = parseFloat(msg.text)
        if (context !== 'slippage' && userInput < 0.00001) {
            if (messageId !== null) {
                await bot.deleteMessage(chatId, messageId)
                messageId = null;
                const {markup} = genFeeContextMessage('wrong_input')
                await bot.sendMessage(chatId, '⚠️ Can not be less than 0.00001 SOL', {reply_markup: markup})
                return;
            }
            
        }
            if (context === 'slippage' && userInput < 1) {
                 if (messageId !== null) {
                await bot.deleteMessage(chatId, messageId)
                messageId = null;
                const {markup} = genFeeContextMessage('wrong_input')
                await bot.sendMessage(chatId, '⚠️ Slippage must be greater than 1%', {reply_markup: markup})
                return;
            }
            }
            const userSettings = await processUserFees(callbackQuery.from.id, context, userInput);
            if (messageId !== null) {
                await bot.deleteMessage(chatId, messageId);
            }
            const {slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset} = userSettings;
            const {message, markup} = genFeesMessage(slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset);
            await bot.sendMessage(chatId, message, {
                parse_mode: 'HTML',
                reply_markup: markup
            })
            bot.off('message', handler)
            isUserBusy.delete(callbackQuery.from.id)
            } else {
                
                if (messageId !== null) {
                    await bot.deleteMessage(chatId, messageId)
                    messageId = null;
                }
                
                const {message, markup} = genFeeContextMessage('wrong_input');
                await bot.sendMessage(chatId, message, {
                    reply_markup: markup,
                    parse_mode: 'HTML'
                })
            }
        }
        catch (e) {
        console.error(e)
    }

    } 
    
}

module.exports = feeInputHandler