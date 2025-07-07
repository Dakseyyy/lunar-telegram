const styleCommand = (bot, msg) => {
    const chatId = msg.chat.id;
    const positions = [
  {
    ticker_name: "BONK",
    ticker_contract_address: "So11111111111111111111111111111111111111112",
    amount_bought_usd: 1023.45,
    user_buys: 3,
    amount_sold_usd: 432.15,
    amount_holding_usd: 591.3,
    avg_entry: 0.0000147,
    pnl_in_usd: 87.12,
    pnl_in_percentage: 9.31
  },
  {
    ticker_name: "WIF",
    ticker_contract_address: "Wif1111111111111111111111111111111111111111",
    amount_bought_usd: 534.2,
    user_buys: 2,
    amount_sold_usd: 0,
    amount_holding_usd: 648.8,
    avg_entry: 0.0792,
    pnl_in_usd: 114.6,
    pnl_in_percentage: 21.46
  },
  {
    ticker_name: "MEOW",
    ticker_contract_address: "Meow111111111111111111111111111111111111111",
    amount_bought_usd: 998.75,
    user_buys: 4,
    amount_sold_usd: 998.75,
    amount_holding_usd: 0,
    avg_entry: 0.00246,
    pnl_in_usd: -134.78,
    pnl_in_percentage: -13.49
  }
];

    bot.sendMessage(chatId, `🌙 Lunar Positions\n\nPositions: <b>1.23 SOL ($185.35)</b>\n\n${positions.map((item, index) => `💰 ${item.ticker_name} - View Chart 📈\n<code>${item.ticker_contract_address}</code>\n• Average Entry: <b>$${Math.floor(item.avg_entry * 1000)}K Market Cap</b>\n• Bought: <code>$${item.amount_bought_usd} USD (${item.user_buys})</code>\n• Sold: <code>$${item.amount_sold_usd} USD (${Math.floor(Math.random() * 3)})</code> \n• Holding: <code>$${item.amount_holding_usd}</code>\n• PnL: <code>${item.pnl_in_usd > 0 ? `$${item.pnl_in_usd} USD (${item.pnl_in_percentage}%) 🟢` : `$${item.pnl_in_usd} USD (${item.pnl_in_percentage}%) 🔴`}</code>\nPNL CARD 🎨\n\n`).join('')}`,
         {parse_mode: 'HTML', } 
    
    )
}

module.exports = styleCommand;
