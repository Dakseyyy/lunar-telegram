const isValidReferral = require('./isValidReferral')
const dbClient = require('../../../helper/dbConnect/dbClient')
const makeUserReferred = require('./makeUserReferred')
const genReferralsMessage = require('./genReferralsMessage')
const processReferral = async(bot, msg) => {
        try {
                const referral = msg.text.match(/^\/start(?:\s+(.+))?/);
                const referralCheck = await isValidReferral(referral[1]);
                if (referral.validReferral) {
                        const referrerId = referralCheck.referrer_id;
                        const isUserReferred = await dbClient.query(`SELECT referred_by FROM user_referrals WHERE tg_user_id = $1`, [msg.from.id]);
                        if (!isUserReferred.rows[0]) {
                                makeUserReferred(msg.from.id, referral[1]);
                                const {message, markup} = genReferralsMessage('new_referral')
                                bot.sendMessage(msg.chat.id, message, {
                                        reply_markup: markup
                                });
                        } else if (isUserReferred.rows[0]) {
                                return {
                                        isReferred: true
                                }
                        }
        }
        }catch(e) {
                console.error(e)
        }
}

module.exports = processReferral;