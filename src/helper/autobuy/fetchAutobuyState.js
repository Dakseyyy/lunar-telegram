const dbClient = require('../dbConnect/dbClient')
const autobuyStates = require('../../memory/autobuyStates/autobuyStates')
const fetchAutobuyState = async (userId) => {
    if (autobuyStates.has(userId)) {

        return;
    } else {

        const fetchAutobuyState = await dbClient.query('SELECT autobuy FROM user_account_settings WHERE tg_user_id = $1', [userId]);
        if (fetchAutobuyState.rows[0].autobuy === false) {

            return;
        }

        autobuyStates.set(userId, true);
    }
}
module.exports = fetchAutobuyState;