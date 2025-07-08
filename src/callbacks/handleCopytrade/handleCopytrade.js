const dbClient = require('../../helper/dbConnect/dbClient')
const genCopyTradeMessage = require('./genCopytradeMessage')
const handleCopytrade = async (bot, msg, context) => {
    try {
    const chatId = msg.chat?.id || msg.message.chat.id;
    const userId = msg.from?.id || msg.message.from.id

    if (!context) {
        const copytradeProfiles = await dbClient.query('SELECT copytrade_wallet, active, profile_id FROM copytrade_profiles WHERE tg_user_id = $1', [userId]);
        
        const {copytrade_message, copytrade_markup} = genCopyTradeMessage('show_copytrade', copytradeProfiles.rows)
        bot.editMessageText (copytrade_message, {
            chat_id: chatId,
            message_id: msg.message.message_id,
            ...copytrade_markup
        })
    } else if (context.startsWith('show_profile_')) {
        const profileId = context.replace('show_profile_', '');
        console.log(profileId)

    }
    } catch (e) {
        console.error(e)
    }
}

module.exports = handleCopytrade;