const handleWalletCreation = require('./handleWalletCreation/handleWalletCreation')
const handleDeleteMessage = require('./handleMessageDelete/handleMessageDelete');
const startCommand = require('../commands/handlers/start/startCommand');
const handleRefreshMessage = require('./handleRefreshMessage/handleRefreshMessage')
const settingsCommand = require('../commands/handlers/settings/settingsCommand')
const { solPriceFetcher, getSolPrice} = require('../helper/fetchSolPrice/fetchSolPrice')
const handleFeesCommand = require('../callbacks/handleFeesCommand/handleFeesCommand')
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
        await startCommand(bot, callbackQuery, getSolPrice())
        bot.answerCallbackQuery(callbackQuery.id)
    }
    if (data === 'settings') {
        await settingsCommand(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'back_to_start') {
        await startCommand(bot, callbackQuery, getSolPrice());
        bot.answerCallbackQuery(callbackQuery.id)
    }
    if (data === 'fees') {
        await handleFeesCommand(bot, callbackQuery)
        bot.answerCallbackQuery(callbackQuery.id)
    }
    if (data === 'back_to_settings') {
        await settingsCommand(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'turbo') {
        await handleFeesCommand(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'fast') {
        await handleFeesCommand(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'mev_protect'){
        await handleFeesCommand(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
}

module.exports = handleCallbackQuery;