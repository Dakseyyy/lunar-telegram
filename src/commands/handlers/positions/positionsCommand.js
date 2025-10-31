const dbClient = require('../../../helper/dbConnect/dbClient')
const genPositionsMessage = require('./genPositionsMessage');
const currentPositionPageMap = new Map();
const positionsCommand = async (bot, msg) => {
    try {
        const chatId = msg.chat?.id || msg.message.chat.id;
        const userId = msg.from?.id || msg.message.from.id;
        let pageNumber = currentPositionPageMap.get(userId);
        if (pageNumber == null) {
            currentPositionPageMap.set(userId, 0);
            pageNumber = 0;
        }
        if (msg.data.startsWith('positions_')) {
            pageNumber = parseInt(msg.data.replace('positions_', ''), 10)
            console.log(pageNumber)
        }



        const userPositions = await dbClient.query(`SELECT * FROM user_positions WHERE tg_user_id = $1 ORDER BY created_at DESC LIMIT 2 OFFSET ${pageNumber * 2}`, [userId]);
        if (!userPositions.rows[0]) {
            const { positions_message, positions_markup } = await genPositionsMessage('no_positions', 'x', pageNumber);
            console.log(genPositionsMessage('no_positions'))
            msg.message ? bot.editMessageText(positions_message, { chat_id: chatId, chatId, message_id: msg.message.message_id, ...positions_markup }) : bot.sendMessage(chatId, positions_message, positions_markup)
        } else if (userPositions.rows[0]) {

            const { positions_message, positions_markup } = await genPositionsMessage('show_positions', userPositions.rows, pageNumber);
            msg.message ? bot.editMessageText(positions_message, { chat_id: chatId, chatId, message_id: msg.message.message_id, ...positions_markup }) : bot.sendMessage(chatId, positions_message, positions_markup)
        } else {
            const { positions_message, positions_markup } = await genPositionsMessage('no_positions', 'x', pageNumber);
            msg.message ? bot.editMessageText(positions_message, { chat_id: chatId, chatId, message_id: msg.message.message_id, ...positions_markup }) : bot.sendMessage(chatId, positions_message, positions_markup)
        }
    } catch (e) {
        console.error(e)
    }

}
module.exports = positionsCommand;