const dbClient = require("../../helper/dbConnect/dbClient");
const isUserBusy = require("../../memory/isUserBusy/isUserBusy");
const userStates = require("../../memory/userStates/userStates");
const buildMainTransaction = require("../../transactions/buildMainTransaction");

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
            genSellMessages({ userId, chatId, bot, messageId, intent: 'set_quicksell_option' });
        } else if (intent.startsWith('sell_option_')) {
            const presetNumber = callbackQuery.data.replace('sell_option_', '');
            bot.sendMessage(chatId, 'selling with preset: ' + presetNumber);

            const queryOneRow = (text, params) => dbClient.query(text, params).then(res => res.rows[0]);

            const [userTransactionSettings, tokenData, sellOptionPercentagePreset] = await Promise.all([
                queryOneRow('SELECT * FROM user_txn_settings WHERE tg_user_id = $1', [userId]),
                queryOneRow('SELECT * FROM user_mint_data_sells WHERE tg_user_id = $1', [userId]),
                queryOneRow(`SELECT sell_option_${presetNumber} FROM sell_settings WHERE tg_user_id = $1`, [userId])
                    .then(r => r[`sell_option_${presetNumber}`]),
            
            ]);
            const selectedMint = (await dbClient.query('SELECT mint FROM user_mint_data_sells WHERE tg_user_id = $1', [userId])).rows[0].mint;
            const tokensHolding = (await dbClient.query('SELECT tokens_holding FROM user_positions WHERE tg_user_id = $1 AND token_mint_address = $2', [userId, selectedMint])).rows[0].tokens_holding
            if (!userTransactionSettings || !tokenData, !sellOptionPercentagePreset, !tokensHolding) {
                bot.sendMessage(chatId, '⚠️ Unknown error occured.')
                return;
            }
           
            const tokensSelling = (tokensHolding * (sellOptionPercentagePreset / 100));
            console.log(tokensSelling)
            buildMainTransaction({ userId: userId, type: 'sell', tokenData, tokenAmountIn: tokensSelling, bot, chatId, sellOptionPercentagePreset, userTransactionSettings })
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = handleSell;