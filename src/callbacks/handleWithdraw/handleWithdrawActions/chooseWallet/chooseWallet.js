const isUserBusy = require("../../../../memory/isUserBusy/isUserBusy");
const userStates = require("../../../../memory/userStates/userStates");
const genWithdrawMessage = require("../../genWithdrawMessage");
const chooseWallet = async ({bot, chatId, messageId, userId}) => {
   try {
     const {wallet_withdraw_message, wallet_withdraw_markup} = await genWithdrawMessage('choose_wallet');
    bot.editMessageText(wallet_withdraw_message, {
        ...wallet_withdraw_markup,
        chat_id: chatId,
        message_id: messageId
    })
    userStates.set(chatId, {state: 'choose_wallet', toDelete: messageId});
    isUserBusy.set(userId, true);
   } catch(e){
    console.error(e)
   }
}

module.exports = chooseWallet;