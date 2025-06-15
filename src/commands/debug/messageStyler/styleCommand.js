const styleCommand = (bot, msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `*✨ Your Wallet Has Been Created\\!* \n\nAddress: \`7ibokqrppW2Xw6NiARvDs7YPvrhQrsK4AjrtgejXd3XY\`\n\nPrivate Key: ||7ibokqrppW2Xw6NiARvDs7YPvrhQrsK4AjrtgejXd3XY||\n\n 🔑 Security Notice: \nThis is the *only time* your private key will be shown\\. Store it securely and do *not* share it with anyone\\. Once this message is deleted, it can not be recovered\\.`,
         {parse_mode: 'MarkdownV2', reply_markup: {
            inline_keyboard: [
                [
                    {text: '🗑️ Close', callback_data: 'delete_message'}
                ]
            ]
         }} 
    
    )
}

module.exports = styleCommand;