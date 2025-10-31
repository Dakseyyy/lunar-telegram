const { ComputeBudgetProgram } = require("@solana/web3.js");

function setComputeUnitPriceInstruction({ userTransactionSettings, intent }) {
    try {

        if (intent === 'sell') {
            const computeUnits = 200000;
            const totalLamports = userTransactionSettings.sell_priority_fee * 1_000_000_000;
            const lamportsPerUnit = totalLamports / computeUnits;
            const setComputeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: Math.floor(lamportsPerUnit * 1_000_000) // 670000 micro-lamports
            });
            return setComputeUnitPriceInstruction
        } else if (intent === 'buy') {

            const computeUnits = 200000;
            const totalLamports = parseFloat(userTransactionSettings.buy_priority_fee) * 1_000_000_000;
            const lamportsPerUnit = totalLamports / computeUnits;
           
            const setComputeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: Math.floor(lamportsPerUnit * 1_000_000) // 670000 micro-lamports
            });
            return setComputeUnitPriceInstruction
        }

    } catch (e) {
        console.error(e);
    }
}

module.exports = setComputeUnitPriceInstruction;