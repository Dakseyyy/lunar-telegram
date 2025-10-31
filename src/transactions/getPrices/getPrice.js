const getPricePumpFun = require("./getPricePumpFun");

async function getPrice({mint, authority}) {
    try {

        if (authority === 'TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM') {
            
            const prices = await getPricePumpFun({mint, authority})

            return {marketCap: prices.marketCap, tokenPrice: prices.tokenPrice};
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = getPrice;