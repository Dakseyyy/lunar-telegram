const pumpFun = require('@pump-fun/pump-sdk');
const { bondingCurvePda, getSellSolAmountFromTokenAmount } = require('@pump-fun/pump-sdk')
const { PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const rpc = require('../../clients/rpcClient');
const { getAssociatedTokenAddressSync, createAssociatedTokenAccountIdempotentInstruction } = require('@solana/spl-token');

const anchor = require('@coral-xyz/anchor');
const bs58 = require('bs58')
const {
    PumpAmmSdk,
    PumpAmmInternalSdk,
    buyQuoteInputInternal,
    poolPda,
    pumpPoolAuthorityPda,
    sellBaseInputInternal,
} = require("@pump-fun/pump-swap-sdk");
const { tokenAmount } = require('@metaplex-foundation/umi');
const filterCloseAccount = require('./findAccountInstruction');
const getOnChainData = require('./helper/getOnChainData');
const sdk = new pumpFun.PumpSdk(rpc);
const [pumpAmmSdk, pumpAmmInternalSdk] = [
    new PumpAmmSdk(rpc),
    new PumpAmmInternalSdk(rpc),
];





async function createSellInstruction({ mint, solAmount, tokenAmountIn, userWallet, slippage, bribe }) {
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



        const tokenAmount = tokenAmountIn ? tokenAmountIn : solAmount / (((bondingCurve.virtualSolReserves.toString()) / (bondingCurve.virtualTokenReserves.toString())) / 1000)
        if (bondingCurve.complete) {




            const { globalConfig, pool, poolBaseAmount, poolQuoteAmount } =
                swapSolanaState;

            const price = (poolQuoteAmount / 1e9) / (poolBaseAmount / 1e6)

            const tokensSelling = tokenAmountIn ? tokenAmountIn : solAmount / price;

            const ata = getAssociatedTokenAddressSync(mint, new PublicKey(userWallet), true);
            const ataIx = createAssociatedTokenAccountIdempotentInstruction(
                new PublicKey(userWallet),
                ata,
                new PublicKey(userWallet),
                mint
            );


            const { uiQuote } = sellBaseInputInternal(
                {
                    base: new anchor.BN(tokensSelling * 1e6),
                    slippage,
                    baseReserve: poolBaseAmount,
                    quoteReserve: poolQuoteAmount,
                    globalConfig,
                    baseMintAccount: swapSolanaState.baseMintAccount,
                    baseMint: swapSolanaState.baseMint,
                    coinCreator: swapSolanaState.pool.coinCreator,
                    creator: swapSolanaState.pool.creator,
                    feeConfig: swapSolanaState.feeConfig
                }
            );

            let sellIxs = await pumpAmmInternalSdk.sellQuoteInput(
                swapSolanaState,
                uiQuote,
                slippage
            );
            let end = Date.now();
            const tx = new Transaction();
            tx.add(...sellIxs)
            tx.add(SystemProgram.transfer({
                fromPubkey: new PublicKey(userWallet),
                toPubkey: new PublicKey('89XZApftcSvAs5dXkN8WxTwonMcs4cLZGLMevaTiCTvy'),
                lamports: Math.round(Number(uiQuote) * 0.01),
            }))
            tx.add(SystemProgram.transfer({
                fromPubkey: new PublicKey(userWallet),
                toPubkey: new PublicKey('4ACfpUFoaSD9bfPdeu6DBt89gB6ENTeHBXCAi87NhDEE'),
                lamports: Math.round(Number(bribe) * 1e9),
            }))
            tx.instructions = tx.instructions.filter(
                (ix) => {
                    // Check the program id and data pattern for closeAccount
                    const isTokenProgram = ix.programId.toBase58() === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
                    const isCloseAccount = ix.data[0] === 9; // '9' = closeAccount discriminator
                    return !(isTokenProgram && isCloseAccount);
                }
            );
                    console.log('selling here lol xd')
            return { ixns: tx, solAmountOut: uiQuote, tokenAmountIn: tokensSelling, tokenSupply, feePaid: (Number(uiQuote) * 0.01) / 1e9 };
        }


        const amount = getSellSolAmountFromTokenAmount({ global: global, mintSupply: bondingCurve.mintSupply, feeConfig: bondingCurve.feeConfig, bondingCurve, amount: new anchor.BN(tokenAmount * 1e6) })

        let ixns = await sdk.sellInstructions({
            global,
            bondingCurve,
            bondingCurveAccountInfo,
            associatedUserAccountInfo,
            mint: new PublicKey(mint),
            user: new PublicKey(userWallet),
            solAmount: new anchor.BN(amount / 1e9),
            amount: new anchor.BN(tokenAmount * 1e6),
            slippage
        });

        const tx = new Transaction().add(...ixns);
        tx.add(SystemProgram.transfer({
            fromPubkey: new PublicKey(userWallet),
            toPubkey: new PublicKey('89XZApftcSvAs5dXkN8WxTwonMcs4cLZGLMevaTiCTvy'),
            lamports: Math.round(Number(amount) * 0.01),
        }))
        tx.add(SystemProgram.transfer({
            fromPubkey: new PublicKey(userWallet),
            toPubkey: new PublicKey('4ACfpUFoaSD9bfPdeu6DBt89gB6ENTeHBXCAi87NhDEE'),
            lamports: Math.round(Number(bribe) * 1e9),
        }))
        tx.instructions = tx.instructions.filter(
            (ix) => {
                // Check the program id and data pattern for closeAccount
                const isTokenProgram = ix.programId.toBase58() === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
                const isCloseAccount = ix.data[0] === 9; // '9' = closeAccount discriminator
                return !(isTokenProgram && isCloseAccount);
            }
        );
        let end = Date.now();
        console.log(ixns)

        return { ixns: tx, solAmountOut: amount, tokenAmountIn: tokenAmount, tokenSupply, feePaid: ((Number(amount) / 1e9) * 0.01) };
    } catch (e) {
        console.error('Error:', e);
    }
}


module.exports = createSellInstruction;