const rpc = require("../../../clients/rpcClient");
const {
    Connection,
    PublicKey,
    Transaction,
    ComputeBudgetProgram,
    clusterApiUrl
} = require('@solana/web3.js');
const setComputeLimitInstruction = require("./computeBudget/setComputeLimitInstruction");
const setComputeUnitPriceInstruction = require("./computeBudget/setComputeUnitPriceInstruction");
const { getuserWallet, getUserPrivateKey } = require("../../../helper/withdraw/walletServices");
const sendRawTxn = require("../../../helper/withdraw/sendRawTxn");
const createBuyInstruction = require("../../../transactions/pumpfun/preBond/createBuyInstruction.cjs");

async function buildMainTransaction({ userId, mint, solAmount }) {
    try {
        const userWallet = await getuserWallet(userId);
        const userWalletPubkey = new PublicKey(userWallet)
        const walletSecret = await getUserPrivateKey(userWallet);
        const { blockhash, lastValidBlockHeight } = await rpc.getLatestBlockhash('finalized');
        const transaction = new Transaction({
            blockhash,
            lastValidBlockHeight,
            feePayer: userWalletPubkey
        });

        transaction.add(setComputeLimitInstruction());
        transaction.add(setComputeUnitPriceInstruction());
        const preBondBuyPumpFun = await createBuyInstruction({
        mint: 'BrsunMbcxxs34NZw57hLCHU7sNHeWRAKAmKcHqXCpump',
        userWallet: 'FSQ61ZS1UTx5Poo1PFEjj54L1A4dbBEPLhQQTWDdae1G',
        solAmount: 0.01,
    })
        transaction.add(...preBondBuyPumpFun);
        const signature = transaction.sign(walletSecret)
        const txid = await sendRawTxn(transaction);

        console.log(`Transaction sent! TXID: ${txid}`);
        const confirmation = await rpc.confirmTransaction({
            signature: txid,
            blockhash,
            lastValidBlockHeight
        });
        
        console.log('Transaction done')
    } catch (e) {
        console.error(e);
    }
}

module.exports = buildMainTransaction;