const shortenCA = require("../../callbacks/handleBuy/checks/shortenCA");
const formatNumber = n => n.toString().split('.').map((part, i) =>
    i === 0 ? part.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : part
).join('.');
async function messageService({ bot, intent, chatId, messageId, ticker, name, signature, mint, solAmount, tokenAmount, reason, tokenAmountIn, solAmountOut }) {
    try {
        if (intent === 'buy') {
            const message = `🟠 <b>Buy Pending</b>\n\n<b>${name}</b> • <code>${shortenCA(mint)}</code>\n<code>${solAmount} SOL </code> → <code>${formatNumber(tokenAmount / 1e6)} ${ticker}</code>\n\n<a href='https://solscan.io/tx/${signature}'>View Transaction</a>`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            }
            const messageId = (await bot.sendMessage(chatId, message, markup)).message_id;
            return {
                messageId
            };
        }
        if (intent === 'buy_success') {
            const message = `🟢 <b>Buy Successful</b>\n\n<b>${name}</b> • <code>${shortenCA(mint)}</code>\n<code>${solAmount} SOL </code> → <code>${formatNumber(tokenAmount / 1e6)} ${ticker}</code>\n\n<a href='https://solscan.io/tx/${signature}'>View Transaction</a>`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            }
            await bot.editMessageText(message, {
                chat_id: chatId,
                message_id: messageId,
                ...markup
            });
            return {
                messageId
            };
        } else if (intent === 'buy_failed') {
            const message = `🔴 <b>Buy Failed</b>\n\n<b>${name}</b> • <code>${shortenCA(mint)}</code>\n<code>${solAmount} SOL </code> → <code>${formatNumber(tokenAmount / 1e6)} ${ticker}</code>\n\n<b>Reason: ${reason}</b> \n\n<a href='https://solscan.io/tx/${signature}'>View Transaction</a>`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            }
            await bot.editMessageText(message, {
                chat_id: chatId,
                message_id: messageId,
                ...markup
            });
            return {
                messageId
            };
        }
        if (intent === 'buy_failed_send') {
            const message = `🔴 <b>Buy Failed</b>\n\n<b>Reason:</b> ${reason}`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            }
            const messageId = (await bot.sendMessage(chatId, message, markup)).message_id;
            return {
                messageId
            };
        }
        if (intent === 'sell_success') {
            const message = `🟢 <b>Sell Successful</b>\n\n<b>${name}</b> • <code>${shortenCA(mint)}</code>\n<code>${formatNumber(tokenAmountIn)} ${ticker} </code> → <code>${solAmountOut / 1e9} SOL</code>\n\n<a href='https://solscan.io/tx/${signature}'>View Transaction</a>`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            }
            await bot.editMessageText(message, {
                chat_id: chatId,
                message_id: messageId,
                ...markup
            });
            return {
                messageId
            };
        } else if (intent === 'sell_failed') {
            const message = `🔴 <b>Sell Failed</b>\n\n<b>${name}</b> • <code>${shortenCA(mint)}</code>\n<code>${formatNumber(tokenAmountIn)} ${ticker} </code> → <code>${solAmountOut / 1e9} SOL</code>\n\n<b>Reason: ${reason}</b> \n\n<a href='https://solscan.io/tx/${signature}'>View Transaction</a>`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            }
            await bot.editMessageText(message, {
                chat_id: chatId,
                message_id: messageId,
                ...markup
            });
            return {
                messageId
            };
        }
        if (intent === 'sell') {
            const message = `🟠 <b>Sell Pending</b>\n\n<b>${name}</b> • <code>${shortenCA(mint)}</code>\n<code>${formatNumber(tokenAmountIn)} ${ticker} </code> → <code>${solAmountOut / 1e9} SOL</code>\n\n<a href='https://solscan.io/tx/${signature}'>View Transaction</a>`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            }
            const messageId = (await bot.sendMessage(chatId, message, markup)).message_id;
            return {
                messageId
            };
        }
        if (intent === 'sell_failed_send') {
            const message = `🔴 <b>Sell Failed</b>\n\n<b>Reason:</b> ${reason}`
            const markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            }
            const messageId = (await bot.sendMessage(chatId, message, markup)).message_id;
            return {
                messageId
            };
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = messageService;