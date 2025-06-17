const genStartMessage = async(userWallet, userBalanceSOL, userBalanceUSD, hasBalance) => {
      const message = `🌙 <b>Welcome to Lunar!</b>\n\nYour trading journey starts here.\n\nWallet: <code>${userWallet}</code>\n<a href="https://solscan.io/account/${userWallet}">🡕 Solscan</a> • <i>Tap to copy</i>\n—\nBalance: <code>${userBalanceSOL} SOL</code> ($${userBalanceUSD} USD)${!hasBalance ? `\n\n🔴 You currently have no SOL.\nTo begin trading, deposit SOL into your wallet.` : ''}`;
        const plainMessage = message.replace(/<[^>]*>/g, '');

    const markup = {
        inline_keyboard: [
            [
                { text: 'Buy', callback_data: 'buy' },
                { text: 'Sell', callback_data: 'sell' }
            ],
            [{ text: 'Refresh', callback_data: 'refresh' }]
        ]
    };
    
    return { message, markup, plainMessage};
}

module.exports = genStartMessage;