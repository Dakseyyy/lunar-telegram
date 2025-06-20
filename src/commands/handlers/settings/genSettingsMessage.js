const genSettingsMessage = (slippage, priority_fee, bribe_fee, mev_protect) => {
    const message = `🌙<b>Lunar Settings</b>\n\n🔐Account Security: Enable a 24-hour cooldown when withdrawing to a new or unrecognized wallet. This helps protect your funds if your Telegram account is ever compromised.\n\n⛽ Fees: Customize the fees you pay per transaction. Higher fees prioritize your transaction, resulting in faster processing times.\n\n⚙ Autobuy: Automatically purchase a fixed amount whenever you paste a contract address into the chat.`
    const markup = {
        inline_keyboard: [
            /*[
                {text: `🏎 Fast`, callback_data: `fast`},
                {text: `⚡ Turbo`, callback_data: `turbo`},
                {text: `Custom`, callback_data: `custom`}
                
            ],
            [
                {text: `🛡 MEV Protect`, callback_data: `mev_protect`},
                {text: `Autobuy`, callback_data: `autobuy`}
            ],
            */
            [
                {text: '⛽ Fees', callback_data: 'fees'},
                {text: '⚙ Autobuy', callback_data: 'autobuy'},
                
            ],
            [
                {text: `🔐 Account Security 🔴`, callback_data: `account_security`},
            ],
            [
                {text: `⟵ Back`, callback_data: `back_to_start`}
            ],
            
        ]
    }
    return {message, markup}
}

module.exports = genSettingsMessage;