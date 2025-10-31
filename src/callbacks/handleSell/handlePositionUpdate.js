const dbClient = require("../../helper/dbConnect/dbClient");
const getMetadata = require("../../transactions/getMetadata");
const genSellMessages = require("./genSellMessages");

async function handlePositionUpdate(bot, callbackQuery) {
    try {
        const userId = callbackQuery.from.id;
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const position_contract_address = callbackQuery.data.replace('position_id_', '');
        const current_position_contract_address = (await dbClient.query('SELECT * FROM sell_settings WHERE tg_user_id = $1', [userId])).rows[0].contract_address;
        if (position_contract_address === current_position_contract_address) {
            return;
        }
        const sellSettings = (await dbClient.query('UPDATE sell_settings SET contract_address = $1 WHERE tg_user_id = $2 RETURNING *', [position_contract_address, userId])).rows[0];
        const metadata = await getMetadata(position_contract_address);
        await dbClient.query('DELETE FROM user_mint_data_sells WHERE tg_user_id = $1', [userId])
        await dbClient.query('INSERT INTO user_mint_data_sells (tg_user_id, ticker, name, authority, mint) VALUES ($1, $2, $3, $4, $5)', [userId, metadata.ticker, metadata.name, metadata.authority, position_contract_address])
        console.log(sellSettings)
        genSellMessages({ intent: 'default', data: sellSettings, messageId, chatId, bot, userId });

    } catch (e) {
        console.error(e);
    }
}

module.exports = handlePositionUpdate