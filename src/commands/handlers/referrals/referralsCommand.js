const genReferralsMessage = require('./genReferralsMessage')
const getReferralProfile = require('./ReferralProfile/getReferralProfile')
const createReferralProfile = require('./ReferralProfile/createReferralProfile')
const referralCommand = async (bot, msg) => {
    try {
        const chatId = msg.chat?.id || msg.message.chat.id;
        const userId = msg.from?.id || msg.message.from.id;
        const username = msg.from.username || msg.from.id;
        let referralProfile = await getReferralProfile(userId);

        if (!referralProfile.hasReferralProfile) {
            referralProfile = await createReferralProfile(userId, username)

            const {referral_code, unclaimed_sol, claimed_sol, indirect_users, direct_users} = referralProfile.referralProfile;

            const {caption, image, markup} = genReferralsMessage('referral_page', referral_code, unclaimed_sol, claimed_sol, indirect_users, direct_users)

            await bot.sendPhoto(chatId, image, {
                    caption: caption,
                    parse_mode: 'HTML',
                    reply_markup: markup
    })
        } else if (referralProfile.hasReferralProfile) {
            const {referral_code, unclaimed_sol, claimed_sol, indirect_users, direct_users} = referralProfile.referralProfile;

            const {caption, image, markup} = genReferralsMessage('referral_page', referral_code, unclaimed_sol, claimed_sol, indirect_users, direct_users)

            await bot.sendPhoto(chatId, image, {
                    caption: caption,
                    parse_mode: 'HTML',
                    reply_markup: markup
            })
        }

        
    } catch (e) {
        console.error(e)
    }
    
}
module.exports = referralCommand;