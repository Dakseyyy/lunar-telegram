const { PublicKey } = require("@solana/web3.js");

function getBondingCurve(mintPubkey, programIdPubkey) {
    try {
        const [bondingCurvePda, bondingCurveBump] = PublicKey.findProgramAddressSync(
            [Buffer.from("bonding-curve"), mintPubkey.toBuffer()],
            programIdPubkey
        );
        return bondingCurvePda;
    } catch (e) {
        console.error(e);
    }
}

module.exports = getBondingCurve;