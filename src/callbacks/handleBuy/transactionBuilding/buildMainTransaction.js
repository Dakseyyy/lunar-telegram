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
const {
    PumpAmmSdk,
    PumpAmmInternalSdk,
    buyQuoteInputInternal,
} = require("@pump-fun/pump-swap-sdk");
const createSellInstruction = require("../../../transactions/pumpfun/preBond/createSellInstruction.cjs");
async function buildMainTransaction({ userId, mint, solAmount, type }) {
    try {
        const userWallet = await getuserWallet(userId);
        const userWalletPubkey = new PublicKey(userWallet);
        let mainInstruction;
        const walletSecret = await getUserPrivateKey(userWallet);
        const { blockhash, lastValidBlockHeight } = await rpc.getLatestBlockhash('finalized');
        const transaction = new Transaction({
            blockhash,
            lastValidBlockHeight,
            feePayer: userWalletPubkey
        });

        transaction.add(setComputeLimitInstruction());
        transaction.add(setComputeUnitPriceInstruction());
        if (type === 'buy') {
            mainInstruction = await createBuyInstruction({
                mint: 'BrsunMbcxxs34NZw57hLCHU7sNHeWRAKAmKcHqXCpump',
                userWallet: 'FSQ61ZS1UTx5Poo1PFEjj54L1A4dbBEPLhQQTWDdae1G',
                solAmount: 0.001,
            })
        } else if (type === 'sell') {
            mainInstruction = await createSellInstruction({
            mint: 'BrsunMbcxxs34NZw57hLCHU7sNHeWRAKAmKcHqXCpump',
            userWallet: 'FSQ61ZS1UTx5Poo1PFEjj54L1A4dbBEPLhQQTWDdae1G',
            solAmount: 0.001,
        })

        }

        transaction.add(...mainInstruction);
        const signature = transaction.sign(walletSecret)

        const txid = await rpc.sendRawTransaction(transaction.serialize(), {
            skipPreflight: false
        });

        console.log(`Transaction sent! TXID: ${txid}`);
        const confirmation = await rpc.confirmTransaction({
            signature: txid,
            blockhash,
            lastValidBlockHeight
        });
        console.log('Transaction confirmed!')
        if (confirmation?.value?.err?.InstructionError[1]?.Custom) {
            if (confirmation?.value?.err?.InstructionError[1]?.Custom === 1) {
                console.log('Not enough sol')
            } else if (confirmation?.value?.err?.InstructionError[1]?.Custom === 6003) {
                console.log('Slippage exceeded.')
            }
           
            return;
        }

    } catch (e) {
       
    }
}

module.exports = buildMainTransaction;