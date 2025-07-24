const timers = new Map();
const userAccountSettingsCache = require('../../memory/userAccountSettingsCache/userAccountSettingsCache');
const dbClient = require('../dbConnect/dbClient');
const formatDuration = require('./formatDuration')
const scheduleTimer = (userId, chatId, bot, expiresAt, intent) => {
    try {
    
    const id = userId;
    console.log(timers.get(id))
    if (intent === 'cancel') {
        const existing = timers.get(id);
        console.log(existing)
        clearTimeout(existing.timeout);
        clearInterval(existing.interval);
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
    
     const interval = setInterval(() => {
    const timeLeft = expiryDate - Date.now();
    if (timeLeft <= 0) {

        clearTimeout(existing.timeout);
        clearInterval(existing.interval);
      return;
    }
    bot.sendMessage(chatId, `🔔 You have ${formatDuration(timeLeft)} hours left before withdraw protection is disabled.`)
    }, 6 * 60 * 60 * 1000);


    const timeout = setTimeout(async () => {
        const existing = timers.get(id);
        const updatedSettings = await dbClient.query('UPDATE user_account_settings SET wp_pending_disable = $1, withdraw_protection = $2 RETURNING *', [false, false]);
        console.log(updatedSettings)
        userAccountSettingsCache.set(userId, updatedSettings.rows[0])
        bot.sendMessage(chatId, '⚠️ Withdraw protection has been disabled.');
        
        
        dbClient.query('DELETE FROM pending_timers WHERE tg_user_id = $1', [id]);
        clearTimeout(existing.timeout);
        clearInterval(existing.interval);
        timers.delete(id);

    }, remaining);

    timers.set(id, { interval: interval, timeout: timeout });
    } catch (e) {
        console.error(e)
    }
}

module.exports = scheduleTimer;