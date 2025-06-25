const dbClient = require('../../helper/dbConnect/dbClient')
const isValidNumber = require('../../helper/isValidNumber/isValidNumber')
const genFeesMessage = require('../handleFeesCommand/genFeesMessage')
const processUserFees = require('../handleFeesCommand/processUserFees')
const genFeeContextMessage = require('./genFeeContextMessage')
const isUserBusy = require('../../memory/isUserBusy/isUserBusy')
const userStates = require('../../memory/userStates/userStates')
const feeInputHandler = async (bot, msg, context) => {
    console.log('processing input...')
    const chatId = msg.chat.id
    let messageId = userStates.get(chatId)?.toDelete;
    let canDelete = true;
    console.log(userStates.get(chatId))
    const userId = msg.from.id;
        try {
            if (isValidNumber(msg.text)){
                const userInput = parseFloat(msg.text)
                if (context !== 'slippage' && userInput < 0.00001) { // transaction fee formatting

                const {markup} = genFeeContextMessage('wrong_input')
                await bot.sendMessage(chatId, '⚠️ Can not be less than 0.00001 SOL', {reply_markup: markup})
                return;

            
                }
                if (context === 'slippage' && userInput < 1) { // slippage formatting

                const {markup} = genFeeContextMessage('wrong_input')
                await bot.sendMessage(chatId, '⚠️ Slippage must be greater than 1%', {reply_markup: markup})
                return;

                }
                const userSettings = await processUserFees(userId, context, userInput);
                if (canDelete !== false) {
                    await bot.deleteMessage(chatId, messageId);
                    canDelete = false;
                }
                const {slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset} = userSettings;
                const {message, markup} = genFeesMessage(slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset);
                await bot.sendMessage(chatId, message, {
                    parse_mode: 'HTML',
                    reply_markup: markup
                })
                userStates.delete(chatId)
                isUserBusy.delete(userId)
                } else {
                
               
                
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

module.exports = feeInputHandler