const dbClient = require('../../../helper/dbConnect/dbClient');
const userStates = require('../../../memory/userStates/userStates');
const genWithdrawMessage = require('../genWithdrawMessage')
const choosePercent = async ({userId, chatId, messageId, bot,}) => {
    try {
        
        const withdraw_settings = (await dbClient.query('SELECT * FROM withdraw_settings WHERE tg_user_id = $1', [userId])).rows[0];
        if (withdraw_settings.withdraw_choice === 'percent') {

            return;
        }

        const updated_withdraw_settings = (await dbClient.query('UPDATE withdraw_settings SET withdraw_choice = $1 WHERE tg_user_id = $2 RETURNING *', ['percent', userId])).rows[0];
        const userWallet = (await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])).rows[0].wallet;
        const {default_withdraw_markup} = await genWithdrawMessage('default', updated_withdraw_settings, userWallet);
        bot.editMessageReplyMarkup(default_withdraw_markup.reply_markup, {
                
                chat_id: chatId,
                message_id: messageId
    })

    } catch(e) {
        console.error(e)
    }
    
}

module.exports = choosePercent;