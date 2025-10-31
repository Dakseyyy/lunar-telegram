const buildMainTransaction = require('../../transactions/buildMainTransaction')
const getMetadata = require('../../transactions/getMetadata')
const dbClient = require('../dbConnect/dbClient')
const isValidCA = require('./isValidCA')
const autobuy = async (bot, msg) => {

    try {

        const chatId = msg.chat.id
        const userId = msg.from.id

        if (isValidCA(msg.text)) {
            const solAmount = (await dbClient.query('SELECT buy_amount FROM user_autobuy_settings WHERE tg_user_id = $1', [userId])).rows[0].buy_amount;

            const userTransactionSettings = (await dbClient.query('SELECT * FROM user_txn_settings WHERE tg_user_id = $1', [userId])).rows[0]
            let tokenData = await getMetadata(msg.text);
            tokenData = {...tokenData, mint: msg.text}
            console.log(solAmount + 'is our solana amount')
            buildMainTransaction({ userId: userId, type: 'buy', bot, chatId, solAmount, userTransactionSettings, tokenData })
            
        } else {

            return;
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports = autobuy;