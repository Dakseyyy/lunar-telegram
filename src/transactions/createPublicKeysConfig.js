const { PublicKey } = require('@solana/web3.js');
function createPublicKeysConfig(config) {
    try {
        return {
            global: new PublicKey(config.GLOBAL_ACCOUNT),
            feeRecipient: new PublicKey(config.FEE_RECIPIENT),
            eventAuthority: new PublicKey(config.EVENT_AUTHORITY),
            systemProgram: new PublicKey(config.SYSTEM_PROGRAM),
            programId: new PublicKey(config.PROGRAM_ID),
            tokenProgram: new PublicKey(config.TOKEN_PROGRAM)
        };
    } catch (e) {
        console.error(e);
    }
}

module.exports = createPublicKeysConfig;