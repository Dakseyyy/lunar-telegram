const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
require('dotenv').config({path: '../../.env'});
    const rpcURL = process.env.HELIUS_RPC_URL;
    const rpc = new Connection(rpcURL, {
        commitment: 'confirmed',
        wsEndpoint: process.env.HELIUS_RPC_WSS
    });


module.exports = rpc;