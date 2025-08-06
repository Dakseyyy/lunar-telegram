const isUserBusy = require("../../memory/isUserBusy/isUserBusy");
const userStates = require("../../memory/userStates/userStates");
const fetchBuySettings = require("./databaseQueries/fetchBuySettings");
const genBuyMessages = require("./genBuyMessages");

async function handleBuy(bot, callbackQuery, intent) {
    try {
        const userId = callbackQuery.from.id;
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        if (intent === 'default') {
            isUserBusy.delete(chatId);
            userStates.delete(chatId);
            const data = await fetchBuySettings(userId);
            genBuyMessages({ userId, chatId, bot, messageId, intent: 'default', data });
            return;
        } else if (intent === 'set_contract_address') {
            isUserBusy.set(chatId, true);
            userStates.set(chatId, { state: intent, toDelete: messageId });
            genBuyMessages({ userId, chatId, bot, messageId, intent: 'set_contract_address' });
            return;
        } else if (intent === 'set_custom_sol') {

            isUserBusy.set(chatId, true);
            userStates.set(chatId, { state: intent, toDelete: messageId });
            genBuyMessages({ userId, chatId, bot, messageId, intent: 'set_custom_sol' });
            return;
        } else if (intent === 'edit_buy_options') {
            isUserBusy.set(chatId, true);
            userStates.set(chatId, { state: intent, toDelete: messageId });
            const data = await fetchBuySettings(userId);
            genBuyMessages({ userId, chatId, bot, messageId, intent: 'edit_buy_options', data });

            return;
        } else if (intent.startsWith('edit_buy_option_')) {
            const presetNumber = callbackQuery.data.replace('edit_buy_option_', '');
            console.log(presetNumber)
            isUserBusy.set(chatId, true);
            userStates.set(chatId, { state: intent, toDelete: messageId, presetNumber });
            genBuyMessages({ userId, chatId, bot, messageId, intent: 'set_quickbuy_option'});
        } else if (intent.startsWith('buy_option_')) {
            const presetNumber = callbackQuery.data.replace('buy_option_', '');
            bot.sendMessage(chatId, 'buying with preset: ' + presetNumber)
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = handleBuy;