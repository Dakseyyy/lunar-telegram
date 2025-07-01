const dbClient = require('../../../../helper/dbConnect/dbClient')
const getReferralProfile = async(userId) => {
    try {
        const referralProfile = await dbClient.query('SELECT referral_code, unclaimed_sol, claimed_sol, indirect_users, direct_users FROM user_referrals WHERE tg_user_id = $1', [userId]);

        if (referralProfile.rows[0]) {
            return {
                referralProfile: referralProfile.rows[0],
                hasReferralProfile: true
            }
        } else if (!referralProfile.rows[0]) {
            return {
                hasReferralProfile: false
            }
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports = getReferralProfile;