const genAutoBuyMessage = (context, buyAmount) => {
    if (context === 'autobuy') {

        const autobuyMessage = `🌙 Autobuy\n\n⚡Autobuy: Automatically buy any contract address pasted into the chat. \n\n💡${parseFloat(buyAmount) === 0 ? `You currently do not have a buy amount set.` : `Your current buy amount is <b>${buyAmount} SOL</b>.`} \n\nEnter your buy amount below.`;
         const autobuyMarkup = {
        inline_keyboard : [
            [
                {text: '⟵ Back', callback_data: 'back_to_settings_from_autobuy'}
            ]
        ]
    }
    return {autobuyMessage, autobuyMarkup}
    }
}

module.exports = genAutoBuyMessage;