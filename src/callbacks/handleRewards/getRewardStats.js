const dbClient = require("../../helper/dbConnect/dbClient");

const getRewardStats = async (userId) => {
    const userRewardStats = await dbClient.query('SELECT * FROM user_rewards WHERE tg_user_id = $1', [userId]);

    if (!userRewardStats?.rows[0]) {
        const userRewardStats = (await dbClient.query('INSERT INTO user_rewards (tg_user_id) VALUES ($1) RETURNING *', [userId])).rows[0];
        return userRewardStats;
    }
    return userRewardStats.rows[0];
}

module.exports = getRewardStats;