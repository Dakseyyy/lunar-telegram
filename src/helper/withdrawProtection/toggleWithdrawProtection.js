const dbClient = require('../dbConnect/dbClient');
const scheduleTimer = require('./scheduleTimer');



const toggleWithdrawProtection = async (intent, bot, userId, chatId, expiresAt, nextAlert) => {

    if (intent === 'initialize') {
        const allTimers = await dbClient.query('SELECT * FROM pending_timers');
        if (allTimers.rows[0]) {
            allTimers.rows.forEach(timer => {   

                scheduleTimer(parseFloat(timer.tg_user_id), parseFloat(timer.chat_id), bot, timer.expires_at, 'x', timer.next_alert)
            })

        }
        
    } else if (intent === 'new_timer') {

        scheduleTimer(userId, chatId, bot, expiresAt, 'x', nextAlert)
    } else if (intent === 'cancel') {


        scheduleTimer(userId, 'x', 'x', 'x', 'cancel')
       
    }
}

module.exports = toggleWithdrawProtection;