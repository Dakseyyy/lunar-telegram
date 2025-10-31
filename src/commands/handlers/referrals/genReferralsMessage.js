const fs = require('fs')
const path = require('path')
const genReferralsMessage = (context, referral_code, unclaimed_sol, claimed_sol, users_referred_indirect, users_referred_direct) => {
    if (context === 'new_referral') {
        const message = `🎉 Congrats!\n\nYou've successfully activated a referral.\n\n🎁 Enjoy 10% of all fees, forever!`;
        const markup = {
                inline_keyboard: [
                    [{text: '🗑 Close', callback_data: 'silent_delete_message'}]
                ]
            
        }
        return {message, markup}
    } if (context === 'referral_page') {
        console.log(unclaimed_sol)
        const caption = `🌙 <b>Lunar Referral Program</b>\n\nGrow your rewards and earn passive rewards through our streamlined 3-level referral system:\n\n• <b>Level 1 (Direct):</b> 35% commission\n• <b>Level 2:</b> 3% commission\n• <b>Level 3:</b> 2% commision.\n\nRewards are available to claim at any time, with no thresholds or minimums required.\n\n<b>Referral Stats:</b>\n• Referred users: ${users_referred_direct} Direct, ${users_referred_indirect} Indirect\n• Total rewards earned: ${claimed_sol} SOL\n\nYour link to share:\n<code>https://t.me/lunarsolana_bot?start=${referral_code}</code>\n\nClaim rewards anytime. Powered by Lunar.`;
        const markup = {
            inline_keyboard: [
                    [{text: `🔑 Change Referral Code`, callback_data: 'update_referral_code'}],
                    [{text: `Unclaimed SOL: ${unclaimed_sol} SOL`, callback_data: 'claim_referral_sol'}],
                    [{text: `🗑 Close`, callback_data: 'silent_delete_message_and_go_start'}]
                ]
        }
        const referralDiagram = {
            source: fs.createReadStream(path.join(__dirname, 'referral_diagram.png')),
            filename: 'referral_diagram.png',
            contentType: 'image/png'
};

        return{caption, markup, image: referralDiagram.source}
    }
    
}
module.exports = genReferralsMessage;