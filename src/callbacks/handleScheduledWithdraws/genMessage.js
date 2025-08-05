const formatTime = require("./formatTime");

async function genMessage({ type, bot, chatId, messageId, pendingWithdraws}) {
    try {
        if (type === 'default') {
            const default_withdraw_message = `🌙 <b>Scheduled Withdraws</b>\n\n You’ll see pending withdrawals here if withdrawal protection is enabled.\n\n${pendingWithdraws.map((withdraw, index) => 
                `[${index + 1}]\nTime Remaining: <code> ${formatTime(withdraw.expires_at).hours > 0 ? formatTime(withdraw.expires_at).hours + ' hours, ' : ''}${formatTime(withdraw.expires_at).minutes} minutes </code>` + `\nTo: <code>${withdraw.to}</code>` + `\nSOL Amount: <code>${withdraw.sol_amount}</code> SOL\n—`
            ).join('\n')}`
            const default_withdraw_markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        ...pendingWithdraws.map((withdraw, index) => [{text: `🗑️ [${index + 1}]`, callback_data: `cancel_withdraw_${withdraw.withdrawal_id}`}]),
                        [{ text: '⟵ Back', callback_data: 'withdraw' }]
                    ]
                }
            }
            await bot.editMessageText(default_withdraw_message, {
                chat_id: chatId,
                message_id: messageId,
                ...default_withdraw_markup
            });
        }

    } catch (e) {
        console.error(e);
    }
}

module.exports = genMessage;