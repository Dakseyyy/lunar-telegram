
const dbClient = require("../../../helper/dbConnect/dbClient");
const { currentSolPrice } = require("../../../helper/fetchSolPrice/fetchSolPrice");



async function updatePositionsBuys({ mainInstruction, solAmount, tokenData, userId }) {
    try {
        
        const solPrice = currentSolPrice.get('currentSOLPrice');
        const tokenSupply = mainInstruction.tokenSupply
        const avgEntry = (tokenSupply * solAmount * solPrice) / (mainInstruction.tokenAmountOut);
        const positions = await dbClient.query('SELECT * FROM user_positions WHERE token_mint_address = $1 AND tg_user_id = $2', [tokenData.mint, userId]);
        
        if (!positions?.rows[0]) {
            (await dbClient.query('INSERT INTO user_positions (tg_user_id, token_name, avg_entry, total_buys, total_sells, token_mint_address, bought, sold, holding, authority, tokens_holding, token_supply) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [userId, tokenData.ticker, avgEntry, 1, 0, tokenData.mint, solAmount, 0, solAmount, tokenData?.authority, mainInstruction.tokenAmountOut / 1e6, tokenSupply / 1e6]))
        } else if (positions?.rows[0]) {
            const oldAvgEntry = parseFloat(positions.rows[0].avg_entry);
            const oldHoldingAmount = parseFloat(positions.rows[0].tokens_holding);
            const newAvgEntry = avgEntry;
            const newTokenAmount = parseFloat(mainInstruction.tokenAmountOut / 1e6);
            const newMarketCap = (oldAvgEntry * oldHoldingAmount + newAvgEntry * newTokenAmount) / (oldHoldingAmount + newTokenAmount);
            console.log(tokenSupply)
            const response = await dbClient.query('UPDATE user_positions SET total_buys = total_buys + 1, bought = bought + $1, tokens_holding = tokens_holding + $2, avg_entry = $3, created_at = $4, token_supply = $5 WHERE tg_user_id = $6 AND token_mint_address = $7', [solAmount, newTokenAmount, newMarketCap, new Date(), tokenSupply, userId, tokenData.mint])
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = updatePositionsBuys