let solPrice = null;
let intervalId = null;
const fetchSolPrice = async () => {
    try {
        console.log('fetching...')
        const res = await fetch ('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        const data = await res.json();
        solPrice = data.solana.usd
    } catch (err) {
        console.error('Error fetching SOL price:', err);
    }
}

const solPriceFetcher = () => {
    if (intervalId) return;

    fetchSolPrice();
    intervalId = setInterval(fetchSolPrice, 60 * 1000)
}

let getSolPrice = () => {if (!solPrice) {return 'unkown'} else {return solPrice}}

module.exports = {solPriceFetcher, getSolPrice};