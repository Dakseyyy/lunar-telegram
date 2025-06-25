const userStates = require('../memory/userStates/userStates')
const handleInput = require('./handleInput')
const isUserBusy = require('../memory/isUserBusy/isUserBusy')
const autobuyStates = require('../memory/autobuyStates/autobuyStates')
const fetchAutobuyState = require('../helper/autobuy/fetchAutobuyState');
const listeners = (bot) => {

    bot.on('message', async (msg) => {
        
        const chatId = msg.chat.id;
        const state = await userStates.get(chatId)?.state;
        await fetchAutobuyState(msg.from.id);
        console.log(isUserBusy.has(msg.from.id))
        console.log(autobuyStates.get(msg.from.id))

        if (state === 'sell_priority_fee') {
            console.log('processing input...')
            handleInput.feeInput(bot, msg, 'sell_priority_fee')
        }
        if (state === 'buy_priority_fee') {
            handleInput.feeInput(bot, msg, 'buy_priority_fee')
        }
        if (state === 'buy_bribe_fee') {

            handleInput.feeInput(bot, msg, 'buy_bribe_fee')
        }
        if (state === 'sell_bribe_fee') {
            handleInput.feeInput(bot, msg, 'sell_bribe_fee')
        }
        if (state === 'slippage') {
            handleInput.feeInput(bot, msg, 'slippage')
        }
        if (state === 'autobuy'){
            console.log('entered input block')
            handleInput.autobuyInput(bot, msg)
        }
        if (autobuyStates.get(msg.from.id) === true && isUserBusy.has(msg.from.id) === false) {
            console.log('user is autobuying')
            handleInput.purchaseCA(bot, msg)
        }
    })
}

module.exports = listeners