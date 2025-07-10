const dbClient = require('../../helper/dbConnect/dbClient');
const genCopyTradeMessage = require('./genCopytradeMessage');
const createNewCopytradingProfile = async (bot, msg) => {
        const chatId = msg.chat?.id || msg.message.chat.id;
        const userId = msg.from?.id || msg.message.from.id;
        const messageId = msg.message.message_id;
    const numOfProfiles = await dbClient.query('SELECT COUNT(*) FROM copytrade_profiles WHERE tg_user_id = $1', [userId]);
    if (numOfProfiles.rows[0].count === 5) {
        bot.sendMessage(chatId, '⚠ The maximum number of copy trading profiles allowed is 5.')
    } else {
        const newProfile = await dbClient.query('INSERT INTO copytrade_profiles (tg_user_id) VALUES ($1) RETURNING *', [userId]);
        const {copytrade_message, copytrade_markup} = genCopyTradeMessage('show_profile', null, newProfile.rows[0]);
        bot.sendMessage(chatId, copytrade_message, copytrade_markup);
    }
}

module.exports = createNewCopytradingProfile;