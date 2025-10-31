const rewardsMessageService = async ({ user_total_rewards, intent, chatId, messageId, bot, unclaimedAccountsAmount, rewardStats }) => {
    try {
        if (intent === 'default') {
            const reward = (unclaimedAccountsAmount * 0.37) + (Number(rewardStats.unclaimed_cashback));
            const formattedReward = reward.toFixed(2); 
            const message = `<b>Lunar Rewards</b> 🎁\n\nEarn rewards based on your trading activity!\n\n<b>· Total Rewards Claimed:</b>${Number(rewardStats.total_rewards_claimed).toFixed(2)}$ \n<b>· Total Unclaimed:</b> ${formattedReward}$`;
            const markup = {
                inline_keyboard: [
                    [
                        { text: `Claim ${formattedReward}$`, callback_data: 'claim_rewards' }
                    ],
                    [
                        { text: '⟵ Back', callback_data: 'back_to_start' },
                    ]

                ]
            }
            await bot.editMessageText(message, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: markup
            })
        }
        if (intent === 'not_enough_rewards') {
            const message = `⚠ Not enough unclaimed rewards.`;
            await bot.sendMessage(chatId, message, {
                parse_mode: 'HTML',

            });

        }
        if (intent === 'successful_claim') {
            const message = `🎁 <b>Rewards claimed successfully! </b>\n\n Keep trading to earn even bigger rewards!`;
            await bot.sendMessage(chatId, message, {
                parse_mode: 'HTML',

            });

        }
    } catch (e) {
        console.error(e)
    }

}

module.exports = rewardsMessageService;