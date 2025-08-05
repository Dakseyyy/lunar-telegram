require('dotenv').config();
const express = require('express')
const TelegramBot = require('node-telegram-bot-api');
const handleCallbackQuery = require('./src/callbacks/handleCallbackQuery');
const combiner = require('./src/commands/combiner/combiner')
const {initBoss} = require('./src/helper/queues/queueClient')

const listeners = require('./src/listeners/listeners');
const toggleWithdrawProtection = require('./src/helper/withdrawProtection/toggleWithdrawProtection');

const token = process.env.BOT_TOKEN;
const url = process.env.RENDER_EXTERNAL_URL || process.env.BOT_URL || null;
const port = process.env.PORT || process.env.BOT_PORT;


if (!url) {
    console.error('No public URL for webhook is set');
}


const bot = new TelegramBot(token, {polling: false})

bot.setWebHook(`${url}/bot${token}`);

const app = express();
app.use(express.json())

app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
})

combiner(bot) // combine commands
listeners(bot); // activate  listeners

toggleWithdrawProtection('initialize', bot)

bot.setMyCommands([
  { command: '/start', description: 'Start the bot' },
  { command: '/settings', description: 'Configure bot settings' },
  { command: '/referrals', description: 'See the referral dashboard'},
  { command: '/positions', description: 'See active trade positions.'}
], {
  scope: { type: 'default' }  // global default for all users
});
bot.on('callback_query', (callbackQuery) => { // initialize callbacks
  handleCallbackQuery(bot, callbackQuery)
})

  app.listen(port, () => {
    console.log(`Bot running on port ${port} with webhook URL: ${url}/token`);
  });

  app.get('/ping', (req, res) => {
    res.send('pong');
  });

module.exports = bot;
initBoss(bot);