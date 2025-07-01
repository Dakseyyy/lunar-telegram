const dbClient = require('../../../../helper/dbConnect/dbClient')
const createReferralProfile = async(userId, username) => {
    try {
        const createReferralProfile = await dbClient.query('INSERT INTO user_referrals (tg_user_id, referral_code) VALUES ($1, $2) RETURNING *', [userId, username]);

        if (createReferralProfile.rows[0]) {
            return {
                referralProfile: createReferralProfile.rows[0]
            }
        } else {
            return {
                referralProfile: null
            }
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports = createReferralProfile;