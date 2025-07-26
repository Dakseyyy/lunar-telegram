const fetchSolBal = require("../../../../helper/fetchSolBal/fetchSolBal");
const isUserBusy = require("../../../../memory/isUserBusy/isUserBusy");
const userStates = require("../../../../memory/userStates/userStates");
const genWithdrawMessage = require("../../genWithdrawMessage");
const dbClient = require('../../../../helper/dbConnect/dbClient')
const chooseSolana = async ({bot, chatId, messageId, userId}) => {
    const userWallet = (await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])).rows[0].wallet;
    const {solana_withdraw_message, solana_withdraw_markup} = await genWithdrawMessage('choose_solana', 'x', userWallet);
    bot.editMessageText(solana_withdraw_message, {
        ...solana_withdraw_markup,
        chat_id: chatId,
        message_id: messageId
    })
    userStates.set(chatId, {state: 'withdraw_solana_amount', toDelete: messageId});
    isUserBusy.set(userId, true);
}

module.exports = chooseSolana;