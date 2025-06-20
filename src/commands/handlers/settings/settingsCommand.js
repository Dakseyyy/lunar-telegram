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
        
        
        
        
        

    } catch (e) {
        console.error(e)
    }
}

module.exports = settingsCommand;