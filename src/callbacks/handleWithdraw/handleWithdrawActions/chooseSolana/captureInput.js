const isValidNumber = require("../../../../helper/isValidNumber/isValidNumber");
const dbClient = require('../../../../helper/dbConnect/dbClient');
const genWithdrawMessage = require("../../genWithdrawMessage");
const userStates = require("../../../../memory/userStates/userStates");
const isUserBusy = require("../../../../memory/isUserBusy/isUserBusy");
const fetchSolBal = require("../../../../helper/fetchSolBal/fetchSolBal");
const captureInput = async (bot, msg) => {
   try {
     const chatId = msg.chat.id
    const userId = msg.from.id
    const messageId = userStates.get(chatId)?.toDelete;
    const userWallet = (await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])).rows[0].wallet;
    if (isValidNumber(parseFloat(msg.text))) {
        const userSOLBalance = await fetchSolBal(userWallet);

        if (parseFloat(msg.text) > userSOLBalance) {
             await bot.sendMessage(chatId, `⚠️ Not enough SOL balance.`, {
                reply_markup: {inline_keyboard : [[{text: '⟵ Back', callback_data: 'withdraw'}]]}
            })
            return;
        }
        const newSettings = (await dbClient.query('UPDATE withdraw_settings SET sol_amount = $1, withdraw_choice = $2 WHERE tg_user_id = $3 RETURNING *', [parseFloat(msg.text), 'solana', userId])).rows[0];
        await bot.deleteMessage(chatId, messageId);
        const {default_withdraw_message, default_withdraw_markup} = await genWithdrawMessage('default', newSettings, userWallet);
        userStates.delete(chatId)
        isUserBusy.delete(userId);
        bot.sendMessage(chatId, default_withdraw_message, default_withdraw_markup)
    }else {
            await bot.sendMessage(chatId, `⚠️ Do not put any symbols or characters, only the value such as 0.01`, {
                reply_markup: {inline_keyboard : [[{text: '⟵ Back', callback_data: 'withdraw'}]]}
            })
        }
   } catch (e) {
    console.error(e)
   }
}
module.exports = captureInput;