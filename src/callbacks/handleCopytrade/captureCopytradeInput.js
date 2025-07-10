const userStates = require('../../memory/userStates/userStates');
const isValidNumber = require('../../helper/isValidNumber/isValidNumber')
const processCopytradeInput = require('./processCopytradeInput');
const isValidSolanaAddress = require('../../helper/checkWalletFormat/checkWalletFormat');
const captureCopytradeInput = async (bot, msg, context) => {
    try {
            const chatId = msg.chat?.id || msg.message.chat.id;
            const userId = msg.from?.id || msg.message.from.id;

            console.log('called capture inside function')
            if (context === 'copytrade_wallet') {
                if (isValidSolanaAddress(msg.text)) {
                   processCopytradeInput(bot, msg, userStates.get(chatId)?.state, userStates.get(chatId)?.profileId)
                    return;
                } else {
                     await bot.sendMessage(chatId, '⚠️ Invalid Address!', {
                reply_markup: {inline_keyboard: [[{text: '⟵ Back', callback_data: `show_profile_${userStates.get(chatId)?.profileId}`}]]}
            })
            return;
                }
            }
    if (isValidNumber(msg.text)) {
        if (context === 'slippage' && parseFloat(msg.text) < 1) {
            await bot.sendMessage(chatId, '⚠️ Slippage must be greater than 1%', {
                reply_markup: {inline_keyboard: [[{text: '⟵ Back', callback_data: `show_profile_${userStates.get(chatId)?.profileId}`}]]}
            })
            return;
        } else if (context !== 'slippage' && parseFloat(msg.text) < 0.00001) {
                await bot.sendMessage(chatId, '⚠️ Can not be less than 0.00001 SOL', {
                reply_markup: {inline_keyboard: [[{text: '⟵ Back', callback_data: `show_profile_${userStates.get(chatId)?.profileId}`}]]}
                
            })
            return;
        }
        processCopytradeInput(bot, msg, userStates.get(chatId)?.state, userStates.get(chatId)?.profileId)
    } else {
        console.log('logging.....')
         await bot.sendMessage(chatId, '⚠️ Please provide only the numeric value without any letters or symbols.', {
                reply_markup: {inline_keyboard: [[{text: '⟵ Back', callback_data: `show_profile_${userStates.get(chatId)?.profileId}`}]]}
            })
            return;
        
    }
    } catch(e) {
        console.error(e)
    }
}

module.exports = captureCopytradeInput;