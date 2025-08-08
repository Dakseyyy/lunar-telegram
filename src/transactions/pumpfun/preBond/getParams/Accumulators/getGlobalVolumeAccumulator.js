const { PublicKey } = require("@solana/web3.js");

function getGlobalVolumeAccumulator({ userPubkey, programId }) {
    try {
        const [globalVolumeAccumulator] = PublicKey.findProgramAddressSync(
            [Buffer.from("global_volume_accumulator")],
            programId
        );
        return globalVolumeAccumulator;
    } catch (e) {
        console.error(e);
    }
}

module.exports = getGlobalVolumeAccumulator;