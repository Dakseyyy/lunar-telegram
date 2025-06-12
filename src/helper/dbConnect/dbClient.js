const {Pool} = require('pg')
require('dotenv').config({path: '../../../.env'})
const client = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    keepAlive: true,
    idleTimeoutMillis: 30000, // optional: closes idle connections after 30s
    connectionTimeoutMillis: 2000, // optional: wait max 2s when acquiring a connection
    max: 10 // optional: max number of clients in pool
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