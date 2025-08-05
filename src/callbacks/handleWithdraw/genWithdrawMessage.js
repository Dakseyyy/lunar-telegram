const fetchSolBal = require("../../helper/fetchSolBal/fetchSolBal");
const { currentSolPrice } = require("../../helper/fetchSolPrice/fetchSolPrice");
const shortenAddress = require("../../helper/shortenWalletAddress/shortenWalletAddress")

const genWithdrawMessage = async (context, data, userWallet) => {

    try {
         if (context === 'default') {

                let solPrice = currentSolPrice.get('currentSOLPrice')
                const userBalanceSOL = await fetchSolBal(userWallet);
                console.log(userWallet)
                const userBalanceUSD = (userBalanceSOL * solPrice).toFixed(5)
        const default_withdraw_message = `🌙 <b>Withdraw</b>\n\n💰 Balance: ${userBalanceSOL} SOL ($${userBalanceUSD})  \n\n💡 Always double‑check the withdrawal address before confirming a withdrawal.`
        const default_withdraw_markup = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{text: `100% ${data.withdraw_choice === null ? '' : data.withdraw_choice === 'percent' ? '✅' : ''}`, callback_data: 'withdraw_100%'}, {text: `${data.sol_amount === null ? 'x' : data.sol_amount} SOL ${data.withdraw_choice === null ? '' : data.withdraw_choice === 'solana' ? '✅' : ''}`, callback_data: 'withdraw_custom_sol'}],
                    [{text: `💸 Withdrawal Address: ${data.withdrawal_address === null ? '───' : shortenAddress(data.withdrawal_address)}`, callback_data: 'withdraw_address'}],
                    [{text: '✅ Withdraw', callback_data: 'try_withdraw'}],
                    [{text: '⟵ Back', callback_data: 'back_to_start'}, {text: 'View Scheduled', callback_data: 'view_scheduled_withdraws'}]
                ]
            }
        }
        return {default_withdraw_message, default_withdraw_markup}
        };
        if (context === 'choose_solana') {
            const userBalanceSOL = await fetchSolBal(userWallet);
            const solana_withdraw_message = `🌙 <b>Solana</b>\n\nEnter your desired solana amount to withdraw  \n\n💰 Balance: <code>${userBalanceSOL}</code> SOL\n\n💡 Avoid any symbols or letters.`
            const solana_withdraw_markup = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{text: '⟵ Back', callback_data: 'withdraw'}]
                ]
            }
        }
        return {solana_withdraw_message, solana_withdraw_markup}
        }
        if (context === 'choose_wallet') {
            const wallet_withdraw_message = `🌙 <b>Solana</b>\n\nEnter the wallet address you want to send SOL to.  \n\n💡 Double‑check the address carefully before sending.`
            const wallet_withdraw_markup = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{text: '⟵ Back', callback_data: 'withdraw'}]
                ]
            }
        }
        return {wallet_withdraw_message, wallet_withdraw_markup}
        }
        
    } catch (e) {
        console.error(e)
    }
}



module.exports = genWithdrawMessage;