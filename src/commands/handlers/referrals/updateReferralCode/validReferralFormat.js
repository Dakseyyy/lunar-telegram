const blockedWords = ['null', 'undefined', 'true', 'false', 'nan']
const validReferralFormat = async(input) => {
    try {
       if (typeof input === 'string' && blockedWords.includes(input) === false) {
         const regex = /^[a-z0-9_]{4,32}$/
        console.log(regex.test(input))
        return regex.test(input)
       } else {
        return false;
       }
    } catch(e) {
        console.error(e)
    }
}
module.exports = validReferralFormat