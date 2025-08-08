require('dotenv').config({ path: '../../../../../../.env' });
const fetchBuySettings = require("../../../../callbacks/handleBuy/databaseQueries/fetchBuySettings");
const walletServices = require("../../../../helper/withdraw/walletServices");
const { PublicKey } = require('@solana/web3.js');
const { getAssociatedTokenAddress } = require('@solana/spl-token');
const createPublicKeysConfig = require('../../../createPublicKeysConfig');
const getBondingCurve = require('./getCurves/getBondingCurve');
const getAssociatedBondingCurve = require('./getCurves/getAssociatedBondingCurve');
const getUserTokenAccount = require('./getUserTokenAccount/getUserTokenAccount');
const getCreatorWallet = require('./creator/getCreatorWallet');
const getCreatorVault = require('./creator/getCreatorVault');
const getGlobalVolumeAccumulator = require('./Accumulators/getGlobalVolumeAccumulator');
const getUserVolumeAccumulator = require('./Accumulators/getUserVolumeAccumulator');
const PUMPFUN_PRE_BONDING_CONFIG = {
    GLOBAL_ACCOUNT: '4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf',
    FEE_RECIPIENT: 'CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM',
    EVENT_AUTHORITY: 'Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1',
    SYSTEM_PROGRAM: '11111111111111111111111111111111',
    PROGRAM_ID: '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P',
    TOKEN_PROGRAM: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
};
async function sellParams({ userId }) {
    try {
        const userSettings = await fetchBuySettings(userId);
        const userWallet = '567X49kV4s7b8GiRG9bNGXWPi47fJPqNus2mCJmgMZXb';
        const userWalletPubKey = new PublicKey(userWallet)

        const config = createPublicKeysConfig(PUMPFUN_PRE_BONDING_CONFIG)

        const tokenMint = 'BrsunMbcxxs34NZw57hLCHU7sNHeWRAKAmKcHqXCpump';
        const mintPubkey = new PublicKey(tokenMint);
        const bondingCurve = getBondingCurve(mintPubkey, config.programId);
        const associatedBondingCurve = await getAssociatedBondingCurve({ bondingCurve, mintPubkey });

        const userTokenAccount = await getUserTokenAccount(mintPubkey, userWalletPubKey);

        const creatorWallet = await getCreatorWallet(bondingCurve);
        const creatorVault = await getCreatorVault({ creatorWallet: new PublicKey(creatorWallet), programIdPubkey: config.programId })

        const globalVolumeAccumulator = getGlobalVolumeAccumulator({ userPubkey: userWalletPubKey, programId: config.programId })
        const userVolumeAccumulator = getUserVolumeAccumulator({ userPubkey: userWalletPubKey, programId: config.programId })
        console.log({
            global: config.global.toString(),
            feeRecipient: config.feeRecipient.toString(),
            mint: tokenMint,
            bondingCurve: bondingCurve.toString(),
            associatedBondingCurve: associatedBondingCurve.toString(),
            associatedUser: userTokenAccount.toString(),
            user: userWallet,
            creatorVault: creatorVault.toString(),
            tokenProgram: config.tokenProgram.toString(),
            eventAuthority: config.eventAuthority.toString(),
            program: config.programId.toString(),
            globalVolumeAccumulator: globalVolumeAccumulator.toString(),
            userVolumeAccumulator: userVolumeAccumulator.toString()
        })
        return {
            global: config.global.toString(),
            feeRecipient: config.feeRecipient.toString(),
            mint: tokenMint,
            bondingCurve: bondingCurve.toString(),
            associatedBondingCurve: associatedBondingCurve.toString(),
            associatedUser: userTokenAccount.toString(),
            user: userWallet,
            creatorVault: creatorVault.toString(),
            tokenProgram: config.tokenProgram.toString(),
            eventAuthority: config.eventAuthority.toString(),
            program: config.programId.toString(),
            globalVolumeAccumulator: globalVolumeAccumulator.toString(),
            userVolumeAccumulator: userVolumeAccumulator.toString()
        }
    } catch (e) {
        console.error(e);
    }
}
sellParams({ userId: 6287265455 })
module.exports = sellParams;