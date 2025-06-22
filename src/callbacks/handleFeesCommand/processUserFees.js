const userSettingsCache = new Map();
const dbClient = require('../../helper/dbConnect/dbClient')
const updateUserSettings = async (userId, query, input) => {
    let settings;
    if (userSettingsCache.has(userId)) {
       settings = userSettingsCache.get(userId)
        
    } else if (!userSettingsCache.has(userId)) {
        const fetchUserSettings = await dbClient.query('SELECT slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset FROM user_txn_settings WHERE tg_user_id = $1', [userId]);
            if (!fetchUserSettings.rows[0]) {
        console.log('no has')
        const updateUserSettings = await dbClient.query('INSERT INTO user_txn_settings (tg_user_id) VALUES ($1) RETURNING slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset', [userId])
        settings = updateUserSettings.rows[0];
        
        userSettingsCache.set(userId, settings);
        console.log(userSettingsCache.get(userId))
       
    } else {
        console.log('fetching..')
        const fetchUserSettings = await dbClient.query('SELECT slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset FROM user_txn_settings WHERE tg_user_id = $1', [userId]);
        settings = fetchUserSettings.rows[0];
        userSettingsCache.set(userId, settings)
       
    }
    }
    if (query === 'fees') {
       
    return settings;
    }

    if (query === 'turbo') {
        let feeSettings = await userSettingsCache.get(userId)
        console.log(userSettingsCache.get(userId))
        const {fee_preset} = feeSettings;
        if (fee_preset !== 'turbo') {
            let updatedFeeSettings = await dbClient.query('UPDATE user_txn_settings SET fee_preset = $1, buy_priority_fee = $2, sell_priority_fee = $3, buy_bribe_fee = $4, sell_bribe_fee = $5 WHERE tg_user_id = $6 RETURNING slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset', ['turbo', 0.0075, 0.0075, 0.0075, 0.0075, userId])
            userSettingsCache.set(userId, updatedFeeSettings.rows[0])
           
            return updatedFeeSettings.rows[0]
        }
    }

    if (query === 'fast') {
        let feeSettings = await userSettingsCache.get(userId)
        const {fee_preset} = feeSettings;
        if (fee_preset !== 'fast') {
            let updatedFeeSettings = await dbClient.query('UPDATE user_txn_settings SET fee_preset = $1, buy_priority_fee = $2, sell_priority_fee = $3, buy_bribe_fee = $4, sell_bribe_fee = $5 WHERE tg_user_id = $6 RETURNING slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset', ['fast', 0.0015, 0.0015, 0.0015, 0.0015, userId])
            userSettingsCache.set(userId, updatedFeeSettings.rows[0])
      
            return updatedFeeSettings.rows[0]
        }
    }

    if (query === 'mev_protect') {
        let feeSettings = await userSettingsCache.get(userId)

        const {mev_protect} = feeSettings;

            let updatedFeeSettings = await dbClient.query('UPDATE user_txn_settings SET mev_protect = $1 WHERE tg_user_id = $2 RETURNING slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset', [!mev_protect, userId])
            userSettingsCache.set(userId, updatedFeeSettings.rows[0])

            return updatedFeeSettings.rows[0]
        
    }
    if (query === 'slippage') {

        let updatedFeeSettings = await dbClient.query('UPDATE user_txn_settings SET slippage = $1, fee_preset = $2 WHERE tg_user_id = $3 RETURNING slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset', [input, 'custom', userId])
            userSettingsCache.set(userId, updatedFeeSettings.rows[0])

            return updatedFeeSettings.rows[0]
    }
        if (query === 'buy_priority_fee') {

        let updatedFeeSettings = await dbClient.query('UPDATE user_txn_settings SET buy_priority_fee = $1, fee_preset = $2 WHERE tg_user_id = $3 RETURNING slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset', [input, 'custom', userId])
            userSettingsCache.set(userId, updatedFeeSettings.rows[0])

            return updatedFeeSettings.rows[0]
    }
    if (query === 'sell_priority_fee') {

        let updatedFeeSettings = await dbClient.query('UPDATE user_txn_settings SET sell_priority_fee = $1, fee_preset = $2 WHERE tg_user_id = $3 RETURNING slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset', [input, 'custom', userId])
            userSettingsCache.set(userId, updatedFeeSettings.rows[0])

            return updatedFeeSettings.rows[0]
    }
    if (query === 'buy_bribe_fee') {

        let updatedFeeSettings = await dbClient.query('UPDATE user_txn_settings SET buy_bribe_fee = $1, fee_preset = $2 WHERE tg_user_id = $3 RETURNING slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset', [input, 'custom', userId])
            userSettingsCache.set(userId, updatedFeeSettings.rows[0])

            return updatedFeeSettings.rows[0]
    }
    if (query === 'sell_bribe_fee') {

        let updatedFeeSettings = await dbClient.query('UPDATE user_txn_settings SET sell_bribe_fee = $1, fee_preset = $2 WHERE tg_user_id = $3 RETURNING slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset', [input, 'custom', userId])
            userSettingsCache.set(userId, updatedFeeSettings.rows[0])

            return updatedFeeSettings.rows[0]
    }
}

module.exports = updateUserSettings;