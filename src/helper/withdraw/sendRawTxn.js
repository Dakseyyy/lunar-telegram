const rpc = require('../../clients/rpcClient');
async function sendRawTxn(tx) {

        const txid = await rpc.sendRawTransaction(tx.serialize());
        return txid
       
    
}

module.exports = sendRawTxn;
