const isUserBusy = require("../../memory/isUserBusy/isUserBusy");
const userStates = require("../../memory/userStates/userStates");
const fetchBuySettings = require("./databaseQueries/fetchBuySettings");
const genBuyMessages = require("./genBuyMessages");
const buildMainTransaction = require("../../transactions/buildMainTransaction");
const dbClient = require("../../helper/dbConnect/dbClient");

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
            genBuyMessages({ userId, chatId, bot, messageId, intent: 'set_quickbuy_option' });
        } else if (intent.startsWith('buy_option_')) {
            const presetNumber = callbackQuery.data.replace('buy_option_', '');
            const data = await fetchBuySettings(userId);
            const userTransactionSettings = (await dbClient.query('SELECT * FROM user_txn_settings WHERE tg_user_id = $1', [userId])).rows[0]
            const solAmount = data[`buy_option_${presetNumber}`];
            let tokenData = (await dbClient.query('SELECT * FROM user_mint_data_buys WHERE tg_user_id = $1', [userId])).rows[0];
            console.log(solAmount + 'is our solana amount')
            buildMainTransaction({ userId: userId, type: 'buy', bot, chatId, solAmount, userTransactionSettings, tokenData })
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = handleBuy;