const isUserBusy = require('../../../../memory/isUserBusy/isUserBusy')
const userStates = require('../../../../memory/userStates/userStates')
const referralsCommand = require('../referralsCommand');
const updateReferralCode = async(bot, callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const userId = callbackQuery.from.id;

        if (callbackQuery.data === 'update_referral_code') {
                let referralMessageContext = await bot.sendMessage(chatId, 'Enter your new referral code below.', {
                        reply_markup: {
                                inline_keyboard: [
                                        [{ text: 'Cancel', callback_data: 'cancel_update_referral_code' }]
                                        ]
                                }
                });
                isUserBusy.set(userId, true);
                userStates.set(chatId, {state: 'update_referral_code', messageToDelete: referralMessageContext.message_id })
            return;
        }
        if (callbackQuery.data === 'cancel_update_referral_code') {
                bot.deleteMessage(chatId, userStates.get(chatId)?.messageToDelete)
                isUserBusy.delete(userId);
                userStates.delete(chatId);
                referralsCommand(bot, callbackQuery)
        }
}
module.exports = updateReferralCode;