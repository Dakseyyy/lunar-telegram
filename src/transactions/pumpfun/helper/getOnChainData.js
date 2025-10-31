const { bondingCurvePda } = require('@pump-fun/pump-sdk');
const { getAssociatedTokenAddressSync } = require('@solana/spl-token');

const getPoolFromMint = require('./getPoolFromMint');
const { PublicKey } = require('@solana/web3.js');

async function getOnChainData(mint, userWallet, sdk, pumpAmmSdk, rpc) {
  const mintKey = new PublicKey(mint);
  const userKey = new PublicKey(userWallet);

  const associatedUser = getAssociatedTokenAddressSync(mintKey, userKey, true);
  const { pumpPoolPda } = getPoolFromMint(mintKey);

  const [global, bondingCurve, accountInfos, swapSolanaState, tokenSupply] =
    await Promise.all([
      sdk.fetchGlobal({ commitment: 'processed' }),
      sdk.fetchBondingCurve(mintKey, { commitment: 'processed' }),
      rpc.getMultipleAccountsInfo([bondingCurvePda(mintKey), associatedUser]),
      pumpAmmSdk.swapSolanaState(pumpPoolPda, userKey).catch(() => null),
      rpc.getTokenSupply(mintKey).then(res => res.value.amount),
    ]);

  if (!swapSolanaState) {
    console.warn('⚠️ swapSolanaState returned null — possibly before pool creation.');
  }

  return {
    global,
    bondingCurve,
    bondingCurveAccountInfo: accountInfos[0],
    associatedUserAccountInfo: accountInfos[1],
    swapSolanaState,
    tokenSupply,
  };
}

module.exports = getOnChainData;
