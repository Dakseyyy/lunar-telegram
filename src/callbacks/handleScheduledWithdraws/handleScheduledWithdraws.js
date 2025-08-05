const genMessage = require("./genMessage");
const dbClient = require('../../helper/dbConnect/dbClient');
const { getuserWallet } = require("../../helper/withdraw/walletServices");
const fetchSolBal = require("../../helper/fetchSolBal/fetchSolBal");
async function handleScheduledWithdraws(bot, callbackQuery) {
    try {
        const chatId = callbackQuery.message.chat.id;
        const userId = callbackQuery.from.id;
        const messageId = callbackQuery.message.message_id;
        const pendingWithdraws = (await dbClient.query('SELECT * FROM pending_withdrawals WHERE tg_user_id = $1', [userId])).rows;
        genMessage({chatId, userId, messageId, bot, type: 'default', pendingWithdraws})
    } catch (e) {
        console.error(e);
    }
}
module.exports = handleScheduledWithdraws;