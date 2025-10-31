
const msgHandlers = require('./msgHandlers')
const { solPriceFetcher, getSolPrice } = require('../../helper/fetchSolPrice/fetchSolPrice')
const isUserBusy = require('../../memory/isUserBusy/isUserBusy')
const quickSell = require('../handlers/quickSell')
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
                const parts = msg.text.split(' '); // "/start sell_ABCDE123"
                const payload = parts[1]; // may be undefined if just "/start"
                if (payload && payload.startsWith('sell_')) {
                    const tokenMint = payload.split('_')[1];
                    bot.deleteMessage(msg.chat.id, msg.message_id);
                    console.log(tokenMint)
                    console.log('selling')
                    quickSell({bot, userId: msg.from.id, chatId: msg.chat.id})
                    return;
                }

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
            if (msg.text === '/positions') {
                msgHandlers.positionsCommand(bot, msg)
            }
        } catch (e) {
            console.error(e)
        }
    })


}
module.exports = combiner;