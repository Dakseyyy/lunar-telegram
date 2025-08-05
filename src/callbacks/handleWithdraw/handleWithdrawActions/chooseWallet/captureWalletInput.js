const checkWalletFormat = require('../../../../helper/checkWalletFormat/checkWalletFormat');
const dbClient = require('../../../../helper/dbConnect/dbClient');
const genWithdrawMessage = require("../../genWithdrawMessage");
const userStates = require("../../../../memory/userStates/userStates");
const isUserBusy = require("../../../../memory/isUserBusy/isUserBusy");
const captureWalletInput = async (bot, msg) => {
   try {
     const chatId = msg.chat.id
    const userId = msg.from.id
    const userWallet = (await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])).rows[0].wallet;

    const messageId = userStates.get(chatId)?.toDelete;
    if (checkWalletFormat(msg.text)) {
        const newSettings = (await dbClient.query('UPDATE withdraw_settings SET withdrawal_address = $1 WHERE tg_user_id = $2 RETURNING *', [msg.text, userId])).rows[0];
        await bot.deleteMessage(chatId, messageId);
        const {default_withdraw_message, default_withdraw_markup} = await genWithdrawMessage('default', newSettings, userWallet);
        userStates.delete(chatId)
        isUserBusy.delete(userId);
        bot.sendMessage(chatId, default_withdraw_message, default_withdraw_markup)
    }else {
            await bot.sendMessage(chatId, `⚠️ Invalid wallet address format.`, {
                reply_markup: {inline_keyboard : [[{text: '⟵ Back', callback_data: 'withdraw'}]]}
            })
        }
   } catch (e) {
    console.error(e)
   }
}
module.exports = captureWalletInput;