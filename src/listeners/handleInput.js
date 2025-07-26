const feeInput = require('../callbacks/handleCustomFees/feeInputHandler');
const autobuyInput = require('../callbacks/handleAutobuy/handleAutobuyInput')
const purchaseCA = require('../helper/autobuy/autobuy')
const handleReferralCodeInput = require('../commands/handlers/referrals/updateReferralCode/handleReferralCodeInput')
const captureCopytradeInput = require('../callbacks/handleCopytrade/captureCopytradeInput');
const captureInput = require('../callbacks/handleWithdraw/handleWithdrawActions/chooseSolana/captureInput');
const chooseWallet = require('../callbacks/handleWithdraw/handleWithdrawActions/chooseWallet/chooseWallet');
const captureWalletInput = require('../callbacks/handleWithdraw/handleWithdrawActions/chooseWallet/captureWalletInput');
const handleInput = {
    feeInput,
    autobuyInput,
    purchaseCA,
    handleReferralCodeInput,
    captureCopytradeInput,
    captureInput,
    captureWalletInput
}

module.exports = handleInput;