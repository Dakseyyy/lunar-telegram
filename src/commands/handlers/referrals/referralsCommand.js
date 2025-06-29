const genReferralsMessage = require('./genReferralsMessage')
const referralCommand = async (bot, msg) => {
    try {
        const chatId = msg.chat?.id || msg.message.chat.id;
        const userId = msg.from?.id || msg.message.from.id;
        const {caption, image, markup} = genReferralsMessage('referral_page')
        bot.sendPhoto(chatId, image, {
            caption: caption,
            parse_mode: 'HTML',
            reply_markup: markup
    })
    } catch (e) {
        console.error(e)
    }
    
}
module.exports = referralCommand;