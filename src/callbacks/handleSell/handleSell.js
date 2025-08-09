const isUserBusy = require("../../memory/isUserBusy/isUserBusy");
const userStates = require("../../memory/userStates/userStates");
const buildMainTransaction = require("../handleBuy/transactionBuilding/buildMainTransaction");
const fetchSellSettings = require("./databaseQueries/fetchSellSettings");
const genSellMessages = require("./genSellMessages");

async function handleSell(bot, callbackQuery, intent) {
    try {
        const userId = callbackQuery.from.id;
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        if (intent === 'default') {
            isUserBusy.delete(chatId);
            userStates.delete(chatId);
            const data = await fetchSellSettings(userId);
            genSellMessages({ userId, chatId, bot, messageId, intent: 'default', data });
            return;
        } else if (intent === 'set_contract_address_sell') {
            isUserBusy.set(chatId, true);
            userStates.set(chatId, { state: intent, toDelete: messageId });
            genSellMessages({ userId, chatId, bot, messageId, intent: 'set_contract_address_sell' });
            return;
        } else if (intent === 'set_custom_percent') {

            isUserBusy.set(chatId, true);
            userStates.set(chatId, { state: intent, toDelete: messageId });
            genSellMessages({ userId, chatId, bot, messageId, intent: 'set_custom_percent' });
            return;
        } else if (intent === 'edit_sell_options') {
            isUserBusy.set(chatId, true);
            userStates.set(chatId, { state: intent, toDelete: messageId });
            const data = await fetchSellSettings(userId);
            genSellMessages({ userId, chatId, bot, messageId, intent: 'edit_sell_options', data });

            return;
        } else if (intent.startsWith('edit_sell_option_')) {
            const presetNumber = callbackQuery.data.replace('edit_sell_option_', '');
            console.log(presetNumber)
            isUserBusy.set(chatId, true);
            userStates.set(chatId, { state: intent, toDelete: messageId, presetNumber });
            genSellMessages({ userId, chatId, bot, messageId, intent: 'set_quicksell_option'});
        } else if (intent.startsWith('sell_option_')) {
            const presetNumber = callbackQuery.data.replace('sell_option_', '');
            bot.sendMessage(chatId, 'selling with preset: ' + presetNumber)
             buildMainTransaction({userId: userId, type: 'sell'})
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = handleSell;