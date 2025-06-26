
const msgHandlers = require('./msgHandlers')
const { solPriceFetcher, getSolPrice} = require('../../helper/fetchSolPrice/fetchSolPrice')
const isUserBusy = require('../../memory/isUserBusy/isUserBusy')
solPriceFetcher()
const combiner = (bot) => {
    try {
    bot.on('message', (msg) => {
        if (isUserBusy.has(msg.from.id) === true) {

            return;
        }
    if (msg.text === '/ping') {
        msgHandlers.pingCommand(bot, msg);
    }
    if (msg.text === '/start' || msg.text.startsWith('/start ')) {
        const isReferrer = msg.text.match(/^\/start(?:\s+(.+))?/);
        if (isReferrer) {
            console.log(`Referred by ${isReferrer[1]}`)
        }
        msgHandlers.startCommand(bot, msg, getSolPrice())
    }
    if (msg.text === '/style') {
        msgHandlers.styleCommand(bot, msg)
    }
    if (msg.text === '/settings') {
        msgHandlers.settingsCommand(bot, msg)
    }
})
    } catch (e) {
        console.error(e)
    }
    
}
module.exports = combiner;