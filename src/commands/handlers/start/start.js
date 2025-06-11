const dbClient = require('../../../helper/dbConnect/dbClient');
const startCommand = (bot, msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id
    bot.sendMessage(chatId, `🌙 Welcome to Lunar Bot!`)
}

module.exports = startCommand;