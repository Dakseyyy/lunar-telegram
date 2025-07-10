const dbClient = require('../../helper/dbConnect/dbClient');
const genCopyTradeMessage = require('./genCopytradeMessage');
const deleteCopytradeProfile = async (bot, msg) => {
    try {
        const chatId = msg.chat?.id || msg.message.chat.id;
        const userId = msg.from?.id || msg.message.from.id;
        const messageId = msg.message.message_id;
         const profileId = msg.data.replace('delete_copytrade_profile_', '');
        await dbClient.query('DELETE FROM copytrade_profiles WHERE profile_id = $1', [profileId]);
        await bot.deleteMessage(chatId, messageId);
         const newProfiles = await dbClient.query('SELECT copytrade_wallet, active, profile_id FROM copytrade_profiles WHERE tg_user_id = $1', [userId]);
         const {copytrade_message, copytrade_markup} = genCopyTradeMessage('show_copytrade', newProfiles.rows);
         bot.sendMessage(chatId, copytrade_message, copytrade_markup);
    } catch (e) {
        console.error(e)
    }
}

module.exports = deleteCopytradeProfile;