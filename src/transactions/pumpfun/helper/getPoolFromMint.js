// getPoolFromMint.js
const { PublicKey } = require('@solana/web3.js');
const { poolPda, pumpPoolAuthorityPda } = require('@pump-fun/pump-swap-sdk');

const SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
const CANONICAL_POOL_INDEX = 0;

function getPoolFromMint(mint) {
  const [pumpPoolAuthority] = pumpPoolAuthorityPda(mint);
  const [pumpPoolPda] = poolPda(CANONICAL_POOL_INDEX, pumpPoolAuthority, mint, SOL_MINT);
  return { pumpPoolPda, pumpPoolAuthority };
}

module.exports = getPoolFromMint;