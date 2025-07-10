const genFeeContextMessage = (feeContext, feeSituation, profileId) => {
    const slippageContext = `<b>🌙 Slippage</b>\n\n🧊Slippage is the difference between the expected price of a trade and the price its actually executed at.\n\nℹ Minimum slippage is 1%.\n\n💡 Higher slippage reduces failed transactions but may give worse prices.\n\nEnter your desired slippage %.`;
    const buyBribeContext = `<b>🌙 Buy Bribe Fee</b>\n\n💰A bribe fee is an additional payment that motivates validators to prioritize your transaction above others, helping you get faster execution in competitive situations.\n\nℹ Minimum buy bribe is 0.00001 SOL.\n\n💡 Higher bribe fees provide faster transactions when network is busy.\n\nEnter your buy bribe fee below.`;
    const sellBribeContext = `<b>🌙 Sell Bribe Fee</b>\n\n💰A bribe fee is an additional payment that motivates validators to prioritize your transaction above others, helping you get faster execution in competitive situations.\n\nℹ Minimum sell bribe is 0.00001 SOL.\n\n💡 Higher bribe fees provide faster transactions when network is busy.\n\nEnter your sell bribe fee below.`;
    const buyPriorityContext = `<b>🌙 Buy Priority Fee</b>\n\n💰Priority fees ensure your transaction gets processed by the blockchain.\n\nℹ Minimum buy priority fee is 0.00001 SOL.\n\n💡 Higher priority fees provide faster confirmation times.\n\nEnter your buy priority fee below.`;
    const sellPriorityContext = `<b>🌙 Sell Priority Fee</b>\n\n💰Priority fees ensure your transaction gets processed by the blockchain. It helps speed up confirmation times.\n\nℹ Minimum buy priority fee is 0.00001 SOL.\n\n💡 Higher priority fees provide faster confirmation times.\n\nEnter your sell priority fee below.`;
    
    const wrongInputMessage = `⚠️ Please provide only the numeric value without any letters or symbols.`
    console.log(feeSituation)
    const markup = {
        inline_keyboard : [
            [
                {text: '⟵ Back', callback_data: `${feeSituation !== 'copytrade' ? 'back_to_fees' : `show_profile_${profileId}`}`}
            ]
        ]
    }
    if (feeContext === 'slippage') {
        return {
            message: slippageContext,
            markup
        }
    }
    if (feeContext === 'buy_bribe_fee'){
        return {
            message: buyBribeContext,
            markup
        }
    }
    if (feeContext === 'sell_bribe_fee'){
        return {
            message: sellBribeContext,
            markup
        }
    }
    if (feeContext === 'buy_priority_fee'){
        return {
            message: buyPriorityContext,
            markup
        }
    }
    if (feeContext === 'sell_priority_fee'){
        return {
            message: sellPriorityContext,
            markup
        }
    }
    if (feeContext === 'wrong_input'){
        return {
            message: wrongInputMessage,
            markup
        }
    }
}

module.exports = genFeeContextMessage;