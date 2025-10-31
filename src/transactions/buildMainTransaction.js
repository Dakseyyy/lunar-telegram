const rpc = require("../clients/rpcClient");
const {
    Connection,
    PublicKey,
    Transaction,
    ComputeBudgetProgram,
    clusterApiUrl
} = require('@solana/web3.js');
const setComputeLimitInstruction = require("../callbacks/handleBuy/transactionBuilding/computeBudget/setComputeLimitInstruction");
const setComputeUnitPriceInstruction = require("../callbacks/handleBuy/transactionBuilding/computeBudget/setComputeUnitPriceInstruction");
const { getuserWallet, getUserPrivateKey } = require("../helper/withdraw/walletServices");
const sendRawTxn = require("../helper/withdraw/sendRawTxn");
const createBuyInstruction = require("./pumpfun/createBuyInstruction.cjs");
const {
    PumpAmmSdk,
    PumpAmmInternalSdk,
    buyQuoteInputInternal,
} = require("@pump-fun/pump-swap-sdk");
const createSellInstruction = require("./pumpfun/createSellInstruction.cjs");
const dbClient = require("../helper/dbConnect/dbClient");
const messageService = require("./messageService/messageService");
const { getSolPrice, currentSolPrice } = require("../helper/fetchSolPrice/fetchSolPrice");
const updatePositionsBuys = require("./postTransactions/positions/updatePositionsBuys");
const updatePositionsSells = require("./postTransactions/positions/updatePositionSells");
const distributeCashback = require("./pumpfun/helper/rewards/distributeCashback");
const distributeReferrals = require("./pumpfun/helper/rewards/distributeReferrals");
async function buildMainTransaction({ userId, solAmount, tokenAmountIn, type, bot, chatId, userTransactionSettings, tokenData, sellOptionPercentagePreset }) {
    let mainInstruction = null;  // defined outside try
    let txid = null;
    let messageId = null;

    try {
        const userWallet = await getuserWallet(userId);
        const userWalletPubkey = new PublicKey(userWallet);

        const walletSecret = await getUserPrivateKey(userWallet);


        const [blockhashInfo, balanceLamports] = await Promise.all([
            rpc.getLatestBlockhash('finalized'),
            rpc.getBalance(userWalletPubkey)
        ]);

        const userSOLBalance = balanceLamports / 1e9;
        console.log(userTransactionSettings)
        if (userSOLBalance < solAmount) {
            await messageService({ intent: `${type}_failed_send`, userId, reason: 'Not enough SOL balance.', bot, chatId });
            return;
        } else if (userSOLBalance < parseFloat(userTransactionSettings.buy_priority_fee) + parseFloat(userTransactionSettings.buy_bribe_fee) && type === 'buy') {
            await messageService({ intent: `${type}_failed_send`, userId, reason: 'Not enough SOL to cover fees.', bot, chatId });
            return;
        } else if ((userSOLBalance < parseFloat(userTransactionSettings.sell_priority_fee) + parseFloat(userTransactionSettings.sell_bribe_fee) && type === 'sell')) {
            await messageService({ intent: `${type}_failed_send`, userId, reason: 'Not enough SOL to cover fees.', bot, chatId });
            return;
        }
        const { blockhash, lastValidBlockHeight } = blockhashInfo;
        const transaction = new Transaction({
            blockhash,
            lastValidBlockHeight,
            feePayer: userWalletPubkey
        });

        transaction.add(setComputeLimitInstruction());
        transaction.add(setComputeUnitPriceInstruction({ userTransactionSettings, intent: type }));

        if (type === 'buy' && tokenData?.authority === 'TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM') {

            mainInstruction = (await createBuyInstruction({
                mint: tokenData.mint,
                userWallet: userWallet,
                solAmount: solAmount,
                slippage: userTransactionSettings.slippage,
                bribe: userTransactionSettings.buy_bribe_fee
            }))

        } else if (type === 'sell' && tokenData?.authority === 'TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM') {

            mainInstruction = await createSellInstruction({
                mint: tokenData.mint,
                userWallet,
                solAmount: solAmount ? solAmount : null,
                tokenAmountIn: tokenAmountIn ? tokenAmountIn : null,
                bribe: userTransactionSettings.sell_bribe_fee
            })

        } else {
            await messageService({ intent: 'buy_failed_send', chatId, userId, reason: 'Token not supported', bot })
            return;
        }


        transaction.add(mainInstruction.ixns);
        transaction.sign(walletSecret)

        const serializedTx = transaction.serialize();
        const base64Tx = Buffer.from(serializedTx).toString("base64");
        /*const txid = await rpc.sendRawTransaction(transaction.serialize(), {
            skipPreflight: true
        }); */
        messageId = (await messageService({ intent: `${type}`, userId, solAmountOut: mainInstruction?.solAmountOut ?? 0, tokenAmountIn: tokenAmountIn ?? mainInstruction.tokenAmountIn, mint: tokenData.mint, chatId, bot, ticker: tokenData.ticker, name: tokenData.name, signature: txid, solAmount, tokenAmount: mainInstruction.tokenAmountOut })).messageId;

        /* const confirmation = await rpc.confirmTransaction({
             signature: txid,
             blockhash,
             lastValidBlockHeight
         }); */
        console.log(`Transaction sent! TXID: ${txid}`);
        const response = await fetch(`http://fra-sender.helius-rpc.com/fast${type === 'sell' ? Number(userTransactionSettings.sell_bribe_fee) < 0.001 ? '?swqos_only=true' : '' : Number(userTransactionSettings.buy_bribe_fee) < 0.001 ? '?swqos_only=true' : ''}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: "helius-txn",
                method: "sendTransaction",
                params: [
                    base64Tx,
                    {
                        encoding: "base64",
                        skipPreflight: true,
                        maxRetries: 0,
                    },
                ],
            }),
        });
        console.log('Transaction confirmed!');
        const txnResponse = await response.json();


        /* if (confirmation?.value?.err?.InstructionError[1]?.Custom) {
             if (confirmation?.value?.err?.InstructionError[1]?.Custom === 1) {
                 console.log('Not enough sol or tokens')
                 await messageService({ intent: `${type}_failed`, userId, solAmountOut: mainInstruction.solAmountOut, tokenAmountIn: tokenAmountIn ?? mainInstruction.tokenAmountIn, mint: tokenData.mint, chatId, messageId, bot, ticker: tokenData.ticker, name: tokenData.name, signature: txid, solAmount, tokenAmount: mainInstruction.tokenAmountOut, reason: 'Not enough sol or tokens.' });
             } else if (confirmation?.value?.err?.InstructionError[1]?.Custom === 6003) {
                 console.log('Slippage exceeded.')
                 await messageService({ intent: `${type}_failed`, userId, mint: tokenData.mint, chatId, messageId, solAmountOut: mainInstruction.solAmountOut, tokenAmountIn: tokenAmountIn ?? mainInstruction.tokenAmountIn, bot, ticker: tokenData.ticker, name: tokenData.name, signature: txid, solAmount, tokenAmount: mainInstruction.tokenAmountOut, reason: 'Slippage exceeded.' });
             } else {
                 messageService({ intent: `${type}`, userId, mint: tokenData.mint, chatId, solAmountOut: mainInstruction.solAmountOut, tokenAmountIn: tokenAmountIn ?? mainInstruction.tokenAmountIn, bot, ticker: tokenData.ticker, name: tokenData.name, signature: txid, solAmount, tokenAmount: mainInstruction.tokenAmountOut, reason: 'Unable to complete transaction. Verify SOL balance and fee settings' })
             }
             (await dbClient.query('SELECT'))
             return;
         } */

        await messageService({ intent: `${type}_success`, userId, mint: tokenData.mint, chatId, solAmountOut: mainInstruction.solAmountOut, tokenAmountIn: tokenAmountIn ?? mainInstruction.tokenAmountIn, messageId, bot, ticker: tokenData.ticker, name: tokenData.name, signature: txnResponse.result, solAmount, tokenAmount: mainInstruction.tokenAmountOut });
        if (txnResponse.result) {
            const feePaid = mainInstruction?.feePaid;
            console.log('fee paid: ', feePaid)
            const cashbackFee = 0.4 * feePaid;
            const referralFee = cashbackFee * 0.4;
            await distributeCashback({userId, fee: cashbackFee});
            await distributeReferrals({userId, fee: referralFee});
        }
        if (type === 'buy') {
            updatePositionsBuys({ userId, mainInstruction, solAmount, tokenData })
        } else if (type === 'sell') {
            updatePositionsSells({ mainInstruction, userId, tokenAmountIn, solAmountOut: mainInstruction.solAmountOut, tokenData, tokenSupply: mainInstruction.tokenSupply })
            if (parseFloat(sellOptionPercentagePreset) === 100) {
                dbClient.query('DELETE FROM user_positions WHERE tg_user_id = $1 AND token_mint_address = $2', [userId, tokenData.mint])
            }
        }

    } catch (e) {
        if (e?.InstructionError?.[1]?.Custom === 1) {
            await messageService({ intent: `${type}_failed`, userId, solAmountOut: mainInstruction.solAmountOut, tokenAmountIn: tokenAmountIn ?? mainInstruction.tokenAmountIn, mint: tokenData.mint, chatId, messageId, bot, ticker: tokenData.ticker, name: tokenData.name, signature: txid, solAmount, tokenAmount: mainInstruction.tokenAmountOut, reason: 'Not enough sol or tokens.' });
        }
        console.error(e)
    }
}

module.exports = buildMainTransaction;