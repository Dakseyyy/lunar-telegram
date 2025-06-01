const pingCommand = (bot, msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'pong')
}

module.exports = pingCommand;