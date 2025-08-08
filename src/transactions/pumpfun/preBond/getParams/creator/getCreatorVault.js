const { PublicKey } = require("@solana/web3.js");

async function getCreatorVault({creatorWallet, programIdPubkey}) {
    try {
        const [creatorVault, creatorVaultBump] = PublicKey.findProgramAddressSync(
            [Buffer.from("creator-vault"), creatorWallet.toBuffer()],
            programIdPubkey
        );
        return creatorVault;

    } catch (e) {
        console.error(e);
    }
}

module.exports = getCreatorVault;