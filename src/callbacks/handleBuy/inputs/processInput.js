const { PublicKey } = require("@solana/web3.js");
const isValidCA = require("../checks/isValidCA");
const dbClient = require("../../../helper/dbConnect/dbClient");
const genBuyMessages = require("../genBuyMessages");
const userStates = require("../../../memory/userStates/userStates");
const isValidNumber = require("../../../helper/isValidNumber/isValidNumber");
const isUserBusy = require("../../../memory/isUserBusy/isUserBusy");
const getMetadata = require("../../../transactions/getMetadata");
const buildMainTransaction = require("../../../transactions/buildMainTransaction");


async function processInput({ msg, bot, intent }) {
    try {
        const chatId = msg.chat.id
        const userId = msg.from.id
        const messageId = userStates.get(chatId)?.toDelete;
        console.log(intent)
        if (intent === 'set_contract_address') {
            if (isValidCA(msg.text) === true) {
                const [newData, metadata] = await Promise.all([
                    (await dbClient.query('UPDATE buy_settings SET contract_address = $1 WHERE tg_user_id = $2 RETURNING *', [msg.text, userId])).rows[0],
                    await getMetadata(msg.text)
                ])


                bot.deleteMessage(chatId, messageId)
                genBuyMessages({ messageId, chatId, data: newData, intent: 'default_send', bot });
                await dbClient.query('DELETE FROM user_mint_data_buys WHERE tg_user_id = $1', [userId])
                dbClient.query('INSERT INTO user_mint_data_buys (tg_user_id, ticker, name, authority, mint) VALUES ($1, $2, $3, $4, $5)', [userId, metadata.ticker, metadata.name, metadata.authority, msg.text])
                isUserBusy.delete(chatId);
                userStates.delete(chatId);
                return;
            } else {
                genBuyMessages({ intent: 'wrong_ca_input', bot, chatId })
            }
        } else if (intent === 'edit_buy_option') {
            if (isValidNumber(msg.text)) {
                const newData = (await dbClient.query(`UPDATE buy_settings SET buy_option_${userStates.get(chatId)?.presetNumber} = $1 WHERE tg_user_id = $2 RETURNING *`, [parseFloat(msg.text), userId])).rows[0];
                isUserBusy.delete(chatId);
                userStates.delete(chatId);
                bot.deleteMessage(chatId, messageId)
                genBuyMessages({ messageId, chatId, data: newData, intent: 'edit_buy_options_send', bot });
            } else {
                genBuyMessages({ intent: 'wrong_number_input', bot, chatId })
            }
        }
        else if (intent === 'set_custom_sol') {
            if (isValidNumber(msg.text)) {
                const data = (await dbClient.query('SELECT * FROM buy_settings WHERE tg_user_id = $1', [userId])).rows[0];
                await genBuyMessages({ messageId, chatId, data, intent: 'default_send', bot });
                await bot.sendMessage(chatId, 'Buying with sol amount: ' + parseFloat(msg.text));
                const userTransactionSettings = (await dbClient.query('SELECT * FROM user_txn_settings WHERE tg_user_id = $1', [userId])).rows[0]
                let tokenData = (await dbClient.query('SELECT * FROM user_mint_data_buys WHERE tg_user_id = $1', [userId])).rows[0];
                buildMainTransaction({ userId: userId, type: 'buy', bot, chatId, solAmount: parseFloat(msg.text), userTransactionSettings, tokenData })
                isUserBusy.delete(chatId);
                userStates.delete(chatId);
            } else {
                genBuyMessages({ intent: 'wrong_number_input', bot, chatId })
            }
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = processInput;