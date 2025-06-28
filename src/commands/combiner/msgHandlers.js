const pingCommand = require('../debug/ping/ping');
const startCommand = require('../handlers/start/startCommand')
const styleCommand = require('../debug/messageStyler/styleCommand')
const referralCommand = require('../handlers/referrals/referralsCommand')
const {settingsCommand} = require('../handlers/settings/settingsCommand')
module.exports = {
    pingCommand, 
    startCommand,
    styleCommand,
    settingsCommand,
    referralCommand
}


