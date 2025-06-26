const isValidCA = require('./isValidCA')
const autobuy = async (bot, msg) => {

    try {

    const chatId = msg.chat.id
    const userId = msg.from.id

    if (isValidCA(msg.text)) {
        await bot.sendMessage(chatId, 'buying...')
    } else {

        return;
    }
    } catch (e) {
        console.error(e)
    }
}

module.exports = autobuy;