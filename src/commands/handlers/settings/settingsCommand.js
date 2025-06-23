const dbClient = require('../../../helper/dbConnect/dbClient');
const genSettingsMessage = require('./genSettingsMessage');
const userAccountSettingsCache = new Map()
const settingsCommand = async (bot, msg) => {
    try {
        const userId = msg.from?.id || msg.message.from.id
        const chatId = msg.chat?.id || msg.message.chat.id;
        let userAccountSettings = null;
        if (userAccountSettingsCache.has(userId)){
            console.log('User has account settings data in cache.')
            userAccountSettings = userAccountSettingsCache.get(userId)
            
            
        } else {
            const fetchUserAccountSettings = await dbClient.query('SELECT withdraw_protection, autobuy FROM user_account_settings WHERE tg_user_id = $1', [userId]);

             if (!fetchUserAccountSettings.rows[0]){
            const createUserAccountSettings = await dbClient.query('INSERT INTO user_account_settings (tg_user_id) VALUES ($1) RETURNING withdraw_protection, autobuy', [userId])
            const {withdraw_protection, autobuy} = createUserAccountSettings.rows[0]
            userAccountSettingsCache.set(userId, {withdraw_protection, autobuy})
        } else {
            const {withdraw_protection, autobuy} = fetchUserAccountSettings.rows[0]
            userAccountSettingsCache.set(userId, {withdraw_protection, autobuy})
            userAccountSettings = userAccountSettingsCache.get(userId)
        }
        }
        const {withdraw_protection, autobuy} = userAccountSettings
        const {message, markup} = genSettingsMessage(withdraw_protection, autobuy, 'settings');
        if (msg.message && msg.data !== 'withdraw_protection') {
            console.log('trying to edit...')
            bot.editMessageText(message, {
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: markup
            });
        } else if (!msg.data){
            bot.sendMessage(chatId, message, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: markup
        })
        }
        if (msg.data === 'withdraw_protection') {

            const current_withdraw_protection = userAccountSettingsCache.get(userId)?.withdraw_protection
            const updateUserAccountSettings = await dbClient.query('UPDATE user_account_settings SET withdraw_protection = $1 WHERE tg_user_id = $2 RETURNING withdraw_protection, autobuy', [!current_withdraw_protection, userId]);
            const {withdraw_context_message, withdraw_context_markup} = genSettingsMessage(!current_withdraw_protection, 'x', 'withdraw_protection')
            userAccountSettingsCache.set(userId, updateUserAccountSettings.rows[0])
            const {withdraw_protection, autobuy} = userAccountSettingsCache.get(userId)
            const { markup } = genSettingsMessage(withdraw_protection, autobuy, 'settings');
                bot.editMessageReplyMarkup(markup, {
                chat_id: chatId,
                message_id: msg.message.message_id,

            });
            // enableWithdrawProtection();

            bot.sendMessage(chatId, withdraw_context_message, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: withdraw_context_markup
        })
        }
        
        

    } catch (e) {
        console.error(e)
    }
}

module.exports = settingsCommand;