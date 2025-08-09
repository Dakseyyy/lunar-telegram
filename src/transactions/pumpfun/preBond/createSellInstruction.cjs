const pumpFun = require('@pump-fun/pump-sdk');
const { bondingCurvePda, getSellSolAmountFromTokenAmount } = require('@pump-fun/pump-sdk')
const { PublicKey, Transaction } = require('@solana/web3.js');
const rpc = require('../../../clients/rpcClient');
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
} = require("@pump-fun/pump-swap-sdk")
const sdk = new pumpFun.PumpSdk(rpc);
const [pumpAmmSdk, pumpAmmInternalSdk] = [
    new PumpAmmSdk(rpc),
    new PumpAmmInternalSdk(rpc),
];

function getPoolFromMint(mint) {
    const CANONICAL_POOL_INDEX = 0;
    const [pumpPoolAuthority] = pumpPoolAuthorityPda(mint);
    const [pumpPoolPda] = poolPda(CANONICAL_POOL_INDEX, pumpPoolAuthority, mint, new PublicKey('So11111111111111111111111111111111111111112'));

    return { pumpPoolPda, pumpPoolAuthority };
}



async function createSellInstruction({ mint, solAmount, userWallet }) {
    try {
        let start = Date.now();
        mint = new PublicKey(mint)
        const associatedUser = getAssociatedTokenAddressSync(new PublicKey(mint), new PublicKey(userWallet), true);
        const lpPool = (getPoolFromMint(mint)).pumpPoolPda
        const [global, bondingCurve, accountInfos, swapSolanaState] = await Promise.all([
            sdk.fetchGlobal({ commitment: 'processed' }),
            sdk.fetchBondingCurve(new PublicKey(mint), { commitment: 'processed' }),
            rpc.getMultipleAccountsInfo([bondingCurvePda(new PublicKey(mint)), associatedUser]),
            pumpAmmSdk.swapSolanaState(
                lpPool,
                new PublicKey(userWallet)
            ).catch(() => null)

        ])
        const [bondingCurveAccountInfo, associatedUserAccountInfo] = accountInfos

        
        const tokenAmount = solAmount / (((bondingCurve.virtualSolReserves.toString()) / (bondingCurve.virtualTokenReserves.toString())) / 1000)
        console.log(tokenAmount)
        if (bondingCurve.complete) {

            console.log('bondingCurveCompleted')
            const slippage = 15
            const lpPool = (getPoolFromMint(mint)).pumpPoolPda
            console.log(lpPool.pumpPoolPda)
            
            const { globalConfig, pool, poolBaseAmount, poolQuoteAmount } =
                swapSolanaState;

            const price = (poolQuoteAmount / 1e9) / (poolBaseAmount / 1e6)
            console.log(price)
            const tokensSelling = solAmount / price;
            console.log(tokensSelling)
            const ata = getAssociatedTokenAddressSync(mint, new PublicKey(userWallet), true);
            const ataIx = createAssociatedTokenAccountIdempotentInstruction(
                new PublicKey(userWallet),
                ata,
                new PublicKey(userWallet),
                mint
            );

            const { uiQuote } = sellBaseInputInternal(
                new anchor.BN(tokensSelling * 1e9),
                slippage,
                poolBaseAmount,
                poolQuoteAmount,
                globalConfig,
                pool.creator
            );

            const buyIxs = await pumpAmmInternalSdk.sellQuoteInput(
                swapSolanaState,
                uiQuote,
                slippage
            );
            let end = Date.now();
            console.log(`Time to fetch all relevant data: ${(end - start).toFixed(2)}`)
            return buyIxs;
        }

       
        const amount = getSellSolAmountFromTokenAmount(global, bondingCurve, new anchor.BN(tokenAmount * 1e6))
        console.log(amount)
        const ixns = await sdk.sellInstructions({
            global,
            bondingCurve,
            bondingCurveAccountInfo,
            associatedUserAccountInfo,
            mint: new PublicKey(mint),
            user: new PublicKey(userWallet),
            solAmount: new anchor.BN(amount / 1e9),
            amount: new anchor.BN(tokenAmount * 1e6),
            slippage: 25
        });

        const tx = new Transaction().add(...ixns);
        let end = Date.now();
        console.log(`Time to fetch all relevant data: ${(end - start).toFixed(2)}`)
       console.log(amount.toString() / 1e9)
        return ixns;
    } catch (e) {
        console.error('Error:', e);
    }
}

createSellInstruction({
    mint: '28nZw85zRErS1i48fmnHJXk9hqLd1NDungWTXuYepump',
    userWallet: 'FSQ61ZS1UTx5Poo1PFEjj54L1A4dbBEPLhQQTWDdae1G',
    solAmount: 0.01,
});
module.exports = createSellInstruction;