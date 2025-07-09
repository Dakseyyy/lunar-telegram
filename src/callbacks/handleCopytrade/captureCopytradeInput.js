const userStates = require('../../memory/userStates/userStates');
const isValidNumber = require('../../helper/isValidNumber/isValidNumber')
const captureCopytradeInput = async (bot, msg, context) => {
    if (isValidNumber(msg.text)) {
        if (context === 'slippage' && parseFloat(msg.text) < 1) {
            await bot.sendMessage()
        }
    } else {
        
    }
}

module.exports = captureCopytradeInput;