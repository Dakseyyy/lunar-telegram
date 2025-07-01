const dbClient = require('../../../helper/dbConnect/dbClient')
const updateReferralStats = async(referrers) => {
    try {
        console.log(referrers)
        const L1_referrer = referrers.direct_l1_referrer_id;
        await dbClient.query('UPDATE user_referrals SET direct_users = direct_users + 1 WHERE tg_user_id = $1', [L1_referrer]);
        if (referrers.indirect_l2_referrer_id === null) {
            return;
        }

        const L2_referrer = referrers.indirect_l2_referrer_id;
        await dbClient.query('UPDATE user_referrals SET indirect_users = indirect_users + 1 WHERE tg_user_id = $1', [L2_referrer])
        if (referrers.indirect_l2_referrer_id === null) {
            return
        }
        const L3_referrer = referrers.indirect_l3_referrer_id;
        await dbClient.query('UPDATE user_referrals SET indirect_users = indirect_users + 1 WHERE tg_user_id = $1', [L3_referrer])
    } catch(e) {
        console.error(e)
    }
}
module.exports = updateReferralStats;