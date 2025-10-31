const { PublicKey } = require("@solana/web3.js");
const isValidCA = require("../checks/isValidCA");
const dbClient = require("../../../helper/dbConnect/dbClient");
const genSellMessages = require("../genSellMessages");
const userStates = require("../../../memory/userStates/userStates");
const isValidNumber = require("../../../helper/isValidNumber/isValidNumber");
const isUserBusy = require("../../../memory/isUserBusy/isUserBusy");
const buildMainTransaction = require("../../../transactions/buildMainTransaction");


async function processInputSells({ msg, bot, intent }) {
    try {
        const chatId = msg.chat.id
        const userId = msg.from.id
        const messageId = userStates.get(chatId)?.toDelete;
        console.log('we are selling!')
        if (intent === 'set_contract_address_sell') {
            if (isValidCA(msg.text) === true) {
                const newData = (await dbClient.query('UPDATE sell_settings SET contract_address = $1 WHERE tg_user_id = $2 RETURNING *', [msg.text, userId])).rows[0];
                bot.deleteMessage(chatId, messageId)
                genSellMessages({ messageId, chatId, data: newData, intent: 'default_send', bot });
                return;
            } else {
                genSellMessages({ intent: 'wrong_ca_input', bot, chatId })
            }
        } else if (intent === 'edit_sell_option') {
            if (isValidNumber(msg.text)) {
                if (parseFloat(msg.text) > 100 || parseFloat(msg.text) < 1) {
                    await bot.sendMessage(chatId, '⚠️ The sell percent must be greater than 1% and less than 100%.');
                    return;
                }
                const newData = (await dbClient.query(`UPDATE sell_settings SET sell_option_${userStates.get(chatId)?.presetNumber} = $1 WHERE tg_user_id = $2 RETURNING *`, [parseFloat(msg.text), userId])).rows[0];
                isUserBusy.delete(chatId);
                userStates.delete(chatId);
                bot.deleteMessage(chatId, messageId)
                genSellMessages({ messageId, chatId, data: newData, intent: 'edit_sell_options_send', bot });
            } else {
                genSellMessages({ intent: 'wrong_number_input', bot, chatId })
            }
        }
        else if (intent === 'set_custom_percent') {
            if (isValidNumber(msg.text)) {
                if (msg.text < 0.0001) {
                    genSellMessages({ bot, chatId, error_reason: '⚠️ Sell amount must be greater than 0.0001 SOL', intent: 'custom_error' })
                    return;
                }
                const data = (await dbClient.query('SELECT * FROM sell_settings WHERE tg_user_id = $1', [userId])).rows[0];
                await genSellMessages({ messageId, chatId, data, intent: 'default_send', bot });
                await bot.sendMessage(chatId, 'Selling with sol amount: ' + parseFloat(msg.text));
                const userTransactionSettings = (await dbClient.query('SELECT * FROM user_txn_settings WHERE tg_user_id = $1', [userId])).rows[0]
                let tokenData = (await dbClient.query('SELECT * FROM user_mint_data_buys WHERE tg_user_id = $1', [userId])).rows[0];
                buildMainTransaction({ userId: userId, type: 'sell', bot, chatId, solAmount: parseFloat(msg.text), userTransactionSettings, tokenData })
                isUserBusy.delete(chatId);
                userStates.delete(chatId);
            } else {
                genSellMessages({ intent: 'wrong_number_input', bot, chatId })
            }
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = processInputSells;