const dbClient = require("../../helper/dbConnect/dbClient");
const { getuserWallet } = require("../../helper/withdraw/walletServices");
const closeAccounts = require("./accounts/closeAccounts/closeAccounts");
const getAccounts = require("./accounts/getAccounts/getAccounts");
const getRewardStats = require("./getRewardStats");
const rewardsMessageService = require("./rewardsMessageService");
const path = require('path');
const bs58 = require('bs58')
const { Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const heliusRPC = require("../../clients/rpcClient");
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const feeWalletPrivateKey = process.env.FEE_VAULT_SECRET;
const handleRewards = async (bot, callbackQuery) => {
    try {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const userId = callbackQuery.from.id;

        let rewardStats = await getRewardStats(userId);
        const userWallet = await getuserWallet(userId);
        console.log(userWallet)
        if (callbackQuery.data === "claim_rewards") {
            const unclaimedAccounts = await getAccounts(userWallet);
            console.log(unclaimedAccounts)
            if (unclaimedAccounts.length <= 0 && Number(rewardStats.unclaimed_cashback) <= 0.000001) {
                await rewardsMessageService({ intent: "not_enough_rewards", bot, chatId, messageId });
                return;
            }
            await bot.sendMessage(chatId, '⏳ Claiming your rewards...')
            await closeAccounts(unclaimedAccounts);
            
            const fromKeypair = Keypair.fromSecretKey(bs58.decode(feeWalletPrivateKey));
            const toPubkey = new PublicKey(userWallet);
            const lamports = Math.round(Number(rewardStats.unclaimed_cashback) * LAMPORTS_PER_SOL);
            const tx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: fromKeypair.publicKey,
                    toPubkey,
                    lamports,
                })
            );
            const sig = await sendAndConfirmTransaction(heliusRPC, tx, [fromKeypair]);
            const txResult = await heliusRPC.getSignatureStatus(sig, { searchTransactionHistory: true });
            if (txResult?.value?.err === null) {
                await dbClient.query('UPDATE user_rewards SET unclaimed_cashback = $1 WHERE tg_user_id = $2', [0, userId])
                await rewardsMessageService({ intent: "successful_claim", bot, chatId, messageId });
                
            } else {
                await bot.sendMessage(chatId, '⚠ Failed to claim cashback rewards. Something went wrong.')
                return;
            }
            const result = await dbClient.query(
                "SELECT total_rewards_claimed FROM user_rewards WHERE tg_user_id = $1",
                [userId]
            );
            let total_claimed = Number(result?.rows?.[0]?.total_rewards_claimed || 0);
            total_claimed += unclaimedAccounts.length * 0.37;

            await dbClient.query(
                "UPDATE user_rewards SET total_rewards_claimed = $1 WHERE tg_user_id = $2",
                [total_claimed, userId]
            );
            rewardStats = await getRewardStats(userId);
            await rewardsMessageService({
                intent: "default",
                bot,
                chatId,
                messageId,
                unclaimedAccountsAmount: 0,
                rewardStats: rewardStats,
            });
            return;
        }

        // Default view (not claiming)
        const unclaimedAccounts = await getAccounts(userWallet);
        const unclaimedAccountsAmount = unclaimedAccounts.length;

        await rewardsMessageService({
            intent: "default",
            bot,
            chatId,
            messageId,
            unclaimedAccountsAmount,
            rewardStats,
        });
    } catch (e) {
        console.error("❌ handleRewards error:", e);
    }
};

module.exports = handleRewards;
