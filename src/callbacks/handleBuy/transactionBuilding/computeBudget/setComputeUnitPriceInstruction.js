const { ComputeBudgetProgram } = require("@solana/web3.js");

function setComputeUnitPriceInstruction() {
    try {
        const setComputeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: Math.floor(0.67 * 1_000_000) // 670000 micro-lamports
        }); 
        return setComputeUnitPriceInstruction
    } catch (e) {
        console.error(e);
    }
}

module.exports = setComputeUnitPriceInstruction;