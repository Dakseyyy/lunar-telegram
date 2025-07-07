const pingCommand = require('../debug/ping/ping');
const startCommand = require('../handlers/start/startCommand')
const styleCommand = require('../debug/messageStyler/styleCommand')
const referralCommand = require('../handlers/referrals/referralsCommand')
const {settingsCommand} = require('../handlers/settings/settingsCommand')
const positionsCommand = require('../handlers/positions/positionsCommand')
module.exports = {
    pingCommand, 
    startCommand,
    styleCommand,
    settingsCommand,
    referralCommand,
    positionsCommand
}


