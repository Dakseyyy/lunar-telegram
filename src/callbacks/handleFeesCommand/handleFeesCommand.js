const dbClient = require('../../helper/dbConnect/dbClient')
const genFeesMessage = require('./genFeesMessage')
const processUserFees = require('./processUserFees')
const handleFeesCommand = async (bot, callbackQuery) => {
    try {
const userId = callbackQuery.from.id;
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        let updatedFeeSettings = null;
        
        if (callbackQuery.data === 'fees') {

            const userSettings = await processUserFees(userId, 'fees');

            const {slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset} = userSettings;
            const {message, markup} = genFeesMessage(slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset)
            
            bot.editMessageText(message, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: markup
            });

        }
        if (callbackQuery.data === 'back_to_fees') {

            const userSettings = await processUserFees(userId, 'fees');

            const {slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset} = userSettings;
            const {message, markup} = genFeesMessage(slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset)
            
            bot.editMessageText(message, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: markup
            });

        }

        if (callbackQuery.data === 'turbo') {
            const {slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset} = await processUserFees(userId, 'turbo');
            const {message, markup} = genFeesMessage(slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset)
                
            bot.editMessageReplyMarkup(markup, {
            chat_id: chatId,
            message_id: messageId,
        });
                        
        }

         if (callbackQuery.data === 'fast') {
            const {slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset} = await processUserFees(userId, 'fast');
            const {message, markup} = genFeesMessage(slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset)
                
            bot.editMessageReplyMarkup(markup, {
            chat_id: chatId,
            message_id: messageId,
            });
            }

        if (callbackQuery.data === 'mev_protect'){
            const {slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset} = await processUserFees(userId, 'mev_protect');
            const {message, markup} = genFeesMessage(slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset)
            bot.editMessageReplyMarkup(markup, {
            chat_id: chatId,
            message_id: messageId,
            });
            
        }
    } catch(e) {
        console.error(e)
    }
        
            
            
}

module.exports = handleFeesCommand;