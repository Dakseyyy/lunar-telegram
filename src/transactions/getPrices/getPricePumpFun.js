const {
    PumpAmmSdk,
    PumpAmmInternalSdk,
    buyQuoteInputInternal,
    poolPda,
    pumpPoolAuthorityPda
} = require("@pump-fun/pump-swap-sdk");
const pumpFun = require('@pump-fun/pump-sdk');
const { bondingCurvePda, getBuyTokenAmountFromSolAmount } = require('@pump-fun/pump-sdk')
const { token } = require('@coral-xyz/anchor/dist/cjs/utils');

const { PublicKey } = require("@solana/web3.js");

const { currentSolPrice } = require("../../helper/fetchSolPrice/fetchSolPrice");
const rpc = require("../../clients/rpcClient");

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
async function getPricePumpFun({ mint, authority }) {
    try {
        mint = new PublicKey(mint)
        const solPrice = currentSolPrice.get('currentSOLPrice');
        if (authority === 'TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM') {
            const lpPool = (getPoolFromMint(mint)).pumpPoolPda
            const [bondingCurve, tokenSupply] = await Promise.all([
                sdk.fetchBondingCurve(new PublicKey(mint), { commitment: 'processed' }),
                (await (rpc.getTokenSupply(mint))).value.amount
            ])
            if (!bondingCurve.complete) {
                const SOLReserves = bondingCurve.virtualSolReserves.toString();
                const SPLReserves = bondingCurve.virtualTokenReserves.toString();
                const marketCap = ((SOLReserves / SPLReserves) * solPrice * tokenSupply) / 1e9
                const tokenPrice = ((SOLReserves / SPLReserves) * solPrice) / 1e3;
                console.log({
                    SPLReserves, SOLReserves
                })
                return {marketCap, tokenPrice}
            }
            const pool = await pumpAmmSdk.fetchPool(lpPool);

            const poolSOLReserves = await rpc.getBalance(pool.quoteMint.toString() === 'So11111111111111111111111111111111111111112' ? pool.poolQuoteTokenAccount : pool.poolBaseTokenAccount);
            const poolSPLReserves = (await rpc.getTokenAccountBalance(pool.quoteMint.toString() === 'So11111111111111111111111111111111111111112' ? pool.poolBaseTokenAccount : pool.poolQuoteTokenAccount)).value.amount;

            const marketCap = ((poolSOLReserves / poolSPLReserves) * solPrice * tokenSupply) / 1e9;
            const tokenPrice = ((poolSOLReserves / poolSPLReserves) * solPrice) / 1e3
            console.log(marketCap / 1e9)
            return {marketCap, tokenPrice};



        }

    } catch (e) {
        console.error(e);
    }
}

module.exports = getPricePumpFun;