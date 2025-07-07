const dbClient = require('../../../helper/dbConnect/dbClient')
const genPositionsMessage = require('./genPositionsMessage');
const positionsCommand = async (bot, msg) => {
    const chatId = msg.chat?.id || msg.message.chat.id;
    const userId = msg.from?.id || msg.message.from.id;
    const userPositions = await dbClient.query('SELECT * FROM user_positions WHERE tg_user_id = $1', [userId]);

    if (!userPositions.rows[0]) {
        const {positions_message, positions_markup} = genPositionsMessage('no_positions');
        console.log(genPositionsMessage('no_positions'))
        msg.message ? bot.editMessageText(positions_message, {chat_id: chatId, chatId, message_id: msg.message.message_id, ...positions_markup}) : bot.sendMessage(chatId, positions_message, positions_markup)
    } else if (!userPositions.rows[0]) {
        const {positions_message, positions_markup} = genPositionsMessage('show_positions');
        msg.message ? bot.editMessageText(positions_message, {chat_id: chatId, chatId, message_id: msg.message.message_id, ...positions_markup}) : bot.sendMessage(chatId, positions_message, positions_markup)
    } else {
        const {positions_message, positions_markup} = genPositionsMessage('no_positions');
        msg.message ? bot.editMessageText(positions_message, {chat_id: chatId, chatId, message_id: msg.message.message_id, ...positions_markup}) : bot.sendMessage(chatId, positions_message, positions_markup)
    }
}
module.exports = positionsCommand;