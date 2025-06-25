const dbClient = require('../dbConnect/dbClient')
const autobuyStates = require('../../memory/autobuyStates/autobuyStates')
const fetchAutobuyState = async (userId) => {
    if (autobuyStates.has(userId)) {
        console.log('User already has autobuyState saved in memory.')
        return;
    } else {
        console.log('User does not have autobuy state saved in memory, trying to fetch from database.')
        const fetchAutobuyState = await dbClient.query('SELECT autobuy FROM user_account_settings WHERE tg_user_id = $1', [userId]);
        if (fetchAutobuyState.rows[0].autobuy === false) {
            console.log('User has autobuy turned off.')
            return;
        }
        console.log('Setting autobuyState')
        autobuyStates.set(userId, true);
    }
}
module.exports = fetchAutobuyState;