const isValidReferral = require('./isValidReferral')

const processReferral = async(msg) => {
        const referral = msg.match(/^\/start(?:\s+(.+))?/);
        console.log(isValidReferral(referral[1]));
}

module.exports = processReferral;