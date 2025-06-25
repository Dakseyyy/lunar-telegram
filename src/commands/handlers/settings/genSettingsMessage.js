const genSettingsMessage = (withdraw_protection, autobuy, context, pending_withdraw) => {
    console.log(pending_withdraw)
    const settingsMessage = `🌙<b>Lunar Settings</b>\n\n🔐Withdraw Protection: Enable a 24-hour cooldown when withdrawing to a new or unrecognized wallet. This helps protect your funds if your Telegram account is ever compromised.\n\n⛽ Fees: Customize the fees you pay per transaction. Higher fees prioritize your transaction, resulting in faster processing times.\n\n⚙ Autobuy: Automatically purchase a fixed amount whenever you paste a contract address into the chat.`
    const settingsMarkup = {
        inline_keyboard: [

            [
                {text: '⛽ Fees', callback_data: 'fees'},
                {text: `⚙ Autobuy ${autobuy ? '🟢' : '🔴'}`, callback_data: 'autobuy'},
                
            ],
            [
                {text: `🔐 Account Security ${pending_withdraw ? '🟠' : withdraw_protection ? '🟢' : '🔴'}`, callback_data: `withdraw_protection`},
            ],
            [
                {text: `⟵ Back`, callback_data: `back_to_start`}
            ],
            
        ]
    }

    const withdraw_protection_message = `🌙 <b>Withdraw Protection</b>\n\n🔐 Withdraw protection has been <b>${withdraw_protection ? 'enabled.' : 'disabled.'}</b>\n\n💡 ${withdraw_protection ? `Turning it off will take 24 hours, and you'll be notified every 6 hours during the cooldown.` : `Withdraw protection is still on, changes will take effect after a 24-hour cooldown. We'll remind you every 6 hours until it's fully disabled.`}`;
    const withdraw_protection_markup = {
        inline_keyboard: [
            [
                {text: `🗑 Close`, callback_data: `silent_delete_message`}
            ],
            
        ]
    }
    const wp_pending_message = `🌙 <b>Withdraw Protection</b>\n\n🔐 Withdraw protection is being <b>turned off</b>.\n\n💡 Withdraw protection is still on, changes will take effect after a 24-hour cooldown. We'll remind you every 6 hours until it's fully disabled.`;
    const wp_pending_markup = {
        inline_keyboard: [
            [
                {text: `🗑 Close`, callback_data: `silent_delete_message`}
            ],
            
        ]
    }
    if (context === 'settings') {
        return {message: settingsMessage, markup: settingsMarkup}
    } else if (context ==='withdraw_protection') {
        return {withdraw_context_message: withdraw_protection_message, withdraw_context_markup: withdraw_protection_markup}
    } else if (context === 'wp_pending_disable'){
        return {wp_pending_message, wp_pending_markup}
    }
    
}

module.exports = genSettingsMessage;