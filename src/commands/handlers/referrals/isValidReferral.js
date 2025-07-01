const dbClient = require('../../../helper/dbConnect/dbClient')
const isValidReferral = async (referral) => {
    try {
        if (referral === undefined) {
            console.log('undefined referral')
            return {
                validReferral: false
            }
        } else if (/^[_a-z0-9]{1,32}$/.test(referral) === false) {
            console.log('illegal characters')
            return {
                validReferral: false
            }
    } else if (referral.length > 32) {
        console.log('too long')
        return {
            validReferral: false
        }
    } else {
        const referralExists = await dbClient.query('SELECT tg_user_id FROM user_referrals WHERE referral_code = $1', [referral])
        if (referralExists.rows[0]) {
            console.log('referral exists')
            return {
                validReferral: true,
                referrer_id: referralExists.rows[0].tg_user_id
            }
        } else {
            console.log('referral does not exist')
            return {
                validReferral: false
            }
        }
    }
    } catch (e) {
        console.error(e);
    }

}

module.exports = isValidReferral