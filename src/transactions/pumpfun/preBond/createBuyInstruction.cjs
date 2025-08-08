const pumpFun = require('@pump-fun/pump-sdk');
const { bondingCurvePda } = require('@pump-fun/pump-sdk')
const { PublicKey, Transaction } = require('@solana/web3.js');
const rpc = require('../../../clients/rpcClient');
const { getAssociatedTokenAddressSync } = require('@solana/spl-token');
const anchor = require('@coral-xyz/anchor');
async function createBuyInstruction({ mint, solAmount, userWallet }) {
    try {
        const sdk = new pumpFun.PumpSdk(rpc);
        const global = await sdk.fetchGlobal();
        const bondingCurve = await sdk.fetchBondingCurve(new PublicKey(mint));
        const bondingCurveAccountInfo = await rpc.getAccountInfo(bondingCurvePda(new PublicKey(mint)));
       
        const associatedUser = getAssociatedTokenAddressSync(new PublicKey(mint), new PublicKey(userWallet), true);
        const associatedUserAccountInfo = await rpc.getAccountInfo(associatedUser);
        console.log({
            tokenReserves: bondingCurve.realTokenReserves.toString(),
            solReserves: bondingCurve.realSolReserves.toString(),
            totalTokens: bondingCurve.tokenTotalSupply.toString(),
        })
        const ixns = await sdk.buyInstructions({
            global,
            bondingCurve,
            bondingCurveAccountInfo,
            associatedUserAccountInfo,
            mint: new PublicKey(mint),
            user: new PublicKey(userWallet),
            solAmount: new anchor.BN(Math.round(solAmount * 1e9)),
            amount:new anchor.BN(50000000),
            slippage: 0.01
        });
      
        const tx = new Transaction().add(...ixns);

        return ixns;
    } catch (e) {
        console.error('Error:', e);
    }
}

createBuyInstruction({
    mint: 'BrsunMbcxxs34NZw57hLCHU7sNHeWRAKAmKcHqXCpump',
    userWallet: 'FSQ61ZS1UTx5Poo1PFEjj54L1A4dbBEPLhQQTWDdae1G',
    solAmount: 0.01,
});
module.exports = createBuyInstruction;