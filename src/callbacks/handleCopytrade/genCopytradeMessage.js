const shortenWalletAddress = require('../../helper/shortenWalletAddress/shortenWalletAddress')
const genCopyTradeMessage = (context, profiles, profile, profileId) => {
    try {
    if (context === 'show_copytrade') {
        console.log(profiles)
        const copytrade_message = `🌙 <b>Lunar Copytrade</b>\n\nYour account copies another trader’s actions in real time, so you trade just like them without managing everything yourself.\n\n💡 Create and manage multiple copytrading profiles below.`
        const copytrade_markup = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{text: '➕ New', callback_data: 'new_copytrade_profile'}],
                    ...profiles.map((profile, index) => [{text: `${shortenWalletAddress(profile.copytrade_wallet)} ${profile.active ? '🟢' : '🔴'}`, callback_data: `show_profile_${profile.profile_id}`}]),
                    [{text: '⟵ Back', callback_data: 'back_to_start'}]
                ]
            }
        };
        return {copytrade_message, copytrade_markup}
    } else if (context === 'show_profile') {
         const copytrade_message = `🌙 <b>Lunar Copytrade</b>\n\nYour account copies another trader’s actions in real time, so you trade just like them without managing everything yourself.\n\n💡 Create and manage multiple copytrading profiles below.`
         console.log(profile)
        const copytrade_markup = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{text: ` Buy Amount: ${profile.buy_amount} SOL`, callback_data: `change_buy_amount_${profile.profile_id}`}],
                    [   
                        {text: ` Buy Priority: ${profile.priority_fee_buy} SOL`, callback_data: `change_buy_prio_${profile.profile_id}`},
                        {text: ` Sell Priority: ${profile.priority_fee_sell} SOL`, callback_data: `change_sell_prio_${profile.profile_id}`}
                    ],
                    [
                        {text: ` Buy Bribe: ${profile.bribe_fee_buys} SOL`, callback_data: `change_buy_bribe_${profile.profile_id}`},
                        {text: ` Sell Bribe: ${profile.bribe_fee_sells} SOL`, callback_data: `change_sell_bribe_${profile.profile_id}`}
                    ],
                    [
                        {text: `🧊 Slippage: ${profile.slippage}%`, callback_data: `change_slippage_${profile.profile_id}`}
                    ],
                    [
                        {text: `Active: ${profile.active ? '🟢' : '🔴'}`, callback_data: `toggle_active_${profile.profile_id}`}
                    ],
                    [
                        {text: `Wallet: ${profile.copytrade_wallet === null ? '───' : shortenWalletAddress(profile.copytrade_wallet)}`, callback_data: `change_wallet_${profile.profile_id}`}
                    ],
                    [{text: '⟵ Back', callback_data: 'back_to_copytrade'}, {text: '🗑 Delete', callback_data: `delete_copytrade_profile_${profile.profile_id}`}]
                ]
            }
        };
        return {copytrade_message, copytrade_markup}
    } else if (context === 'copytrade_wallet') {
        const copytrade_message = `🌙 <b>Copytrade Wallet</b>\n\n The Copytrade Wallet is the wallet you choose to mirror. \n\n💡 Its trades will be copied to your own wallet automatically.\n\nEnter the address of the wallet you’d like to copytrade below.`;
        const copytrade_markup = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{text: '⟵ Back', callback_data: `show_profile_${profileId}`}]
                ]
            }
        };
        return {copytrade_message, copytrade_markup}
    } else if (context === 'buy_amount') {
        const copytrade_message = `🌙 <b>Buy Amount</b>\n\nSelect how much SOL to use for each copy-trade transaction.\n\nEnter your preferred SOL amount below.`;
        const copytrade_markup = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{text: '⟵ Back', callback_data: `show_profile_${profileId}`}]
                ]
            }
        };
        return {copytrade_message, copytrade_markup}
    }
    } catch (e) {
        console.error(e)
    }
}

module.exports = genCopyTradeMessage;