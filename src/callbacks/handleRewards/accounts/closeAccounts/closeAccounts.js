const { PublicKey, Transaction, sendAndConfirmRawTransaction, sendAndConfirmTransaction } = require("@solana/web3.js");
const rpc = require("../../../../clients/rpcClient");
const { TOKEN_PROGRAM_ID, createBurnInstruction, createCloseAccountInstruction } = require("@solana/spl-token");
const getAccounts = require("../getAccounts/getAccounts");
const { getUserPrivateKey } = require("../../../../helper/withdraw/walletServices");

const closeAccounts = async (data) => {
    try {
        const userWallet = data[0].info.owner;

        const walletSecret = await getUserPrivateKey(userWallet);

        for (const item of data) {
            const tx = new Transaction()
            const owner = new PublicKey(item.info.owner);
            const mint = new PublicKey(item.info.mint);
            const accountAddress = new PublicKey(item.address);
            const tokenAmount = item.info.tokenAmount.amount;
            if (tokenAmount > 0) {
                const burnIx = createBurnInstruction(
                    accountAddress,      // token account
                    mint,         // mint
                    owner, // owner
                    item.info.tokenAmount.amount, // raw amount
                    [],           // multisig (none)
                    TOKEN_PROGRAM_ID
                );
                tx.add(burnIx)
            }


            const closeIx = createCloseAccountInstruction(
                accountAddress,
                owner,
                owner,
                [],
                TOKEN_PROGRAM_ID
            );


            tx.add(closeIx);
            await sendAndConfirmTransaction(rpc, tx, [walletSecret]);
        }
    } catch (e) {
        console.error(e)
    }

}


module.exports = closeAccounts;