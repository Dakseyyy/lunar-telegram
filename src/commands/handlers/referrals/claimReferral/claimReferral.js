const heliusRPC = require("../../../../clients/rpcClient");
const dbClient = require("../../../../helper/dbConnect/dbClient");
const bs58 = require('bs58')
const { Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const claimReferralMessageService = require("./claimReferralMessageService");
const referralCommand = require("../referralsCommand");
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../../../../.env') });
const feeWalletPublicKey = '89XZApftcSvAs5dXkN8WxTwonMcs4cLZGLMevaTiCTvy';
const feeWalletPrivateKey = process.env.FEE_VAULT_SECRET;
const claimReferral = async (userId, bot, chatId, callbackQuery) => {
    try {
        const unclaimedSOL = (await dbClient.query('SELECT unclaimed_sol FROM user_referrals WHERE tg_user_id = $1', [userId])).rows[0].unclaimed_sol;
        if (unclaimedSOL < 0.00001) {
            claimReferralMessageService('not_enough_sol', bot, chatId);
            return;
        }


        const userWallet = (await dbClient.query('SELECT wallet FROM user_wallets WHERE tg_user_id = $1', [userId])).rows[0].wallet;
        const fromKeypair = Keypair.fromSecretKey(bs58.decode(feeWalletPrivateKey));
        const toPubkey = new PublicKey(userWallet);
        const lamports = unclaimedSOL * LAMPORTS_PER_SOL;

        const tx = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey,
                lamports,
            })
        );
        bot.sendMessage(chatId, 'Claiming referral rewards... ⏳')
        const sig = await sendAndConfirmTransaction(heliusRPC, tx, [fromKeypair]);

        console.log(`✅ Transaction confirmed: ${sig}`);

        // update DB to reset unclaimed_sol
        await dbClient.query('UPDATE user_referrals SET unclaimed_sol = 0 WHERE tg_user_id = $1', [userId]);

        claimReferralMessageService('success', bot, chatId, sig);

        await bot.deleteMessage(chatId, callbackQuery.message.message_id);
        await dbClient.query('UPDATE user_referrals SET claimed_sol = COALESCE(claimed_sol, 0) + $1 WHERE tg_user_id = $2', [unclaimedSOL, userId])
        referralCommand(bot, callbackQuery)

    } catch (e) {
        console.error(e)
    }
}

module.exports = claimReferral;