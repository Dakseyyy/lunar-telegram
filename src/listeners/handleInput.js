const feeInput = require('../callbacks/handleCustomFees/feeInputHandler');
const autobuyInput = require('../callbacks/handleAutobuy/handleAutobuyInput')
const purchaseCA = require('../helper/autobuy/autobuy')
const handleReferralCodeInput = require('../commands/handlers/referrals/updateReferralCode/handleReferralCodeInput')
const captureCopytradeInput = require('../callbacks/handleCopytrade/captureCopytradeInput');
const handleInput = {
    feeInput,
    autobuyInput,
    purchaseCA,
    handleReferralCodeInput,
    captureCopytradeInput
}

module.exports = handleInput;