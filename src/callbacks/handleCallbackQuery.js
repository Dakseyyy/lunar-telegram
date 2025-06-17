const handleWalletCreation = require('./handleWalletCreation/handleWalletCreation')
const handleDeleteMessage = require('./handleMessageDelete/handleMessageDelete');
const startCommand = require('../commands/handlers/start/start');
const handleRefreshMessage = require('./handleRefreshMessage/handleRefreshMessage')
const { solPriceFetcher, getSolPrice} = require('../helper/fetchSolPrice/fetchSolPrice')
solPriceFetcher()

const handleCallbackQuery = async (bot, callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const userId = callbackQuery.from.id;
    const data = callbackQuery.data;
    if (data === 'create_wallet') {
        await handleWalletCreation(chatId, messageId, userId, bot)
    }
    if (data === 'delete_message') {
        await handleDeleteMessage(chatId, messageId, bot)
        await startCommand(bot, callbackQuery)
    }

    if (data === 'refresh') {
        await handleRefreshMessage(bot, callbackQuery, getSolPrice())
        bot.answerCallbackQuery(callbackQuery.id)
    }
}

module.exports = handleCallbackQuery;