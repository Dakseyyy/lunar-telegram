const dbClient = require('../../../helper/dbConnect/dbClient')
const makeUserReferred = async(userId, referred_by) => {
    try {
        console.log('setting referral...')
        await dbClient.query('UPDATE user_referrals SET referred_by = $2 WHERE tg_user_id = $1', [userId, referred_by])
    } catch (e) {
        console.error(e)
    }
    
}

module.exports = makeUserReferred;