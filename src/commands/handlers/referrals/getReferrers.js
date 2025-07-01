const dbClient = require('../../../helper/dbConnect/dbClient')
const getReferrers = async(refereeId) => {
    try {
        const direct_l1_referrer_result = await dbClient.query('SELECT referred_by FROM user_referrals WHERE tg_user_id = $1', [refereeId]);
        const direct_l1_referrer_id = direct_l1_referrer_result.rows[0].referred_by;

        const indirect_l2_referrer_result = await dbClient.query('SELECT referred_by FROM user_referrals WHERE tg_user_id = $1', [direct_l1_referrer_id]);
        if (indirect_l2_referrer_result.rows[0].referred_by === null) {
            return {
                direct_l1_referrer_id,
                indirect_l2_referrer_id: null
            }
        }
        const indirect_l2_referrer_id = indirect_l2_referrer_result.rows[0].referred_by;

        const indirect_l3_referrer_result = await dbClient.query('SELECT referred_by FROM user_referrals WHERE tg_user_id = $1', [indirect_l2_referrer_id]);
        if (indirect_l3_referrer_result.rows[0].referred_by === null) {
            return {
                direct_l1_referrer_id,
                indirect_l2_referrer_id,
                indirect_l3_referrer_id: null
            }
        }
        const indirect_l3_referrer_id = indirect_l3_referrer_result.rows[0].referred_by;
        return {
            direct_l1_referrer_id,
            indirect_l2_referrer_id,
            indirect_l3_referrer_id
        }
    } catch(e) {
        console.error(e)
    }

}

module.exports = getReferrers;