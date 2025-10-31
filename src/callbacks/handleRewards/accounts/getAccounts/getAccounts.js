const { Connection, Keypair, PublicKey, clusterApiUrl, sendAndConfirmTransaction, Transaction } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, createCloseAccountInstruction } = require('@solana/spl-token');
const rpc = require('../../../../clients/rpcClient');
const heliusRPC = require('../../../../clients/rpcClient');


const getAccounts = async (wallet) => {
    const walletPubkey = new PublicKey(wallet)
    const accounts = await heliusRPC.getParsedTokenAccountsByOwner(
        walletPubkey,
        { programId: TOKEN_PROGRAM_ID }
    );
    
    let accountsArray = [];
    accounts.value.forEach(account => {
        if (account.account.data.parsed.info.tokenAmount.uiAmount < 0.5 && account.account.data.parsed.info.mint !== 'So11111111111111111111111111111111111111112') {
          
            accountsArray.push({ info: account.account.data.parsed.info, address: account.pubkey.toBase58() })
            
        }

    })

    return accountsArray;
}

module.exports = getAccounts;