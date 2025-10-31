const dbClient = require("../../../../helper/dbConnect/dbClient");

async function distributeCashback({ userId, fee }) {


  await dbClient.query(
    'UPDATE user_rewards SET unclaimed_cashback = COALESCE(unclaimed_cashback, 0) + $1 WHERE tg_user_id = $2',
    [fee, userId]
  );
}

module.exports = distributeCashback;
