const genStartMessage = async(userWallet, userBalanceSOL, userBalanceUSD, hasBalance, context) => {
      
    console.log(context)
    if (context === 'existing_user') {
        const message = `🌙 <b>Welcome to Lunar!</b>\n\nYour trading journey starts here.\n\nWallet: <code>${userWallet}</code>\n<a href="https://solscan.io/account/${userWallet}">🅴 Solscan</a> • <i>Tap to copy</i>\n—\nBalance: <code>${userBalanceSOL} SOL</code> ($${userBalanceUSD} USD)${!hasBalance ? `\n\n🔴 You currently have no SOL.\nTo begin trading, deposit SOL into your wallet.` : ''}\n\nClick on the refresh button to update your balance.`;
        const plainMessage = message.replace(/<[^>]*>/g, '');

        const markup = {
        inline_keyboard: [
            [
                { text: 'Buy', callback_data: 'buy' },
                { text: 'Sell', callback_data: 'sell' }
            ],
            [
                {text: 'Positions', callback_data: 'positions'},
                {text: 'Limit Orders', callback_data: 'limit_orders'}
            ],
            [
                {text: 'Copy Trade', callback_data: 'copy_trade'},
                {text: '💰 Referrals', callback_data: 'referrals'},
                
            ],
            [
                {text: '⚙ Settings', callback_data: 'settings'},
                {text: '💸 Withdraw', callback_data: 'withdraw'}
            ],
            [   
                {text: '🔍 Scan', callback_data: 'scan'},
                {text: '🎁 Rewards', callback_data: 'rewards'},
            ],
            [
                { text: '↻ Refresh', callback_data: 'refresh' }
                
            ]
        ]
    };
        return { message, markup, plainMessage};
    } else if (context === 'new_user') {
        console.log('in new user if block')
        const message = `🌙 Welcome to Lunar!\n\nLooks like you are new around here! 👋\n\nTo get started, you'll need a wallet to store your tokens.`;
        const markup = {
                inline_keyboard: [
                    [{text: '🔐 Create Wallet', callback_data: 'create_wallet'}]
                ]
            
        }
        return {message, markup}
    }
    
    
}

module.exports = genStartMessage;