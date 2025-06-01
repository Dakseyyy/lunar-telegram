
const msgHandlers = require('./msgHandlers')
const combiner = (bot) => {
    bot.on('message', (msg) => {
    if (msg.text === '/ping') {
        msgHandlers.pingCommand(bot, msg);
    }
})
}
module.exports = combiner;