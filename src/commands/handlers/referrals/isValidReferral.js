const isValidReferral = (referral) => {
    try {
        if (referral === undefined) {
            return false;
        } else if (/^[_a-z0-9]{1,20}$/.test(referral) === false) {
            return false;
    } else {
        return true;
    }
    } catch (e) {
        console.error(e)
    }

}

module.exports = isValidReferral