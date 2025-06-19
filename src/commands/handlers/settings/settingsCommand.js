const getSettingsMessage = require('./genSettingsMessage')
const dbClient = require('../../../helper/dbConnect/dbClient');
const genSettingsMessage = require('./genSettingsMessage');
const settingsCommand = async (bot, msg) => {
    try {
        const userId = msg.from?.id || msg.message.from.id
        const chatId = msg.chat?.id || msg.message.chat.id;
        const {message, markup} = genSettingsMessage();
        if (msg.message) {
            bot.editMessageText(message, {
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: markup
            });
        } else {
            bot.sendMessage(chatId, message, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: markup
        })
        }
        
        
        
        
        
        
        /*const userId = msg.from?.id || msg.message.from.id
        const chatId = msg.chat?.id || msg.message.chat.id;
        let userSettings = await dbClient.query('SELECT slippage, priority_fee, bribe_fee, mev_protect FROM user_txn_settings WHERE tg_user_id = $1', [userId])
        console.log(userSettings.rows)
        if (!userSettings.rows[0]) {
            const createDefaultSettings = await dbClient.query('INSERT INTO user_txn_settings (tg_user_id, priority_fee, bribe_fee, mev_protect) VALUES ($1, $2, $3, $4)', [userId, 0.001, 0.001, false])
            userSettings = await dbClient.query('SELECT slippage, priority_fee, bribe_fee, mev_protect FROM user_txn_settings WHERE tg_user_id = $1', [userId])
            const {slippage, priority_fee, bribe_fee, mev_protect} = userSettings.rows[0]
            bot.sendMessage(chatId, `temp`)
        } else {
            const {slippage, priority_fee, bribe_fee, mev_protect} = userSettings.rows[0]
            bot.sendMessage(chatId, `temp`)
        }
            */
    } catch (e) {
        console.error(e)
    }
}

module.exports = settingsCommand;