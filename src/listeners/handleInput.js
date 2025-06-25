const feeInput = require('../callbacks/handleCustomFees/feeInputHandler');
const autobuyInput = require('../callbacks/handleAutobuy/handleAutobuyInput')
const purchaseCA = require('../helper/autobuy/autobuy')
const handleInput = {
    feeInput,
    autobuyInput,
    purchaseCA
}

module.exports = handleInput;