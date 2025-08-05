const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');

const rpc = require('../../clients/rpcClient')
const fetchSolBal = async(walletAddress) => {

    const publicKey = new PublicKey(walletAddress)
    if (!walletAddress) {
        return 0;
    }
    try {
        const balanceLamports = await rpc.getBalance(publicKey);
        let balanceSOL = balanceLamports / 1e9;

        return balanceSOL
            

    } catch (error) {
        console.error(error)
        return null
        }
}

module.exports = fetchSolBal;