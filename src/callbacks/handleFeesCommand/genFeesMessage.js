const genFeesMessage = (slippage, buy_priority_fee, buy_bribe_fee, sell_priority_fee, sell_bribe_fee, mev_protect, fee_preset) => {
    const message = `🌙 Fee Settings\n\n<b>FAQ:</b>\n\n<b>🏎 Fast/Turbo/Custom Presets:</b> Select a pre-determined fee preset or create a custom one. Higher fees result in faster transactions.\n\n🛡 MEV Protection: Prevents sandwich / frontrunning attacks. May <b>slow</b> down transactions.\n\n🧊 Slippage: The difference between the expected price and the actual price you get when trading.`
    
    const checkPreset = (feeLabel, key) => {
        return fee_preset === key ? `${feeLabel} ✅` : feeLabel;
    }
    
    const markup = {
        inline_keyboard: [
            [
                {text: checkPreset(`🏎 Fast`, 'fast'), callback_data: `fast`},
                {text: checkPreset(`⚡ Turbo`, 'turbo'), callback_data: `turbo`},
                {text: checkPreset(`Custom`, 'custom'), callback_data: `custom`}
            ],
            [
                {text: `${mev_protect ? `🛡 MEV Protect 🟢` : `🛡 MEV Protect 🔴`}`, callback_data: `mev_protect`},
                {text: `Slippage: ${slippage}%`, callback_data: 'slippage'}
            ],
            [
                {text: `Buy Priority: ${buy_priority_fee} SOL`, callback_data: `buy_priority_fee`},
                {text: `Sell Priority: ${sell_priority_fee} SOL`, callback_data: `sell_priority_fee`},
            ],
            [
                {text: `Buy Bribe: ${buy_bribe_fee} SOL`, callback_data: `buy_bribe_fee`},
                {text: `Sell Bribe: ${sell_bribe_fee} SOL`, callback_data: `sell_bribe_fee`}
            ],
            [
                {text: `⟵ Back`, callback_data: `back_to_settings`}
            ]
            

        ]
    }
    return {message, markup}
}

module.exports = genFeesMessage;


