const isValidReferral = require('./isValidReferral')
const dbClient = require('../../../helper/dbConnect/dbClient')
const makeUserReferred = require('./makeUserReferred')
const genReferralsMessage = require('./genReferralsMessage')
const getReferrers = require('./getReferrers')
const updateReferralStats = require('./updateReferralStats')
const createReferralProfile = require('./ReferralProfile/createReferralProfile')
const processReferral = async(bot, msg) => {
        try {
                const referral = msg.text.match(/^\/start(?:\s+(.+))?/);
                const referralCheck = await isValidReferral(referral[1]);
                if (referralCheck.validReferral) {

                        const referrerId = referralCheck.referrer_id;
                        let isUserReferred = await dbClient.query(`SELECT referred_by FROM user_referrals WHERE tg_user_id = $1`, [msg.from.id]);
                        if (!isUserReferred.rows[0]) {
                                await createReferralProfile(msg.from.id, msg.from.username);
                        }
                        isUserReferred = await dbClient.query(`SELECT referred_by FROM user_referrals WHERE tg_user_id = $1`, [msg.from.id]);
                        if (isUserReferred.rows[0].referred_by === null) {

                                const referrer_id = await dbClient.query('SELECT tg_user_id FROM user_referrals WHERE referral_code = $1', [referral[1]])
                                console.log(referrer_id.rows[0].tg_user_id)
                                if (parseFloat(referrer_id.rows[0].tg_user_id) === msg.from.id) {
                                       bot.sendMessage(msg.chat.id, `⚠ You cannot refer yourself. Please use a different referral code.`);
                                       return;
                                }
                                
                                const {message, markup} = genReferralsMessage('new_referral')
                                bot.sendMessage(msg.chat.id, message, {
                                        reply_markup: markup
                                });
                                await makeUserReferred(msg.from.id, referrer_id.rows[0].tg_user_id);
                                const referrers = await getReferrers(msg.from.id);
                                await updateReferralStats(referrers)
                        } else if (isUserReferred.rows[0]) {
                                bot.sendMessage(msg.chat.id, '⚠ You are already under a referral code!')
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