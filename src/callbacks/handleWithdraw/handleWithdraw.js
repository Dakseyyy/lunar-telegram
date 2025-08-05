const genWithdrawMessage = require("./genWithdrawMessage");
const dbClient = require('../../helper/dbConnect/dbClient');
const fetchWithdrawSettings = require("./fetchWithdrawSettings");
const choosePercent = require("./handleWithdrawActions/choosePercent");
const chooseSolana = require("./handleWithdrawActions/chooseSolana/chooseSolana");
const isUserBusy = require("../../memory/isUserBusy/isUserBusy");
const userStates = require("../../memory/userStates/userStates");
const chooseWallet = require("./handleWithdrawActions/chooseWallet/chooseWallet");
const chooseWithdraw = require("./handleWithdrawActions/chooseWithdraw");
const handleWithdraw = async (bot, callbackquery, context, solPrice) => {
    try {
                   
            const userId = callbackquery.from?.id || callbackquery.message.from.id
            const chatId = callbackquery.chat?.id || callbackquery.message.chat.id;
            const messageId = callbackquery.message.message_id;
            const userWallet = (await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])).rows[0].wallet;

            userStates.delete(chatId)
            isUserBusy.delete(userId)


            if (context === 'withdraw_100%') {
                choosePercent({userId, chatId, messageId, bot, solPrice, userWallet});
                return;
            }
            if (context === 'withdraw_custom_sol') {
                chooseSolana({userId, chatId, messageId, bot, solPrice, userWallet});
                return;
            }
            if (context === 'set_withdrawal_address') {
                chooseWallet({userId, chatId, messageId, bot, solPrice, userWallet});
                return;
            }
            if (context === 'withdraw') {
                chooseWithdraw({userId, chatId, messageId, bot});
                return;
            }


          
            
            const withdraw_settings = await fetchWithdrawSettings(userId)

            const {default_withdraw_message, default_withdraw_markup} = await genWithdrawMessage('default', withdraw_settings, userWallet)
            bot.editMessageText(default_withdraw_message, {
                ...default_withdraw_markup,
                chat_id: chatId,
                message_id: messageId
    })
    } catch (e){
        console.error(e)
    }
};

module.exports = handleWithdraw