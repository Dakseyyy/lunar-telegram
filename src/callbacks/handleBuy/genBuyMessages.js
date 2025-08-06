const shortenCA = require("./checks/shortenCA")

async function genBuyMessages({ intent, bot, data, messageId, chatId }) {
    try {
        if (intent === 'default') {
            const message = `🌙 <b>Lunar Buy</b>\n\nPlease enter the contract address you want to buy, then choose one of the quick buy options. \n\n💡 You can update these options at any time to match your preferences.`

            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: `Contract Address: ${data.contract_address === null ? '⸺': shortenCA(data.contract_address)}`, callback_data: 'set_contract_address' }],
                        [{ text: `${data.buy_option_1} SOL`, callback_data: 'buy_option_1' }, { text: `${data.buy_option_2} SOL`, callback_data: 'buy_option_2' }, { text: `${data.buy_option_3} SOL`, callback_data: 'buy_option_3' },],
                        [{ text: `x SOL`, callback_data: 'set_custom_sol' }],
                        [{ text: '⟵ Back', callback_data: 'back_to_start' }, { text: `✏️ Edit Buy Options`, callback_data: 'edit_buy_options' }]
                    ]
                }
            }
            const messageToDelete = bot.editMessageText(message, {
                ...markup,
                chat_id: chatId,
                message_id: messageId
            })
        } else if (intent === 'set_contract_address') {
            const message = `🌙 <b>Contract Address</b>\n\nPaste the contract address below.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⟵ Back', callback_data: 'buy' }]
                    ]
                }
            }
            bot.editMessageText(message, {
                ...markup,
                chat_id: chatId,
                message_id: messageId
            })
        } else if (intent === 'set_custom_sol') {
            const message = `🌙 <b>Custom Sol</b>\n\nEnter your desired custom SOL buy amount.\n\n⚠️ Once you enter the buy amount, the token will be purchased immediately.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⟵ Back', callback_data: 'buy' }]
                    ]
                }
            }
            bot.editMessageText(message, {
                ...markup,
                chat_id: chatId,
                message_id: messageId
            })
        } else if (intent === 'edit_buy_options') {
            const message = `🌙 <b>Custom Buy Amounts</b>\n\nEnter your preferred quick buy amounts below.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: `✏️ ${data.buy_option_1} SOL`, callback_data: 'edit_buy_option_1' }, { text: `✏️ ${data.buy_option_2} SOL`, callback_data: 'edit_buy_option_2' }, { text: `✏️ ${data.buy_option_3} SOL`, callback_data: 'edit_buy_option_3' },],
                        [{ text: '⟵ Back', callback_data: 'buy' }]
                    ]
                }
            }
            bot.editMessageText(message, {
                ...markup,
                chat_id: chatId,
                message_id: messageId
            })
        } else if (intent === 'wrong_ca_input') {
            const message = `⚠️ Unsupported Contract Address.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⟵ Back', callback_data: 'buy' }]
                    ]
                }
            }
            bot.sendMessage(chatId, message, {
                ...markup,
            })
        } else if (intent === 'default_send') {
            const message = `🌙 <b>Lunar Buy</b>\n\nPlease enter the contract address you want to buy, then choose one of the quick buy options. \n\n💡 You can update these options at any time to match your preferences.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: `Contract Address: ${data.contract_address === null ? '⸺': shortenCA(data.contract_address)}`, callback_data: 'set_contract_address' }],
                        [{ text: `${data.buy_option_1} SOL`, callback_data: 'buy_option_1' }, { text: `${data.buy_option_2} SOL`, callback_data: 'buy_option_2' }, { text: `${data.buy_option_3} SOL`, callback_data: 'buy_option_3' },],
                        [{ text: `x SOL`, callback_data: 'set_custom_sol' }],
                        [{ text: '⟵ Back', callback_data: 'back_to_start' }, { text: `✏️ Edit Buy Options`, callback_data: 'edit_buy_options' }]
                    ]
                }
            }
            await bot.sendMessage(chatId, message, markup);
            return;
        }else if (intent === 'wrong_number_input') {
            const message = `⚠️ Do not include symbols or special characters in the input.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⟵ Back', callback_data: 'buy' }]
                    ]
                }
            }
            bot.sendMessage(chatId, message, {
                ...markup,
            })
        }else if (intent === 'set_quickbuy_option') {
            const message = `🌙 <b>Custom Sol</b>\n\nEnter your desired custom SOL quick buy amount.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⟵ Back', callback_data: 'edit_buy_options' }]
                    ]
                }
            }
            bot.editMessageText(message, {
                ...markup,
                chat_id: chatId,
                message_id: messageId
            })
        }else if (intent === 'edit_buy_options_send') {
            const message = `🌙 <b>Custom Buy Amounts</b>\n\nEnter your preferred quick buy amounts below.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: `✏️ ${data.buy_option_1} SOL`, callback_data: 'edit_buy_option_1' }, { text: `✏️ ${data.buy_option_2} SOL`, callback_data: 'edit_buy_option_2' }, { text: `✏️ ${data.buy_option_3} SOL`, callback_data: 'edit_buy_option_3' },],
                        [{ text: '⟵ Back', callback_data: 'buy' }]
                    ]
                }
            }
            bot.sendMessage(chatId, message, markup)
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = genBuyMessages;