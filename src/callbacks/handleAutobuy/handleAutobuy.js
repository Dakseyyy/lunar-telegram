const dbClient = require('../../helper/dbConnect/dbClient');
const genAutoBuyMessage = require('./genAutobuyMessage');
const handleAutobuyInput = require('./handleAutobuyInput');
const {getAutobuySettings, userAutobuySetting} = require('./getAutobuySettings');
const updateUserSettings = require('../handleFeesCommand/processUserFees');
const {userAccountSettingsCache} = require('../../commands/handlers/settings/settingsCommand')
const genSettingsMessage = require('../../commands/handlers/settings/genSettingsMessage');
const isUserBusy = require('../../memory/isUserBusy/isUserBusy')
const userStates = require('../../memory/userStates/userStates')
const autobuyStates = require('../../memory/autobuyStates/autobuyStates')
const handleAutobuy = async (bot, callbackQuery) => {
    try {
            
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id
    const messageId = callbackQuery.message.message_id;
    //

    const autobuy = await dbClient.query('SELECT autobuy FROM user_account_settings WHERE tg_user_id = $1', [userId])
    if (callbackQuery.data === 'back_to_settings_from_autobuy') {
        userStates.delete(chatId);
        isUserBusy.delete(userId);
    }

    if (autobuy.rows[0].autobuy === true) {
        
        const updatedSettings = await dbClient.query('UPDATE user_account_settings SET autobuy = $1 WHERE tg_user_id = $2 RETURNING *', [false, userId]);
        autobuyStates.delete(userId)
        const {withdraw_protection, autobuy, wp_pending_disable} = updatedSettings.rows[0];
        userAccountSettingsCache.set(userId, {withdraw_protection, autobuy, wp_pending_disable})
        const { markup} = genSettingsMessage(withdraw_protection, autobuy, 'settings', wp_pending_disable)
        await bot.editMessageReplyMarkup(markup, {
        chat_id: chatId,
        message_id: messageId
});
    } else if (autobuy.rows[0].autobuy === false) {
        if (callbackQuery.data === 'autobuy') {
        userStates.set(chatId, {state: 'autobuy', toDelete: messageId})
        isUserBusy.set(userId, true)

        await dbClient.query('UPDATE user_autobuy_settings SET buy_amount = $1 WHERE tg_user_id = $2', [0, userId]);
        userAutobuySetting.set(userId, 0);
        const {buyAmount} = await getAutobuySettings(userId)
        const {autobuyMessage, autobuyMarkup} = genAutoBuyMessage('autobuy', buyAmount)
            bot.editMessageText(autobuyMessage,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'HTML',
            reply_markup: autobuyMarkup
        })
        
    }
    }

    
    } catch (e) {
        console.error(e)
    }
    
    
}
module.exports = {
    handleAutobuy
};