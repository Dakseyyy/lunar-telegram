const isValidCA = require('./isValidCA')
const autobuy = (bot, callbackQuery) => {
    return async function autobuyHandler(msg) {
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id
    const messageId = callbackQuery.message.message_id;
    if (isValidCA(msg.text)) {
        bot.sendMessage(chatId, 'buying...')
    } else {
        return;
    }
    }
}

module.exports = autobuy;