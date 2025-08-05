const dbClient = require('../../helper/dbConnect/dbClient');
const { boss } = require('../../helper/queues/queueClient');
const handleScheduledWithdraws = require('./handleScheduledWithdraws');
async function cancelWithdraw(bot, callbackQuery) {
    try {
        const chatId = callbackQuery.message.chat.id;
        const userId = callbackQuery.from.id;
        const messageId = callbackQuery.message.message_id;
        const withdrawal_id = callbackQuery.data.replace('cancel_withdraw_', '');
        const pendingWithdraw = (await dbClient.query('SELECT * FROM pending_withdrawals WHERE withdrawal_id = $1', [withdrawal_id])).rows;
        if (!pendingWithdraw[0]) {
            bot.sendMessage(chatId, '⚠️ Withdrawal Request no longer exists');
            return;
        }
        const jobId = pendingWithdraw[0].boss_job_uuid
        console.log(typeof jobId)
        boss.cancel('withdraw', pendingWithdraw[0].boss_job_uuid);
        (await dbClient.query('DELETE FROM pending_withdrawals WHERE withdrawal_id = $1', [withdrawal_id]));
        console.log(pendingWithdraw[0].boss_job_uuid)
        handleScheduledWithdraws(bot, callbackQuery);
    } catch (e) {
        console.error(e);
    }
}
module.exports = cancelWithdraw;
