const validReferralFormat = require('./validReferralFormat')
const dbClient = require('../../../../helper/dbConnect/dbClient')
const referralCommand = require('../referralsCommand')
const isUserbusy = require('../../../../memory/isUserBusy/isUserBusy');
const userStates = require('../../../../memory/userStates/userStates')
const handleReferralCodeInput = async(bot, msg) => {
    try {
        if (await validReferralFormat(msg.text) === true) {
        const referralExists = await dbClient.query('SELECT referral_code FROM user_referrals WHERE referral_code = $1', [msg.text]);
        if (referralExists.rows[0]) {
            await bot.sendMessage(msg.chat.id, '⚠ Referral code is taken.', {
                        reply_markup: {
                                inline_keyboard: [
                                        [{ text: 'Cancel', callback_data: 'cancel_update_referral_code' }]
                                        ]
                                }
        })
        return;
        } else if (!referralExists.rows[0]) {
            await dbClient.query('UPDATE user_referrals SET referral_code = $1 WHERE tg_user_id = $2', [msg.text, msg.from.id])
        }
        await referralCommand(bot, msg)

        isUserbusy.delete(msg.from.id);
        userStates.delete(msg.chat.id);
        } else {
        await bot.sendMessage(msg.chat.id, '⚠ Please use only lowercase letters, avoid symbols, and ensure the code is between 4 and 32 characters in length', {
                        reply_markup: {
                                inline_keyboard: [
                                        [{ text: 'Cancel', callback_data: 'cancel_update_referral_code' }]
                                        ]
                                }
    })
        }
    } catch (e) {
        console.error(e)
    }
}
module.exports = handleReferralCodeInput