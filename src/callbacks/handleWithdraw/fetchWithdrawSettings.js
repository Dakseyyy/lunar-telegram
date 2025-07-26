const dbClient = require('../../helper/dbConnect/dbClient')
const fetchWithdrawSettings = async (userId) => {
    try {
        const withdraw_settings = await dbClient.query('SELECT * FROM withdraw_settings WHERE tg_user_id = $1', [userId]);
        if (withdraw_settings.rows[0]) {
            return withdraw_settings.rows[0]
        } else if (!withdraw_settings.rows[0]) {
       const created_settings = (await dbClient.query('INSERT INTO withdraw_settings (tg_user_id) VALUES ($1) RETURNING *', [userId])).rows[0];
       return created_settings;
    }
    } catch(e) {
        console.error(e)
    }
}
module.exports = fetchWithdrawSettings;