const genPositionsMessage = (context, positions) => {
    if (context === 'show_positions') {
        const positions_message = `🌙 Lunar Positions\n\nPositions: <b>1.23 SOL ($185.35)</b>\n\n${positions.map((item, index) => `💰 ${item.ticker_name} - View Chart 📈\n<code>${item.ticker_contract_address}</code>\n• Average Entry: <b>$${Math.floor(item.avg_entry * 1000)}K Market Cap</b>\n• Bought: <code>$${item.amount_bought_usd} USD (${item.user_buys})</code>\n• Sold: <code>$${item.amount_sold_usd} USD (${Math.floor(Math.random() * 3)})</code> \n• Holding: <code>$${item.amount_holding_usd}</code>\n• PnL: <code>${item.pnl_in_usd > 0 ? `$${item.pnl_in_usd} USD (${item.pnl_in_percentage}%) 🟢` : `$${item.pnl_in_usd} USD (${item.pnl_in_percentage}%) 🔴`}</code>\nPNL CARD 🎨\n\n`).join('')}`
        const positions_markup = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{text: '⟵ Back', callback_data: 'back_to_start'}]
                ]
            }
        };
        return {positions_message, positions_markup};
    }
    if (context === 'no_positions') {
        const positions_message = `🌙 Lunar Positions\n\n You don't have any active trades at the moment. \n\nStart trading to see your positions here!`;
        const positions_markup = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{text: '⟵ Back', callback_data: 'back_to_start'}]
                ]
            }
        };
        return {positions_message, positions_markup};
    }
}
module.exports = genPositionsMessage;