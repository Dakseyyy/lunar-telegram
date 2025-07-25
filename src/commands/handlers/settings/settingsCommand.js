const dbClient = require('../../../helper/dbConnect/dbClient');
const scheduleTimer = require('../../../helper/withdrawProtection/scheduleTimer');
const toggleWithdrawProtection = require('../../../helper/withdrawProtection/toggleWithdrawProtection');
const userAccountSettingsCache = require('../../../memory/userAccountSettingsCache/userAccountSettingsCache');
const genSettingsMessage = require('./genSettingsMessage');


const settingsCommand = async (bot, msg, type) => {
    try {
        const userId = msg.from?.id || msg.message.from.id
        const chatId = msg.chat?.id || msg.message.chat.id;
        let userAccountSettings = null;
        if (userAccountSettingsCache.has(userId)){

            userAccountSettings = userAccountSettingsCache.get(userId)
            
            
        } else {
            const fetchUserAccountSettings = await dbClient.query('SELECT withdraw_protection, autobuy, wp_pending_disable FROM user_account_settings WHERE tg_user_id = $1', [userId]);

            if (!fetchUserAccountSettings.rows[0]){ // create user account settings
            const createUserAccountSettings = await dbClient.query('INSERT INTO user_account_settings (tg_user_id) VALUES ($1) RETURNING withdraw_protection, autobuy', [userId])
            const {withdraw_protection, autobuy, wp_pending_disable} = createUserAccountSettings.rows[0]
            userAccountSettingsCache.set(userId, {withdraw_protection, autobuy, wp_pending_disable})
        } else { // save already existing user account settings to cache
            const {withdraw_protection, autobuy, wp_pending_disable} = fetchUserAccountSettings.rows[0]
            userAccountSettingsCache.set(userId, {withdraw_protection, autobuy, wp_pending_disable})
            userAccountSettings = userAccountSettingsCache.get(userId)
        }
        }
        const {withdraw_protection, autobuy, wp_pending_disable} = userAccountSettings
        const {message, markup} = genSettingsMessage(withdraw_protection, autobuy, 'settings', wp_pending_disable);
        if (msg.message && msg.data !== 'withdraw_protection') {

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

            const wpPending = userAccountSettingsCache.get(userId)?.wp_pending_disable

            if (wpPending === true) { // user wants to cancel the process of turning off withdraw protection
                const updateUserAccountSettings = await dbClient.query('UPDATE user_account_settings SET withdraw_protection = $1, wp_pending_disable = $2 WHERE tg_user_id = $3 RETURNING withdraw_protection, autobuy, wp_pending_disable', [true, false, userId]);
                userAccountSettingsCache.set(userId, updateUserAccountSettings.rows[0])
                const {message, markup} = genSettingsMessage(true, userAccountSettingsCache.get(userId)?.autobuy, 'settings', false)
                bot.editMessageReplyMarkup(markup, {
                chat_id: chatId,
                message_id: msg.message.message_id,

            });
            await dbClient.query('DELETE FROM pending_timers WHERE tg_user_id = $1', [userId]);
            toggleWithdrawProtection('cancel', bot, userId, chatId)
            const {withdraw_context_message, withdraw_context_markup} = genSettingsMessage(true, userAccountSettingsCache.get(userId)?.autobuy, 'withdraw_protection', false)
            bot.sendMessage(chatId, withdraw_context_message, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: withdraw_context_markup
            })

            } else if (wpPending === false && withdraw_protection === true) { // user wants to turn off withdraw protection (currently turned on)
            const updateUserAccountSettings = await dbClient.query('UPDATE user_account_settings SET wp_pending_disable = $1 WHERE tg_user_id = $2 RETURNING withdraw_protection, autobuy, wp_pending_disable', [true, userId]);
            const {wp_pending_message, wp_pending_markup} = genSettingsMessage(false, userAccountSettingsCache.get(userId)?.autobuy, 'wp_pending_disable', true)
            userAccountSettingsCache.set(userId, updateUserAccountSettings.rows[0])
            const {withdraw_protection, autobuy} = userAccountSettingsCache.get(userId)
            const { markup } = genSettingsMessage(false, autobuy, 'settings', true);
                bot.editMessageReplyMarkup(markup, {
                chat_id: chatId,
                message_id: msg.message.message_id,

            })
            const timestamp24hAhead = new Date(Date.now() + 24 * 60 * 60 * 1000);


            const nextAlert = new Date(Date.now() + 6 * 60 * 60 * 1000);
            await dbClient.query('INSERT INTO pending_timers (tg_user_id, expires_at, chat_id, next_alert) VALUES ($1, $2, $3, $4)', [userId, timestamp24hAhead, chatId, nextAlert]);
            toggleWithdrawProtection('new_timer', bot, userId, chatId, timestamp24hAhead, nextAlert);
            // toggleWithdrawProtection();

            bot.sendMessage(chatId, wp_pending_message, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: wp_pending_markup
        })
            }else if (wpPending === false && withdraw_protection === false) {

                 const updateUserAccountSettings = await dbClient.query('UPDATE user_account_settings SET withdraw_protection = $1 WHERE tg_user_id = $2 RETURNING withdraw_protection, autobuy, wp_pending_disable', [true, userId]);
            const {wp_pending_message, wp_pending_markup} = genSettingsMessage(true, userAccountSettingsCache.get(userId)?.autobuy, 'withdraw_protection', false)
            userAccountSettingsCache.set(userId, updateUserAccountSettings.rows[0])
            const {withdraw_protection, autobuy} = userAccountSettingsCache.get(userId)
            const { markup } = genSettingsMessage(true, autobuy, 'settings', false);
                bot.editMessageReplyMarkup(markup, {
                chat_id: chatId,
                message_id: msg.message.message_id,

            })

            const {withdraw_context_message, withdraw_context_markup} = genSettingsMessage(true, userAccountSettingsCache.get(userId)?.autobuy, 'withdraw_protection', false)
            bot.sendMessage(chatId, withdraw_context_message, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: withdraw_context_markup
            })
            }
            
        }
        
        

    } catch (e) {
        console.error(e)
    }
}

module.exports = {settingsCommand, userAccountSettingsCache};