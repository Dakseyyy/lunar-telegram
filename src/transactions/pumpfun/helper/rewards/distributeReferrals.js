const dbClient = require("../../../../helper/dbConnect/dbClient");

async function distributeReferrals({ userId, fee }) {
    const levels = [0.35, 0.03, 0.02];
    let currentUser = userId;

    for (let i = 0; i < levels.length; i++) {
        const result = await dbClient.query(
            'SELECT referred_by FROM user_referrals WHERE tg_user_id = $1',
            [currentUser]
        );
        const referrerId = result.rows[0]?.referred_by;
        if (!referrerId) break;
        const reward = fee * levels[i];
        await dbClient.query(
            'UPDATE user_referrals SET unclaimed_sol = COALESCE(unclaimed_sol, 0) + $1 WHERE tg_user_id = $2',
            [reward, referrerId]
        );

        currentUser = referrerId
    }
}

module.exports = distributeReferrals;