

const withdraw = require('../withdraw/withdraw');
require('dotenv').config({ path: '../../../.env' });
const PgBoss = require('pg-boss')
const boss = new PgBoss({
  connectionString: process.env.DATABASE_URL,
  retryLimit: 0
});
const dbClient = require('../dbConnect/dbClient')
boss.on('error', console.error)
async function initBoss(bot) {
  await boss.start();
  await boss.createQueue('withdraw', {
    retryLimit: 0,
  });
  // Define the actual job logic here

boss.work('withdraw', async ([job]) => {
    const data = job.data;
    try {
      const response = await dbClient.query('DELETE FROM pending_withdrawals WHERE withdrawal_id = $1', [data.pendingWithdrawal]);
    } catch(e) {
      console.error(e)
    }
    await withdraw({userId: data.userId, bot, intent: data.intent, chatId: data.chatId, withdrawal_id: data.pendingWithdrawal});
    
    
    return;
  });
  console.log('pg-boss is ready');
}
module.exports = {
  initBoss,
  boss
}
boss.on('error', (error) => {
  console.error('PgBoss error:', error);
});