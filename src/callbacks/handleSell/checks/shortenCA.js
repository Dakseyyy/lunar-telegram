function shortenCA(ca) {
    try {
         return `${ca.slice(0, 4)}...${ca.slice(-4)}`;
    } catch (e) {
        console.error(e);
    }
}

module.exports = shortenCA;