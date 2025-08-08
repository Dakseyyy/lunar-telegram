const { PublicKey } = require("@solana/web3.js");

function getUserVolumeAccumulator({ userPubkey, programId }) {
    try {
        const [userVolumeAccumulator] = PublicKey.findProgramAddressSync(
            [Buffer.from("user_volume_accumulator"), userPubkey.toBuffer()],
            programId
        );
        return userVolumeAccumulator
    } catch (e) {
        console.error(e);
    }
}

module.exports = getUserVolumeAccumulator;