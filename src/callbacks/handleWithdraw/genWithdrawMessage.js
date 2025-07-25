const genWithdrawMessage = (context, data) => {
    try {
         if (context === 'default') {
            
        const default_withdraw_message = `🌙 <b>Withdraw</b>\n\n💰 Balance: 1 SOL ($177.43)  \n\n💡 Always double‑check the withdrawal address before confirming a withdrawal.`
        const default_withdraw_markup = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{text: '100%', callback_data: 'withdraw_100%'}, {text: 'x SOL', callback_data: 'withdraw_custom_sol'}],
                    [{text: '💸 Withdrawal Address: ───', callback_data: 'withdraw_address'}],
                    [{text: '✅ Withdraw', callback_data: 'try_withdraw'}],
                    [{text: '⟵ Back', callback_data: 'back_to_start'}]
                ]
            }
        }
        return {default_withdraw_message, default_withdraw_markup}
        };
        
    } catch (e) {

    }
}



module.exports = genWithdrawMessage;