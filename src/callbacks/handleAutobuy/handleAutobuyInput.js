const isValidNumber = require('../../helper/isValidNumber/isValidNumber')
const dbClient = require('../../helper/dbConnect/dbClient')
const {userAutobuySetting} = require('./getAutobuySettings')
const genSettingsMessage = require('../../commands/handlers/settings/genSettingsMessage')
const autobuy = require('../../helper/autobuy/autobuy')
const isUserBusy = require('../../memory/isUserBusy/isUserBusy')
const userStates = require('../../memory/userStates/userStates')
const autobuyStates = require('../../memory/autobuyStates/autobuyStates')
const handleInput = async (bot, msg) => {
        try {
            const chatId = msg.chat.id
            const userId = msg.from.id
            const messageId = userStates.get(chatId)?.toDelete;
            if (isValidNumber(parseFloat(msg.text))) {
                await dbClient.query('UPDATE user_autobuy_settings SET buy_amount = $1 WHERE tg_user_id = $2', [parseFloat(msg.text), userId]);

                userAutobuySetting.set(userId, parseFloat(msg.text))

                const updateUserAccountSettings = await dbClient.query('UPDATE user_account_settings SET autobuy = $1 WHERE tg_user_id = $2 RETURNING *', [true, userId]);

                await bot.deleteMessage(chatId, messageId);
                const {withdraw_protection, autobuy, wp_pending_disable} = updateUserAccountSettings.rows[0];
                const {message, markup} = genSettingsMessage(withdraw_protection, autobuy, 'settings', wp_pending_disable);
                await bot.sendMessage(chatId, message, {
                     parse_mode: 'HTML',
                    disable_web_page_preview: true,
                    reply_markup: markup
                })
                userStates.delete(chatId)
                autobuyStates.set(userId, true);
                isUserBusy.delete(userId)
        } else {
            await bot.sendMessage(chatId, `⚠️ Do not put any symbols or characters, only the value such as 0.01`, {
                reply_markup: {inline_keyboard : [[{text: '⟵ Back', callback_data: 'back_to_settings_from_autobuy'}]]}
            })
        }
        } catch (e) {
            console.error(e)
        }
        
    
}

module.exports = handleInput