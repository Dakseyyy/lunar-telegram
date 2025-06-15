const {Pool} = require('pg')
require('dotenv').config({path: '../../../.env'})
const client = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },


})

client.on('error', (err) => {
  console.error('Unexpected DB error on idle client', err);
});


module.exports = client;