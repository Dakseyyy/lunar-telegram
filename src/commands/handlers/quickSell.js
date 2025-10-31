const dbClient = require("../../helper/dbConnect/dbClient");
const buildMainTransaction = require("../../transactions/buildMainTransaction");

async function quickSell({ bot, userId, chatId, messageId, }) {
    try {
        const queryOneRow = (text, params) => dbClient.query(text, params).then(res => res.rows[0]);

        const [userTransactionSettings, tokenData] = await Promise.all([
            queryOneRow('SELECT * FROM user_txn_settings WHERE tg_user_id = $1', [userId]),
            queryOneRow('SELECT * FROM user_mint_data_sells WHERE tg_user_id = $1', [userId]),
           

        ]);
        const selectedMint = (await dbClient.query('SELECT mint FROM user_mint_data_sells WHERE tg_user_id = $1', [userId])).rows[0].mint;
        const tokensHolding = (await dbClient.query('SELECT tokens_holding FROM user_positions WHERE tg_user_id = $1 AND token_mint_address = $2', [userId, selectedMint])).rows[0].tokens_holding
        if (!userTransactionSettings || !tokenData, !tokensHolding) {
            bot.sendMessage(chatId, '⚠️ Unknown error occured.')
            return;
        }
        
       
        const tokensSelling = tokensHolding;
        console.log(tokensSelling)
        buildMainTransaction({ userId: userId, type: 'sell', tokenData, tokenAmountIn: tokensSelling, bot, chatId, sellOptionPercentagePreset: 100 })
        
    } catch (e) {
        console.error(e);
    }
}

module.exports = quickSell;