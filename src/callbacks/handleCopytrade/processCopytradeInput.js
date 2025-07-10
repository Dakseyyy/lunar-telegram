const dbClient = require('../../helper/dbConnect/dbClient');
const userState = require('../../memory/userStates/userStates');
const genCopyTradeMessage = require('./genCopytradeMessage');
const handleCopytrade = require('./handleCopyTrade');
const allowed_columns = ['priority_fee_buy', 'priority_fee_sell', 'bribe_fee_buys', 'bribe_fee_sells', 'slippage', 'buy_amount', 'copytrade_wallet', 'active'];

const processCopytradeInput = async (bot, msg, state, profileId, msgToEdit) => {
            const chatId = msg.chat?.id || msg.message.chat.id;
        const userId = msg.from?.id || msg.message.from.id;
    try {
        console.log({
            state,
            profileId
        })
        if (state === 'toggle_active') {
            const profile = await dbClient.query('SELECT * FROM copytrade_profiles WHERE profile_id = $1', [profileId]);
            if (Object.values(profile.rows[0]).every(value => value !== null)) {
                const updatedProfile = await dbClient.query('UPDATE copytrade_profiles SET active = $1 WHERE profile_id = $2 RETURNING *', [!profile.rows[0].active, profileId]);
                const {copytrade_message, copytrade_markup} = genCopyTradeMessage('show_profile', null, updatedProfile.rows[0]);
                console.log(copytrade_markup.reply_markup)
                  bot.editMessageReplyMarkup(copytrade_markup.reply_markup, {
                    chat_id: chatId,
                    message_id: msgToEdit
                  });
                  return;
            } else {
                bot.sendMessage(chatId, '⚠ You need to complete your copy trading profile setup before you can activate copytrading')
            }
        }
        if (allowed_columns.includes(state)) {
            const updatedProfile = await dbClient.query(`UPDATE copytrade_profiles SET ${state} = $1 WHERE profile_id = $2 RETURNING *`, [msg.text, profileId])
            bot.deleteMessage(chatId, userState.get(chatId)?.messageToDelete);
            const {copytrade_message, copytrade_markup} = genCopyTradeMessage('show_profile', null, updatedProfile.rows[0])
            bot.sendMessage(chatId, copytrade_message, copytrade_markup)
        } else {
            throw new Error('column not allowed')
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports = processCopytradeInput;