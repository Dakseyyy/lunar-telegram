
const msgHandlers = require('./msgHandlers')
const combiner = (bot) => {
    bot.on('message', (msg) => {
    if (msg.text === '/ping') {
        msgHandlers.pingCommand(bot, msg);
    }
    if (msg.text === '/start') {
        msgHandlers.startCommand(bot, msg)
    }
})
}
module.exports = combiner;