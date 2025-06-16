const fetchSolPrice = async () => {
    try {
        const res = await fetch ('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        const data = await res.json();
        solPrice = data.solana.usd
        return {
            solPrice: solPrice
        }
    } catch (err) {
        console.error('Error fetching SOL price:', err);
    }
}

module.exports = fetchSolPrice;