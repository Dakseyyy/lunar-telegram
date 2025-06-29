const dbClient = require('../../../helper/dbConnect/dbClient')
const makeUserReferred = async(userId, referred_by) => {
    try {
        await dbClient.query('INSERT INTO user_referrals (tg_user_id, referred_by) VALUES ($1, $2)', [userId, referred_by])
    } catch (e) {
        console.error(e)
    }
    
}

module.exports = makeUserReferred;