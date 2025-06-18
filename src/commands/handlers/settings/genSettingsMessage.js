const genSettingsMessage = (slippage, priority_fee, bribe_fee) => {
    const message = `🌙<b>Welcome to Lunar!</b>\n\n💡 Choose between your own custom fee or select one of the presets!\n\nMEV \n\nHigher fees lead to faster transactions.`
    const markup = {
        inline_keyboard: [
            [
                {text: '🏎 Fast', callback_data: 'fast'},
                {text: '⚡ Turbo', callback_data: 'turbo'},
                {text: 'Custom', callback_data: 'custom'}
                
            ]
        ]
    }
}

module.exports = genSettingsMessage;