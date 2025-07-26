let solPrice = null;
let intervalId = null;
const currentSolPrice = new Map()

const fetchSolPrice = async () => {
    try {
        const res = await fetch ('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        const data = await res.json();
        solPrice = data.solana.usd
        currentSolPrice.set('currentSOLPrice', solPrice)
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

module.exports = {solPriceFetcher, getSolPrice, currentSolPrice};