const dbClient = require('../../../helper/dbConnect/dbClient')
const getWallet = async (userId) => {
    try {
        let start = Date.now();
        let userWallet = await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])
        let end = Date.now();

        console.log(`Time taken to fetch user wallet: ${(end - start).toFixed(2)}`)

        if (!userWallet.rows[0]) {
            return {
                hasWallet: false
            }
    } else if (userWallet.rows[0].wallet) {
        return {
            hasWallet: true,
            walletAddress: userWallet.rows[0].wallet
        }
    }
    } catch (e) {

    }
}

module.exports = getWallet;