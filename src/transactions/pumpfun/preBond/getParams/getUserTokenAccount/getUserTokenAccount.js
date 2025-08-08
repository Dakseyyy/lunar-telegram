const { getAssociatedTokenAddress } = require("@solana/spl-token");

async function getUserTokenAccount(mint, keyPairPublicKey) {
    try {
        const userTokenAccount = await getAssociatedTokenAddress(
            mint,              // token mint
            keyPairPublicKey,  // owner (user's wallet)
            false                    // allowOwnerOffCurve = false (normal wallet)
        );
        return userTokenAccount;
    } catch (e) {
        console.error(e);
    }
}

module.exports = getUserTokenAccount 