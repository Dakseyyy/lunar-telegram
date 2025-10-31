const dbClient = require("../../helper/dbConnect/dbClient")
const shortenCA = require("./checks/shortenCA")

async function genSellMessages({ intent, bot, data, messageId, chatId, userId, error_reason }) {
    try {


        if (intent === 'default') {
            let message = `🌙 <b>Lunar Sell</b>\n\Select the token you want to sell, then choose one of the quick sell options. \n\n💡 You can update these options at any time to match your preferences.`
            const userPositions = (await dbClient.query('SELECT * FROM user_positions WHERE tg_user_id = $1', [userId])).rows;
            if (!userPositions[0]) {
                message = `🌙 <b>Lunar Sell</b>\n\nYou have no active positions to sell.\n\n💡 You can update these options at any time to match your preferences.`
            }
            let userSelectedCA = (await dbClient.query('SELECT contract_address FROM sell_settings WHERE tg_user_id = $1', [userId])).rows[0].contract_address
            let userPositionButtons = [];
            for (let i = 0; i < userPositions.length; i += 3) {
                userPositionButtons.push(userPositions.slice(i, i + 3).map(position => ({
                    text: `${position.token_name} ${userSelectedCA === position.token_mint_address ? '✅' : ''}`,
                    callback_data: `position_id_${position.token_mint_address}`
                })))
            }
            console.log(data)
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        ...userPositionButtons,
                        [{ text: `${data.sell_option_1} %`, callback_data: 'sell_option_1' }, { text: `${data.sell_option_2} %`, callback_data: 'sell_option_2' }, { text: `${data.sell_option_3} %`, callback_data: 'sell_option_3' },{ text: `${data.sell_option_4} %`, callback_data: 'sell_option_4' }],
                        [{ text: `x SOL`, callback_data: 'set_custom_percent' }],
                        [{ text: '⟵ Back', callback_data: 'back_to_start' }, { text: `✏️ Edit Sell Options`, callback_data: 'edit_sell_options' }]
                    ]
                }
            }
            const messageToDelete = bot.editMessageText(message, {
                ...markup,
                chat_id: chatId,
                message_id: messageId
            })
        } else if (intent === 'set_contract_address_sell') {
            const message = `🌙 <b>Contract Address</b>\n\nPaste the contract address below.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⟵ Back', callback_data: 'sell' }]
                    ]
                }
            }
            bot.editMessageText(message, {
                ...markup,
                chat_id: chatId,
                message_id: messageId
            })
        } else if (intent === 'set_custom_percent') {
            const message = `🌙 <b>Custom Sol</b>\n\nEnter your desired custom SOL sell amount.\n\n⚠️ Once you enter the sell amount, the token will be sold immediately.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⟵ Back', callback_data: 'sell' }]
                    ]
                }
            }
            bot.editMessageText(message, {
                ...markup,
                chat_id: chatId,
                message_id: messageId
            })
        } else if (intent === 'edit_sell_options') {
            const message = `🌙 <b>Custom Sell</b>\n\nEnter your preferred quick sell percentages below.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: `✏️ ${data.sell_option_1}%`, callback_data: 'edit_sell_option_1' }, { text: `✏️ ${data.sell_option_2}%`, callback_data: 'edit_sell_option_2' }, { text: `✏️ ${data.sell_option_3}%`, callback_data: 'edit_sell_option_3' },{ text: `✏️ ${data.sell_option_4}%`, callback_data: 'edit_sell_option_4' }],
                        [{ text: '⟵ Back', callback_data: 'sell' }]
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
                        [{ text: '⟵ Back', callback_data: 'sell' }]
                    ]
                }
            }
            bot.sendMessage(chatId, message, {
                ...markup,
            })
        } else if (intent === 'default_send') {
            const message = `🌙 <b>Lunar Sell</b>\n\nPlease enter the contract address you want to sell, then choose one of the quick sell options. \n\n💡 You can update these options at any time to match your preferences.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: `Contract Address: ${data.contract_address === null ? '⸺' : shortenCA(data.contract_address)}`, callback_data: 'set_contract_address_sell' }],
                        [{ text: `${data.sell_option_1}%`, callback_data: 'sell_option_1' }, { text: `${data.sell_option_2}%`, callback_data: 'sell_option_2' }, { text: `${data.sell_option_3}%`, callback_data: 'sell_option_3' },{ text: `${data.sell_option_4}%`, callback_data: 'sell_option_4' },],
                        [{ text: `x SOL`, callback_data: 'set_custom_percent' }],
                        [{ text: '⟵ Back', callback_data: 'back_to_start' }, { text: `✏️ Edit Sell Options`, callback_data: 'edit_sell_options' }]
                    ]
                }
            }
            await bot.sendMessage(chatId, message, markup);
            return;
        } else if (intent === 'wrong_number_input') {
            const message = `⚠️ Do not include symbols or special characters in the input.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⟵ Back', callback_data: 'sell' }]
                    ]
                }
            }
            bot.sendMessage(chatId, message, {
                ...markup,
            })
        } else if (intent === 'set_quicksell_option') {
            const message = `🌙 <b>Custom Sol</b>\n\nEnter your desired custom SOL quick sell.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⟵ Back', callback_data: 'edit_sell_options' }]
                    ]
                }
            }
            bot.editMessageText(message, {
                ...markup,
                chat_id: chatId,
                message_id: messageId
            })
        } else if (intent === 'edit_sell_options_send') {
            const message = `🌙 <b>Custom Sell Amounts</b>\n\nEnter your preferred quick sell amounts below.`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: `✏️ ${data.sell_option_1}%`, callback_data: 'edit_sell_option_1' }, { text: `✏️ ${data.sell_option_2}%`, callback_data: 'edit_sell_option_2' }, { text: `✏️ ${data.sell_option_3}%`, callback_data: 'edit_sell_option_3' }, { text: `✏️ ${data.sell_option_4}%`, callback_data: 'edit_sell_option_4' }],
                        [{ text: '⟵ Back', callback_data: 'sell' }]
                    ]
                }
            }
            bot.sendMessage(chatId, message, markup)
        } else if (intent === 'custom_error') {
            const message = error_reason
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⟵ Back', callback_data: 'sell' }]
                    ]
                }
            }
            bot.sendMessage(chatId, message, {
                ...markup,
            })
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = genSellMessages;