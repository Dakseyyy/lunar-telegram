const shortenWalletAddress = require('../../helper/shortenWalletAddress/shortenWalletAddress')
const genCopyTradeMessage = (context, profiles) => {
    if (context === 'show_copytrade') {
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
    }
}

module.exports = genCopyTradeMessage;