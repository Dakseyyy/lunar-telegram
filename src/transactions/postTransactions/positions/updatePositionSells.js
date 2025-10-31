const dbClient = require("../../../helper/dbConnect/dbClient");
const { currentSolPrice } = require("../../../helper/fetchSolPrice/fetchSolPrice");

async function updatePositionsSells({ mainInstruction, userId, tokenAmountIn, solAmountIn, solAmountOut, tokenData }) {
    try {
        const solPrice = currentSolPrice.get('currentSOLPrice');
        const tokenSupply = mainInstruction.tokenSupply / 1e6
        solAmountOut = solAmountOut / 1e9
        const avgExit = (tokenSupply * solAmountOut * solPrice) / (tokenAmountIn);
        const tokenPriceInUSD = (solAmountOut / tokenAmountIn) * solPrice
        console.log({
            avgExit,
            tokenSupply,
            tokenAmountIn,

        })
        const positions = await dbClient.query('SELECT * FROM user_positions WHERE token_mint_address = $1 AND tg_user_id = $2', [tokenData.mint, userId])
        const old_tokens_sold = Number(positions.rows[0].tokens_sold) || 0
        const old_avg_exit = Number(positions.rows[0].avg_exit) || 0;
        const new_avg_exit = ((old_avg_exit * old_tokens_sold) + (avgExit * tokenAmountIn)) / (old_tokens_sold + tokenAmountIn);
        
        console.log({
            old_avg_exit,
            new_avg_exit, old_tokens_sold,
            tokenAmountIn
        })
        console.log({userId, mint: tokenData.mint})
        const result = await dbClient.query(`UPDATE user_positions SET tokens_holding = tokens_holding - $1, sold = sold + $2, avg_exit = $3, total_sells = total_sells + 1, tokens_sold = tokens_sold + $4, token_supply = $5 WHERE tg_user_id = $6 AND token_mint_address = $7`, [tokenAmountIn, solAmountOut, new_avg_exit, tokenAmountIn, tokenSupply, userId, tokenData.mint]);
    } catch (e) {
        console.error(e);
    }
}

module.exports = updatePositionsSells;