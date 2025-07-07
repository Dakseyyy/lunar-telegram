const handleWalletCreation = require('./handleWalletCreation/handleWalletCreation')
const handleDeleteMessage = require('./handleMessageDelete/handleMessageDelete');
const startCommand = require('../commands/handlers/start/startCommand');
const handleRefreshMessage = require('./handleRefreshMessage/handleRefreshMessage')
const {handleAutobuy} = require('./handleAutobuy/handleAutobuy')
const {settingsCommand} = require('../commands/handlers/settings/settingsCommand')
const { solPriceFetcher, getSolPrice} = require('../helper/fetchSolPrice/fetchSolPrice')
const handleFeesCommand = require('../callbacks/handleFeesCommand/handleFeesCommand')
const handleCustomFees = require('../callbacks/handleCustomFees/handleCustomFees')
const referralCommand = require('../commands/handlers/referrals/referralsCommand')
const updateReferralCode = require('../commands/handlers/referrals/updateReferralCode/updateReferralCode')
const positionsCommand = require('../commands/handlers/positions/positionsCommand')
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
        await startCommand(bot, callbackQuery, getSolPrice(), 'send')
    }
    if (data === 'silent_delete_message'){
        await handleDeleteMessage(chatId, messageId, bot)
    }
    if (data === 'silent_delete_message_and_go_start') {
        await handleDeleteMessage(chatId, messageId, bot)
        await startCommand(bot, callbackQuery, getSolPrice(), 'send')
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
    if (data === 'back_to_settings_from_autobuy') {
        await settingsCommand(bot, callbackQuery);
        await handleAutobuy(bot, callbackQuery)
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
    } if (data === 'slippage') {
        await handleCustomFees(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'buy_priority_fee') {
        await handleCustomFees(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'sell_priority_fee') {
        await handleCustomFees(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'buy_bribe_fee') {
        await handleCustomFees(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'sell_bribe_fee') {
        await handleCustomFees(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'back_to_fees'){
        await handleCustomFees(bot, callbackQuery)
         await handleFeesCommand(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'withdraw_protection'){
        await settingsCommand(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'autobuy'){
        await handleAutobuy(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id)
    }
    if (data === 'referrals') {
        await referralCommand(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'update_referral_code') {

        await updateReferralCode(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'cancel_update_referral_code') {
        await updateReferralCode(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
    if (data === 'positions') {
        await positionsCommand(bot, callbackQuery);
        bot.answerCallbackQuery(callbackQuery.id);
    }
}

module.exports = handleCallbackQuery;