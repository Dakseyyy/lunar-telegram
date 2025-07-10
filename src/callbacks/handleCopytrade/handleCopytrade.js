const dbClient = require('../../helper/dbConnect/dbClient')
const genCopyTradeMessage = require('./genCopytradeMessage')
const userStates = require('../../memory/userStates/userStates');
const isUserBusy = require('../../memory/isUserBusy/isUserBusy')
const handleCopytrade = async (bot, msg, context) => {
    try {
    const chatId = msg.chat?.id || msg.message.chat.id;
    const userId = msg.from?.id || msg.message.from.id

    if (!context || context === 'back_to_copytrade') {
        const copytradeProfiles = await dbClient.query('SELECT copytrade_wallet, active, profile_id FROM copytrade_profiles WHERE tg_user_id = $1 AND copytrade_wallet IS NOT NULL', [userId]);
        dbClient.query('DELETE FROM copytrade_profiles WHERE copytrade_wallet IS NULL; ')
        userStates.delete(chatId);
        isUserBusy.delete(userId);
        console.log('called!!!!!')
        console.log(copytradeProfiles.rows)
        const {copytrade_message, copytrade_markup} = genCopyTradeMessage('show_copytrade', copytradeProfiles.rows)
        bot.editMessageText (copytrade_message, {
            chat_id: chatId,
            message_id: msg.message.message_id,
            ...copytrade_markup
        })
    } else if (context.startsWith('show_profile_')) {
        console.log(context)
        const profileId = context.replace('show_profile_', '');
        let profileResponse = await dbClient.query('SELECT * FROM copytrade_profiles WHERE profile_id = $1', [profileId]);
        let profile = profileResponse.rows[0];
        userStates.delete(chatId);
        isUserBusy.delete(userId);
        const {copytrade_message, copytrade_markup} = genCopyTradeMessage('show_profile', null, profile);
        bot.editMessageText(copytrade_message, {
            chat_id: chatId,
            message_id: msg.message.message_id,
            ...copytrade_markup
        })

    }
    } catch (e) {
        console.error(e)
    }
}

module.exports = handleCopytrade;