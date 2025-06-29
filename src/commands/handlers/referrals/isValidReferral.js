const dbClient = require('../../../helper/dbConnect/dbClient')
const isValidReferral = async (referral) => {
    try {
        if (referral === undefined) {
            return {
                validReferral: false
            }
        } else if (/^[_a-z0-9]{1,20}$/.test(referral) === false) {
            return {
                validReferral: false
            }
    } else {
        const referralExists = await dbClient.query('SELECT tg_user_id FROM user_referrals WHERE referral_code = $1', [referral])
        if (referralExists.rows[0]) {
            return {
                validReferral: true,
                referrer_id: referralExists.rows[0].tg_user_id
            }
        }
    }
    } catch (e) {
        console.error(e);
    }

}

module.exports = isValidReferral