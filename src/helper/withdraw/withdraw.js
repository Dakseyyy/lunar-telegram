const turnkey = require('../turnkeyClient/turnkeyClient')
const rpc = require('../../clients/rpcClient');
const dbClient = require('../dbConnect/dbClient');
const bs58 = require('bs58')
const { Transaction, PublicKey, Keypair, ComputeBudgetProgram, ComputeBudgetInstruction, SystemProgram } = require('@solana/web3.js');
const decryptKey = require('../crypto/decryptKey');
const messageServices = require('./messageService')
const walletServices = require('./walletServices');
const getFee = require('./getFee');
const fetchSolBal = require('../fetchSolBal/fetchSolBal');
const sendRawTxn = require('./sendRawTxn');
const handleIntent = require('./handleIntent');
let messageToEdit = null;
const withdraw = async ({ userId, chatId, bot, intent }) => {
    try {
        const userWallet = await walletServices.getuserWallet(userId);


        let lamports = await handleIntent({ userId, userWallet, intent })
        let solAmount = lamports / 1e9;
        if (solAmount <= 0.001) {
            bot.sendMessage(chatId, '⚠️ Minimum withdrawal amount is 0.001 SOL.')
            return;
        }
        const withdrawWallet = await walletServices.getUserWithdrawWallet(userId);
        const walletSecretKeypair = await walletServices.getUserPrivateKey(userWallet);
        const { blockhash, lastValidBlockHeight } = await rpc.getLatestBlockhash('finalized');

        const fromPubkey = new PublicKey(userWallet);
        const toPubkey = new PublicKey(withdrawWallet);

        console.log(lamports)
        if (!userWallet || !withdrawWallet || lamports <= 0) {
            if (lamports <= 0) {
                bot.sendMessage(chatId, '⚠️ Not enough to cover fees!');
                return;
            }
            bot.sendMessage(chatId, '⚠️ Invalid wallet addresses or amount');
            throw new Error('Invalid wallet addresses or amount');

        }

        const tx = new Transaction({
            blockhash,
            lastValidBlockHeight,
            feePayer: fromPubkey
        })
        const transferInstruction = SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: lamports
        })

        tx.add(transferInstruction);
        const serializedTx = tx.serialize({
            requireAllSignatures: false,
            verifySignatures: false
        });

        const signature = tx.sign(walletSecretKeypair);
        const txid = await sendRawTxn(tx);

        let { message: pendingMessage, markup: pendingMarkup } = messageServices.pendingWithdraw({
            userWallet,
            withdrawalWallet: withdrawWallet,
            solAmount,
            signature: txid
        });

        messageToEdit = await bot.sendMessage(chatId, pendingMessage, pendingMarkup);
        console.log(`Transaction sent! TXID: ${txid}`);
        const confirmation = await rpc.confirmTransaction({
            signature: txid,
            blockhash,
            lastValidBlockHeight
        });
        let { message: successfulMessage, markup: successfulMarkup } = messageServices.successfulWithdraw({
            userWallet,
            withdrawalWallet: withdrawWallet,  // or just `withdrawWallet` if same
            solAmount,
            signature: txid
        });
        bot.editMessageText(successfulMessage, {
            chat_id: chatId,
            message_id: messageToEdit.message_id,
            ...successfulMarkup
        })
    } catch (e) {
        if (!e.transactionMessage) {
            console.error(e)
            bot.sendMessage(chatId, '⚠️Something went wrong.');
            return;
        }
        console.log(e.transactionMessage);
        let { message: failedMessage, markup: failedMarkup } = messageServices.failedWithdraw(e.transactionMessage)
        bot.sendMessage(chatId, failedMessage, failedMarkup)
    }
}

module.exports = withdraw;