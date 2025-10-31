const pumpFun = require('@pump-fun/pump-sdk');
const { bondingCurvePda, getBuyTokenAmountFromSolAmount } = require('@pump-fun/pump-sdk')
const { PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const rpc = require('../../clients/rpcClient');
const { getAssociatedTokenAddressSync, createAssociatedTokenAccountIdempotentInstruction } = require('@solana/spl-token');

const anchor = require('@coral-xyz/anchor');

const {
    PumpAmmSdk,
    PumpAmmInternalSdk,
    buyQuoteInputInternal,

} = require("@pump-fun/pump-swap-sdk");

const getOnChainData = require('./helper/getOnChainData');
const sdk = new pumpFun.PumpSdk(rpc);
const [pumpAmmSdk, pumpAmmInternalSdk] = [
    new PumpAmmSdk(rpc),
    new PumpAmmInternalSdk(rpc),
];





async function createBuyInstruction({ mint, solAmount, userWallet, slippage, bribe }) {
    try {

        mint = new PublicKey(mint)
        const {
            global,
            bondingCurve,
            bondingCurveAccountInfo,
            associatedUserAccountInfo,
            swapSolanaState,
            tokenSupply,
        } = await getOnChainData(mint, userWallet, sdk, pumpAmmSdk, rpc);


        if (bondingCurve.complete) {

            const { globalConfig, pool, poolBaseAmount, poolQuoteAmount } =
                swapSolanaState;

            const ata = getAssociatedTokenAddressSync(mint, new PublicKey(userWallet), true);

            const baseReserve = poolBaseAmount;
            const quoteReserve = poolQuoteAmount;
            console.log(swapSolanaState)
            const { base } = buyQuoteInputInternal(

                {
                    quote: new anchor.BN((solAmount * 1e9) / 1.01),
                    slippage,
                    baseReserve,
                    quoteReserve,
                    globalConfig,
                    mint,
                    baseMintAccount: swapSolanaState.baseMintAccount,
                    baseMint: swapSolanaState.baseMint,
                    coinCreator: swapSolanaState.pool.coinCreator,
                    creator: swapSolanaState.pool.creator,
                    feeConfig: swapSolanaState.feeConfig

                }
            );

            const buyIxs = await pumpAmmInternalSdk.buyBaseInput(
                swapSolanaState,
                base,
                slippage
            );
            const tx = new Transaction();
            tx.add(...buyIxs);
            tx.add(SystemProgram.transfer({
                fromPubkey: new PublicKey(userWallet),
                toPubkey: new PublicKey('89XZApftcSvAs5dXkN8WxTwonMcs4cLZGLMevaTiCTvy'),
                lamports: Math.round(solAmount * 0.01 * 1e9),
            }))
            tx.add(SystemProgram.transfer({
                fromPubkey: new PublicKey(userWallet),
                toPubkey: new PublicKey('4ACfpUFoaSD9bfPdeu6DBt89gB6ENTeHBXCAi87NhDEE'),
                lamports: Math.round(Number(bribe) * 1e9),
            }))
            let end = Date.now();


            return { ixns: tx, tokenAmountOut: base.toString(), tokenSupply, feePaid: solAmount * 0.01 };
        }

        const amount = getBuyTokenAmountFromSolAmount({ global: global, bondingCurve: bondingCurve, feeConfig: global.feeConfig, amount: new anchor.BN((solAmount * 1e9) / 1.01), mintSupply: bondingCurve.mintSupply })

        const ixns = await sdk.buyInstructions({
            global,
            bondingCurve,
            bondingCurveAccountInfo,
            associatedUserAccountInfo,
            mint: new PublicKey(mint),
            user: new PublicKey(userWallet),
            solAmount: new anchor.BN(solAmount * 1e9),
            amount: new anchor.BN(amount),
            slippage
        });

        const tx = new Transaction();

        tx.add(...ixns)
        tx.add(SystemProgram.transfer({
            fromPubkey: new PublicKey(userWallet),
            toPubkey: new PublicKey('89XZApftcSvAs5dXkN8WxTwonMcs4cLZGLMevaTiCTvy'),
            lamports: Math.round(solAmount * 0.01 * 1e9),
        }))
        tx.add(SystemProgram.transfer({
            fromPubkey: new PublicKey(userWallet),
            toPubkey: new PublicKey('4ACfpUFoaSD9bfPdeu6DBt89gB6ENTeHBXCAi87NhDEE'),
            lamports: Math.round(Number(bribe) * 1e9),
        }))
        let end = Date.now();

        return { ixns: tx, tokenAmountOut: amount.toString(), tokenSupply, feePaid: solAmount * 0.01 };
    } catch (e) {
        console.error(e)
    }
}


module.exports = createBuyInstruction;