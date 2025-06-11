const {Client} = require('pg')
require('dotenv').config({path: '../../../.env'})
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

async function connectDb() {
    try {
        await client.connect();
        console.log('Connected to database.')
        const dbTime = await client.query('SELECT NOW()');
        console.log('Database time: ', dbTime.rows[0].now);
    } catch (err) {
        console.error('DB connection error: ', err)
    }
}

connectDb();

module.exports = client;