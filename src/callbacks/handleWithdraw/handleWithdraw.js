const genWithdrawMessage = require("./genWithdrawMessage");

const handleWithdraw = async (bot, callbackquery) => {
    try {
            const userId = callbackquery.from?.id || callbackquery.message.from.id
            const chatId = callbackquery.chat?.id || callbackquery.message.chat.id;
            const messageId = callbackquery.message.message_id;

            const {default_withdraw_message, default_withdraw_markup} = genWithdrawMessage('default')
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