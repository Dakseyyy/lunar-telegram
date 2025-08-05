 function pendingWithdraw({userWallet, withdrawalWallet, solAmount, signature}) {
    try {
        const message = `🟠 <b>Withdraw pending</b>\n\nFrom: <code>${userWallet}</code>\n\nTo: <code>${withdrawalWallet}</code>\n\nSOL: ${solAmount} SOL\n\n<a href='https://solscan.io/tx/${signature}'>🅴 View Transaction</a>`
        const markup = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                ]
            }
        }
        return {message, markup}
    } catch (e) {
        console.error(e);
    }
}

 function successfulWithdraw({userWallet, withdrawalWallet, solAmount, signature}) {
    try {
        const message = `🟢 <b>Withdraw Successful</b>\n\nFrom: <code>${userWallet}</code>\n\nTo: <code>${withdrawalWallet}</code>\n\nSOL: ${solAmount} SOL\n\n<a href='https://solscan.io/tx/${signature}'>🅴 View Transaction</a>`
        const markup = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                ]
            }
        }
        return {message, markup}
    } catch (e) {
        console.error(e);
    }
}

 function failedWithdraw(reason) {
    try {
        const message = `🔴 <b>Withdraw Failed</b>\n\n${reason}`
        const markup = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                ]
            }
        }
        return {message, markup}
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    failedWithdraw,
    successfulWithdraw,
    pendingWithdraw

}