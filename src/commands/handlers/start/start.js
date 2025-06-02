const startCommand = (bot, msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id
    bot.sendMessage(chatId, `UserID: ${userId}`)
}

module.exports = startCommand;