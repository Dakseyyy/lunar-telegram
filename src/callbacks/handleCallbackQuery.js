const handleWalletCreation = require('./handleWalletCreation/handleWalletCreation')
const handleCallbackQuery = async (bot, callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const userId = callbackQuery.from.id;
    const data = callbackQuery.data;
    if (data === 'create_wallet') {
        handleWalletCreation(chatId, messageId, userId, bot)
    }
}

module.exports = handleCallbackQuery;