const { PublicKey } = require("@solana/web3.js");
const rpc = require("../../../../../clients/rpcClient");

async function getCreatorWallet(bondingCurvePda) {
  try {
    const accountInfo = await rpc.getAccountInfo(new PublicKey(bondingCurvePda));
    if (!accountInfo) throw new Error("BondingCurve account not found");

    // Verify discriminator
    const expectedDiscriminator = Buffer.from([23, 183, 248, 55, 96, 216, 172, 96]);
    if (!accountInfo.data.slice(0, 8).equals(expectedDiscriminator)) {
      throw new Error("Invalid BondingCurve discriminator");
    }

    // Extract creator at offset 49 (8 + 5*8 + 1)
    const creatorBytes = accountInfo.data.slice(49, 81); // 32 bytes for pubkey
    const creator = new PublicKey(creatorBytes);
    return creator.toBase58();
  } catch (e) {
    console.error("Error fetching creator wallet:", e);
    throw e;
  }
}

module.exports = getCreatorWallet;