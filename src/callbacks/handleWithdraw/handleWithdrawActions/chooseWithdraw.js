const dbClient = require('../../../helper/dbConnect/dbClient');
const withdraw = require('../../../helper/withdraw/withdraw');
const { getuserWallet } = require('../../../helper/withdraw/walletServices');
const { boss } = require('../../../helper/queues/queueClient');
const fetchSolBal = require('../../../helper/fetchSolBal/fetchSolBal');
const chooseWithdraw = async ({ userId, chatId, bot, messageId }) => {
    const userWithdrawSettings = (await dbClient.query('SELECT * FROM withdraw_settings WHERE tg_user_id = $1', [userId])).rows[0];
    const hasWithdrawProtection = (await dbClient.query('SELECT withdraw_protection FROM user_account_settings WHERE tg_user_id = $1', [userId])).rows[0].withdraw_protection;
    const numOfWithdraws = (await dbClient.query('SELECT COUNT(*) FROM pending_withdrawals WHERE tg_user_id = $1', [userId])).rows[0].count;
    if (numOfWithdraws >= 5) {
        bot.sendMessage(chatId, '⚠️ Withdrawal limit reached. You can cancel a withdrawal or wait until one completes.');
        return;
    }
    const userWallet = await getuserWallet(userId);
    console.log(numOfWithdraws);
    for (const [setting_property, setting_value] of Object.entries(userWithdrawSettings)) {
        if (setting_value === null) {
            bot.sendMessage(chatId, '⚠️ Complete your withdrawal settings before you can withdraw.');
            return;

        }
    }

    if (hasWithdrawProtection === false) {
        if (userWithdrawSettings.withdraw_choice === 'solana') {
            withdraw({ userId, bot, chatId, intent: 'solana' })
        } else if (userWithdrawSettings.withdraw_choice === 'percent') {
            withdraw({ userId, bot, chatId, intent: 'percent' })
        }
    } else if (hasWithdrawProtection === true) {
        const timestamp24hrLater = new Date(Date.now() + 24 * 60 * 60 * 1000);

        bot.sendMessage(chatId, 'Withdrawal successfully added to the queue. \n\n💡 Withdraw protection is currently enabled. To avoid cooldown periods, consider turning it off.')
        if (userWithdrawSettings.withdraw_choice === 'solana') {
            console.log('solana choice')
            const pendingWithdrawal = (await dbClient.query('INSERT INTO pending_withdrawals (tg_user_id, expires_at, "to", "from", sol_amount) VALUES ($1, $2, $3, $4, $5) RETURNING withdrawal_id', [userId, timestamp24hrLater, userWithdrawSettings.withdrawal_address, userWallet, userWithdrawSettings.sol_amount])).rows[0].withdrawal_id;
            const oneMinuteLater = new Date(Date.now() + 60 * 1000);
            console.log(pendingWithdrawal)
            console.log(typeof new Date(Date.now() + 60000));
            const jobId = await boss.send('withdraw', { userId, chatId, intent: 'solana', pendingWithdrawal }, { startAfter: 24 * 60 * 60 });
            await dbClient.query(
                'UPDATE pending_withdrawals SET boss_job_uuid = $1 WHERE withdrawal_id = $2',
                [jobId, pendingWithdrawal]
            );

        } else if (userWithdrawSettings.withdraw_choice === 'percent') {
            console.log('percent is called')
            const userSOLBalance = await fetchSolBal(userWallet)
            const pendingWithdrawal = (await dbClient.query('INSERT INTO pending_withdrawals (tg_user_id, expires_at, "to", "from", sol_amount) VALUES ($1, $2, $3, $4, $5) RETURNING withdrawal_id', [userId, timestamp24hrLater, userWithdrawSettings.withdrawal_address, userWallet, userSOLBalance])).rows[0].withdrawal_id;
            const oneMinuteLater = new Date(Date.now() + 24 * 60 * 60 * 1000);
            console.log(typeof new Date(Date.now() + 60000));
            const jobId = await boss.send('withdraw', { userId, chatId, intent: 'percent', pendingWithdrawal }, { startAfter: 24 * 60 * 60 });
            await dbClient.query(
                'UPDATE pending_withdrawals SET boss_job_uuid = $1 WHERE withdrawal_id = $2',
                [jobId, pendingWithdrawal]
            );

        }
    }

}

module.exports = chooseWithdraw;