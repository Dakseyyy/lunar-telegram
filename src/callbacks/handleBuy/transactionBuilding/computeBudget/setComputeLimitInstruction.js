const { Transaction, ComputeBudgetProgram } = require("@solana/web3.js");

function setComputeLimitInstruction() {
    try {

        const setComputeUnitLimitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
            units: 150000
        });

        return setComputeUnitLimitInstruction;
    } catch (e) {
        console.error(e);
    }
}

module.exports = setComputeLimitInstruction