async function claimReferralMessageService(context, bot, chatId, sig) {
    try {
        if (context === 'not_enough_sol') {
            bot.sendMessage(chatId, '⚠ Minimum amount to claim is 0.01 SOL');
        }
        if (context === 'success') {
            bot.sendMessage(
                chatId,
                `🎁 <b>Referral rewards successfully claimed!</b>\n\n<a href="https://solscan.io/tx/${sig}">View transaction </a>`,
                { parse_mode: 'HTML', disable_web_page_preview: true }
            );

        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = claimReferralMessageService;