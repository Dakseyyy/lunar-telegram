const isValidCA = require('./isValidCA')
const autobuy = async (bot, msg) => {

    try {
        console.log('called!')
    const chatId = msg.chat.id
    const userId = msg.from.id

    if (isValidCA(msg.text)) {
        await bot.sendMessage(chatId, 'buying...')
    } else {
        console.log('invalid')
        return;
    }
    } catch (e) {
        console.error(e)
    }
}

module.exports = autobuy;