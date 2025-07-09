const userStates = require('../../memory/userStates/userStates')
const genFeeContextMessage = require('../handleCustomFees/genFeeContextMessage');
const updateCopytradeSettings = async (bot, msg, context) => {
    try {
        const chatId = msg.chat?.id || msg.message.chat.id;
        const userId = msg.from?.id || msg.message.from.id;
        if (context.startsWith('change_buy_prio_')) {
            const profileId = context.replace('show_profile_', '');
            const {message, markup} = genFeeContextMessage('buy_priority_fee', 'copytrade')
            const editedMessage = await bot.editMessageText(message, {
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: markup
            });
            userStates.set(chatId, {
                state: 'copytrade_prio_buy',
                messageToDelete: editedMessage.message_id
            })

    }
    } catch (e) {
        console.error(e)
    }
}

module.exports = updateCopytradeSettings;