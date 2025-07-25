const timers = new Map();
const userAccountSettingsCache = require('../../memory/userAccountSettingsCache/userAccountSettingsCache');
const dbClient = require('../dbConnect/dbClient');
const formatDuration = require('./formatDuration');
const scheduleAlerts = require('./scheduleAlert')
const scheduleTimer = (userId, chatId, bot, expiresAt, intent, nextAlert) => {
    try {
    
    const id = userId;


    if (intent === 'cancel') {
        const existing = timers.get(id);
        console.log(existing)
        clearTimeout(existing.timeout);
        clearTimeout(existing.alertTimeout);
        timers.delete(id);
        return;
    }
    const now = Date.now();
    const expiryDate = new Date(expiresAt).getTime();
    const remaining = expiryDate - now;
    if (remaining <= 0) {

        dbClient.query('DELETE FROM pending_timers WHERE tg_user_id = $1', [id]);
        dbClient.query('UPDATE user_account_settings SET wp_pending_disable = $1, withdraw_protection = $2', [false, false]);
        return;
    }
    
     
    const alertTimeout = scheduleAlerts({ timers, userId: id, chatId, bot, expiryDate, nextAlert, dbClient });

    const timeout = setTimeout(async () => {
        const existing = timers.get(id);
        const updatedSettings = await dbClient.query('UPDATE user_account_settings SET wp_pending_disable = $1, withdraw_protection = $2 RETURNING *', [false, false]);
        console.log(updatedSettings)
        userAccountSettingsCache.set(userId, updatedSettings.rows[0])
        bot.sendMessage(chatId, '⚠️ Withdraw protection has been disabled.');
        
        
        dbClient.query('DELETE FROM pending_timers WHERE tg_user_id = $1', [id]);
        clearTimeout(existing.timeout);
        clearTimeout(existing.alertTimeout);
        timers.delete(id);

    }, remaining);

    timers.set(id, { timeout, alertTimeout });
    } catch (e) {
        console.error(e)
    }
}

module.exports = scheduleTimer;