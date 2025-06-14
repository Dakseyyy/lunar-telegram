const styleCommand = (bot, msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `🌙 Welcome to Lunar! \n\n*Your Wallet Has Been Created 🟩\n\n🔑Never *`, {parse_mode: 'Markdown'})
}

module.exports = styleCommand;