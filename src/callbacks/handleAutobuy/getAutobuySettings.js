const dbClient = require('../../helper/dbConnect/dbClient')
const userAutobuySetting = new Map();
const getAutobuySettings = async(userId) => {
    try {
        if (userAutobuySetting.has(userId)) { // check if user is already in memory
        const buyAmount = await userAutobuySetting.get(userId)
        return {
            buyAmount
        }
    } else {
        const fetchAutobuySettings = await dbClient.query('SELECT buy_amount FROM user_autobuy_settings WHERE tg_user_id = $1', [userId]);
        if (!fetchAutobuySettings.rows[0]) { // does not exist in database?
            const setAutoBuySettings = await dbClient.query('INSERT INTO user_autobuy_settings (tg_user_id) VALUES ($1) RETURNING tg_user_id, buy_amount', [userId]);
            userAutobuySetting.set(userId, setAutoBuySettings.rows[0].buy_amount);
            return {
                buyAmount: userAutobuySetting.get(userId)
            }
        }
        userAutobuySetting.set(userId, fetchAutobuySettings.rows[0].buy_amount)
        return {
            buyAmount: userAutobuySetting.get(userId)
        }
    }
    } catch(e) {
        console.error(e)
    }
    
}

module.exports = {getAutobuySettings, userAutobuySetting}