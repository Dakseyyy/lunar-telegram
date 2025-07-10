const isUserBusy = require('../../memory/isUserBusy/isUserBusy');
const userStates = require('../../memory/userStates/userStates')
const genFeeContextMessage = require('../handleCustomFees/genFeeContextMessage');
const genCopyTradeMessage = require('./genCopytradeMessage');
const processCopytradeInput = require('./processCopytradeInput');
const updateCopytradeSettings = async (bot, msg, context) => {
    try {
        const chatId = msg.chat?.id || msg.message.chat.id;
        const userId = msg.from?.id || msg.message.from.id;
        
        console.log('called updatecopytrade')
        if (context.startsWith('change_buy_prio_')) {
            const profileId = context.replace('change_buy_prio_', '');
            isUserBusy.set(userId, true);
            const {message, markup} = genFeeContextMessage('buy_priority_fee', 'copytrade', profileId)
            const editedMessage = await bot.editMessageText(message, {
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: markup
            });
            userStates.set(chatId, {
                state: 'priority_fee_buy',
                messageToDelete: editedMessage.message_id,
                userId,
                profileId

            })

    }
    if (context.startsWith('change_sell_prio_')) {
            const profileId = context.replace('change_sell_prio_', '');
            const {message, markup} = genFeeContextMessage('sell_priority_fee', 'copytrade', profileId)
            const editedMessage = await bot.editMessageText(message, {
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: markup
            });
            userStates.set(chatId, {
                state: 'priority_fee_sell',
                messageToDelete: editedMessage.message_id,
                userId,
                profileId

            })
            isUserBusy.set(userId, true);

    }
    if (context.startsWith('change_buy_bribe_')) {
            const profileId = context.replace('change_buy_bribe_', '');
            const {message, markup} = genFeeContextMessage('buy_bribe_fee', 'copytrade', profileId)
            const editedMessage = await bot.editMessageText(message, {
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: markup
            });
            userStates.set(chatId, {
                state: 'bribe_fee_buys',
                messageToDelete: editedMessage.message_id,
                userId,
                profileId

            })
            isUserBusy.set(userId, true);

    }
    if (context.startsWith('change_sell_bribe_')) {
            const profileId = context.replace('change_sell_bribe_', '');
            const {message, markup} = genFeeContextMessage('sell_bribe_fee', 'copytrade', profileId)
            const editedMessage = await bot.editMessageText(message, {
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: markup
            });
            userStates.set(chatId, {
                state: 'bribe_fee_sells',
                messageToDelete: editedMessage.message_id,
                userId,
                profileId

            })
            isUserBusy.set(userId, true);
    }
    if (context.startsWith('change_slippage_')) {
            const profileId = context.replace('change_slippage_', '');
            const {message, markup} = genFeeContextMessage('slippage', 'copytrade', profileId)
            const editedMessage = await bot.editMessageText(message, {
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: markup
            });
            userStates.set(chatId, {
                state: 'slippage',
                messageToDelete: editedMessage.message_id,
                userId,
                profileId,
                intent: 'copytrades'

            })
            isUserBusy.set(userId, true);
    }
    if (context.startsWith('change_wallet_')) {
            const profileId = context.replace('change_wallet_', '');
            const {copytrade_message, copytrade_markup} = genCopyTradeMessage('copytrade_wallet', null, null, profileId)
            const editedMessage = await bot.editMessageText(copytrade_message, {
                chat_id: chatId,
                message_id: msg.message.message_id,
                ...copytrade_markup
            });
            userStates.set(chatId, {
                state: 'copytrade_wallet',
                messageToDelete: editedMessage.message_id,
                userId,
                profileId,
                intent: 'copytrades'

            })
            isUserBusy.set(userId, true);
    }
    if (context.startsWith('change_buy_amount_')) {
         const profileId = context.replace('change_buy_amount_', '');
            const {copytrade_message, copytrade_markup} = genCopyTradeMessage('buy_amount', null, null, profileId)
            const editedMessage = await bot.editMessageText(copytrade_message, {
                chat_id: chatId,
                message_id: msg.message.message_id,
                ...copytrade_markup
            });
            userStates.set(chatId, {
                state: 'buy_amount',
                messageToDelete: editedMessage.message_id,
                userId,
                profileId,
                intent: 'copytrades'

            })
            isUserBusy.set(userId, true);
    }
    if (context.startsWith('toggle_active')) {
       const profileId = context.replace('toggle_active_', '');
       processCopytradeInput(bot, msg, 'toggle_active', profileId, msg.message.message_id)
       
    }
    } catch (e) {
        console.error(e)
    }
}

module.exports = updateCopytradeSettings;