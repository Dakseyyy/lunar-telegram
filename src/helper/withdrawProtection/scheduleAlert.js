const ALERT_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours
const formatDuration = require('./formatDuration')
const scheduleAlert = ({ timers, userId, chatId, bot, expiryDate, nextAlert, dbClient }) => {

    try {
        const now = Date.now();
    let nextAlertMs = new Date(nextAlert).getTime();  // convert timestampz to ms number
    let msUntilNextAlert = nextAlertMs - now;
    if (msUntilNextAlert <= 0) {
        nextAlertMs += ALERT_INTERVAL;
        msUntilNextAlert = nextAlertMs - now;
    }
    
    const alertTimeout = setTimeout(async () => {
        const timeLeft = expiryDate - Date.now();
        if (timeLeft <= 0) {
            return;
        }

        bot.sendMessage(chatId, `🔔 You have ${formatDuration(timeLeft)} hours left before withdraw protection is disabled.`);

        // compute and save the next alert timestamp
        const newNextAlert = new Date(new Date(nextAlert).getTime() + ALERT_INTERVAL).toISOString();
        
        await dbClient.query(
            `UPDATE pending_timers SET next_alert = $1 WHERE tg_user_id = $2`,
            [newNextAlert, userId]
        );

        // recursively schedule next one
        scheduleAlert({ timers, userId, chatId, bot, expiryDate, nextAlert: newNextAlert, dbClient });

    }, msUntilNextAlert);
       return alertTimeout
    } catch (e) {
        console.error(e)
    }
}

module.exports = scheduleAlert;