const fetchSolBal = require("../fetchSolBal/fetchSolBal");
const walletServices = require('./walletServices')
async function handleIntent({userId, userWallet, intent}) {
    try {

        if (intent === 'percent') {

            let solAmount = await fetchSolBal(userWallet);
            let lamports = (solAmount * 1e9) - 5000;
            return lamports;

        } else if (intent === 'solana') {

            let solAmount = await walletServices.getUserSOLWithdrawAmount(userId);
            let lamports = (solAmount * 1e9) - 5000;
            return lamports;

        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = handleIntent;