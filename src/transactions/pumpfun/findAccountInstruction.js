const { PublicKey } = require("@solana/web3.js");

    const filterCloseAccount = (instructions) => {
        
            return instructions.filter(ix =>
                !(
                    ix.programId.equals(new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')) &&
                    ix.data[0] === 9
                )
            );
        };


 module.exports = filterCloseAccount;