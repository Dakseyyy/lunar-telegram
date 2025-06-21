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
            /*let userSettings = await dbClient.query('SELECT slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset FROM user_txn_settings WHERE tg_user_id = $1', [userId])
             if (!userSettings.rows[0]) {

            const createDefaultSettings = await dbClient.query('INSERT INTO user_txn_settings (tg_user_id) VALUES ($1)', [userId])
            userSettings = await dbClient.query('SELECT slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset FROM user_txn_settings WHERE tg_user_id = $1', [userId])
            const {slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset} = userSettings.rows[0]
            const {message, markup} = genFeesMessage(slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset)
            bot.editMessageText(message, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: markup
            });

        } else if (userSettings.rows[0]) {

            const {slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset} = userSettings.rows[0]
            const {message, markup} = genFeesMessage(slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset)
            bot.editMessageText(message, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: markup
            }); 
            
        }*/


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


           /* updatedFeeSettings = await dbClient.query('SELECT fee_preset FROM user_txn_settings WHERE tg_user_id = $1', [userId])
            if (updatedFeeSettings.rows[0].fee_preset !== 'turbo') {
                updatedFeeSettings = await dbClient.query('UPDATE user_txn_settings SET fee_preset = $1, buy_priority_fee = $2, sell_priority_fee = $3, buy_bribe_fee = $4, sell_bribe_fee = $5 WHERE tg_user_id = $6 RETURNING slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset', ['turbo', 0.0075, 0.0075, 0.0075, 0.0075, userId])
                const {slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset} = updatedFeeSettings.rows[0]
                
                const {message, markup} = genFeesMessage(slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset)
                
                bot.editMessageReplyMarkup(markup, {
                chat_id: chatId,
                message_id: messageId,
            });
            }*/
                        
        }

         if (callbackQuery.data === 'fast') {
            /*updatedFeeSettings = await dbClient.query('SELECT fee_preset FROM user_txn_settings WHERE tg_user_id = $1', [userId])
            if (updatedFeeSettings.rows[0].fee_preset !== 'fast') {
                updatedFeeSettings = await dbClient.query('UPDATE user_txn_settings SET fee_preset = $1, buy_priority_fee = $2, sell_priority_fee = $3, buy_bribe_fee = $4, sell_bribe_fee = $5 WHERE tg_user_id = $6 RETURNING slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset', ['fast', 0.0015, 0.0015, 0.0015, 0.0015, userId])
                const {slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset} = updatedFeeSettings.rows[0]
                const {message, markup} = genFeesMessage(slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset)
                
                bot.editMessageReplyMarkup(markup, {
                chat_id: chatId,
                message_id: messageId,
            }); */
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