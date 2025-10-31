const { currentSolPrice } = require("../../../helper/fetchSolPrice/fetchSolPrice");
const getPrice = require("../../../transactions/getPrices/getPrice");

const formatNumber = n =>
    n < 1e3 ? n.toString() :
        n < 1e6 ? (n / 1e3).toFixed(n < 1e4 ? 1 : 0) + 'K' :
            n < 1e9 ? (n / 1e6).toFixed(n < 1e7 ? 1 : 0) + 'M' :
                (n / 1e9).toFixed(n < 1e10 ? 1 : 0) + 'B';

const genPositionsMessage = async (context, positions, pageNumber) => {
    try {
        if (context === 'show_positions') {
            const solPrice = currentSolPrice.get('currentSOLPrice')
            let totalBalanceUSD = 0;
            const positionStrings = await Promise.all(
                positions.map(async (item, index) => {
                    const { tokenPrice, marketCap } = await getPrice({
                        mint: item.token_mint_address,
                        authority: item.authority
                    });
                    totalBalanceUSD += item.tokens_holding * tokenPrice
                    console.log({
                        sold: item.sold * solPrice,
                        holding: item.tokens_holding * tokenPrice,
                        bought: item.bought * solPrice
                    })
                    item.tokens_sold = Number(item.tokens_sold);
                    item.avg_entry = Number(item.avg_entry);
                    item.token_supply = Number(item.token_supply);
                    item.token_supply = item.token_supply
                    item.avg_exit = Number(item.avg_exit)
                    item.tokens_holding = Number(item.tokens_holding);
                    item.tokens_sold = Number(item.tokens_sold)
                    const avgEntryPricePerToken = item.avg_entry / item.token_supply;
                    const avgExitPricePerToken = item.avg_exit / item.token_supply;
                    const currentPricePerToken = marketCap / item.token_supply;


                    const realizedPnL = item.tokens_sold * (avgExitPricePerToken - avgEntryPricePerToken);
                                     
                    const unrealizedPnL = item.tokens_holding * (currentPricePerToken - avgEntryPricePerToken);

                    const totalPnL = realizedPnL + unrealizedPnL;
                    console.log({
                      marketCap,
                      ...item
                    })
                    const totalTokensBought = item.tokens_sold + item.tokens_holding;
                    const totalCostBasis = totalTokensBought * avgEntryPricePerToken;

                    const totalPnLPercent = (totalPnL / totalCostBasis) * 100;
                    return `💰 ${item.token_name} - <a href='https://dexscreener.com/solana/${item.token_mint_address}'>View Chart 📈</a>
<code>${item.token_mint_address}</code>
• Average Entry: <b>${formatNumber(item.avg_entry)}</b>
• Bought: <code>$${(item.bought * solPrice).toFixed(3)} USD (${item.total_buys})</code>
• Sold: <code>$${(item.sold * solPrice).toFixed(3)} USD (${item.total_sells})</code>
• Holding: <code>$${(item.tokens_holding * tokenPrice).toFixed(4)} USD</code>
• PnL: <code>${(((item.sold * solPrice) + (item.tokens_holding * tokenPrice)) - (item.bought * solPrice)).toFixed(3) > 0
                            ? `$${totalPnL.toFixed(3)} USD (${totalPnLPercent.toFixed(2)}%) 🟢`
                            : `$${totalPnL.toFixed(3)} USD (${totalPnLPercent.toFixed(2)}%) 🔴`}
</code><a href="https://t.me/lunarsolana_bot?start=sell_${item.token_mint_address}">[SELL 100%]</a>
\n`;
                })
            );

            const positions_message = `🌙 Lunar Positions\n\n${positionStrings.join('')}`;
            const positions_markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [...(pageNumber > 0
                            ? [{ text: '⟵ Previous Page', callback_data: `positions_${pageNumber - 1}` }]
                            : []
                        ), { text: 'Next Page ⟶', callback_data: `positions_${pageNumber + 1}` }],
                        [{ text: '⟵ Back to start', callback_data: 'back_to_start' }, { text: '↻ Refresh', callback_data: 'positions' }]
                    ]
                }
            };
            return { positions_message, positions_markup };
        }
        if (context === 'no_positions') {

            const positions_message = `🌙<b> Lunar Positions</b>\n\n${pageNumber > 0 ? 'No more positions on this page.' : "You don't have any active trades."}\n\nTrade more tokens to see them listed here.`;
            const positions_markup = {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [pageNumber > 0 ? { text: '⟵ Previous Page', callback_data: `positions_${pageNumber - 1}` } : { text: '⟵ Back to start', callback_data: 'back_to_start' }, { text: '↻ Refresh', callback_data: 'positions' }],
                        [...(pageNumber > 0 ? [{ text: '⟵ Back to start', callback_data: 'back_to_start' }] : [])]
                    ]
                }
            };
            return { positions_message, positions_markup };
        }
    } catch (e) {
        console.error(e)
    }

}
module.exports = genPositionsMessage;