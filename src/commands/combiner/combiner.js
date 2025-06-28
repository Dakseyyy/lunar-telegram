
const msgHandlers = require('./msgHandlers')
const { solPriceFetcher, getSolPrice} = require('../../helper/fetchSolPrice/fetchSolPrice')
const isUserBusy = require('../../memory/isUserBusy/isUserBusy')
solPriceFetcher()
const combiner = (bot) => {
    
    bot.on('message', (msg) => {
        try {
        if (isUserBusy.has(msg.from.id) === true || typeof msg.text !== 'string') {
            return;
        }
    if (msg.text === '/ping') {
        msgHandlers.pingCommand(bot, msg);
    }
    if (msg.text.startsWith('/start')) {

        msgHandlers.startCommand(bot, msg, getSolPrice())
    }
    if (msg.text === '/style') {
        msgHandlers.styleCommand(bot, msg)
    }
    if (msg.text === '/settings') {
        msgHandlers.settingsCommand(bot, msg)
    }
    if (msg.text === '/referrals') {
        msgHandlers.referralCommand(bot, msg);
    }

    } catch (e) {
        console.error(e)
    }
})
    
    
}
module.exports = combiner;