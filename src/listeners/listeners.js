const userStates = require('../memory/userStates/userStates')
const handleInput = require('./handleInput')
const isUserBusy = require('../memory/isUserBusy/isUserBusy')
const autobuyStates = require('../memory/autobuyStates/autobuyStates')
const fetchAutobuyState = require('../helper/autobuy/fetchAutobuyState');

const listeners = (bot) => {

    bot.on('message', async (msg) => {
        

        const chatId = msg.chat.id;
        const state = await userStates.get(chatId)?.state || await userStates.get(chatId);
        console.log('🚨 Incoming message with state:', state, 'msg:', msg.text);
        await fetchAutobuyState(msg.from.id);


        if (state === 'sell_priority_fee') {

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
        if (state === 'slippage' && userStates.get(chatId)?.intent !== 'copytrades') {
            handleInput.feeInput(bot, msg, 'slippage')
        }
        if (state === 'autobuy'){

            handleInput.autobuyInput(bot, msg)
        }
        if (autobuyStates.get(msg.from.id) === true && isUserBusy.has(msg.from.id) === false) {

            handleInput.purchaseCA(bot, msg)
        }
        if (state === 'update_referral_code'){
            handleInput.handleReferralCodeInput(bot, msg)
        }
        if (state === 'priority_fee_buy' || state === 'priority_fee_sell' || state === 'bribe_fee_buys' || state === 'bribe_fee_sells' || state === 'slippage' || state === 'copytrade_wallet' || state === 'buy_amount' || state === 'toggle_active') {

            handleInput.captureCopytradeInput(bot, msg, state)
        }
        if (state === 'withdraw_solana_amount') {
            handleInput.captureInput(bot, msg)
        }
        if (state === 'choose_wallet') {
            handleInput.captureWalletInput(bot, msg)
        }
        if (state === 'set_contract_address') {
            handleInput.captureBuySettingsInput({bot, msg, intent: 'set_contract_address'})
        }
        if (state === 'set_custom_sol') {
            handleInput.captureBuySettingsInput({bot, msg, intent: 'set_custom_sol'})
        }
        if (state === 'edit_buy_option_1' || state === 'edit_buy_option_2' || state === 'edit_buy_option_3') {
            handleInput.captureBuySettingsInput({bot, msg, intent: 'edit_buy_option'})
        }
        if (state === 'set_contract_address_sell') {
            handleInput.captureSellSettingsInput({bot, msg, intent: 'set_contract_address_sell'})
        }
        if (state === 'set_custom_percent') {
            handleInput.captureSellSettingsInput({bot, msg, intent: 'set_custom_percent'})
        }
        if (state === 'edit_sell_option_1' || state === 'edit_sell_option_2' || state === 'edit_sell_option_3') {
            handleInput.captureSellSettingsInput({bot, msg, intent: 'edit_sell_option'})
        }
    })
}

module.exports = listeners