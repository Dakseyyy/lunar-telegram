const handleMessageDelete = async (chatId, messageId, bot) => {
    await bot.deleteMessage(chatId, messageId)
}

module.exports = handleMessageDelete;