const { getAssociatedTokenAddress } = require("@solana/spl-token");

async function getAssociatedBondingCurve({mintPubkey, bondingCurve}) {
    try {
        const associatedBondingCurve = await getAssociatedTokenAddress(
            mintPubkey,           // token mint
            bondingCurve,      // owner (the bonding curve PDA)
            true                  // allowOwnerOffCurve = true (since PDA)
        );
        return associatedBondingCurve;
    } catch (e) {
        console.error(e);
    }
}

module.exports = getAssociatedBondingCurve;