
const msgHandlers = require('./msgHandlers')
const { solPriceFetcher, getSolPrice} = require('../../helper/fetchSolPrice/fetchSolPrice')
solPriceFetcher()
const combiner = (bot) => {
    bot.on('message', (msg) => {
    if (msg.text === '/ping') {
        msgHandlers.pingCommand(bot, msg);
    }
    if (msg.text === '/start') {
        msgHandlers.startCommand(bot, msg, getSolPrice())
    }
    if (msg.text === '/style') {
        msgHandlers.styleCommand(bot, msg)
    }
    if (msg.text === '/settings') {
        msgHandlers.settingsCommand(bot, msg)
    }
})
}
module.exports = combiner;