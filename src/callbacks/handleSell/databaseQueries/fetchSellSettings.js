const dbClient = require("../../../helper/dbConnect/dbClient");

async function fetchSellSettings(userId) {
    try {
        const settings = (await dbClient.query('SELECT * FROM sell_settings WHERE tg_user_id = $1', [userId]))?.rows[0];
        if (!settings) {
            const newSettings = (await dbClient.query('INSERT INTO sell_settings (tg_user_id) VALUES ($1) RETURNING *', [userId])).rows[0];
            return newSettings
        }
        return settings;
    } catch (e) {
        console.error(e);
    }
}

module.exports = fetchSellSettings;