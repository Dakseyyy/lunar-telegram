const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
require('dotenv').config({path: '../../../.env'});
    const rpcURL = process.env.ALCHEMY_RPC_URL;
    const connection = new Connection(rpcURL, 'confirmed');
const fetchSolBal = async(walletAddress) => {

    const publicKey = new PublicKey(walletAddress)
    if (!walletAddress) {
        return 0;
    }
    try {
        const balanceLamports = await connection.getBalance(publicKey);
        let balanceSOL = balanceLamports / 1e9;

        return balanceSOL
            

    } catch (error) {
        console.error(error)
        return null
        }
}

module.exports = fetchSolBal;