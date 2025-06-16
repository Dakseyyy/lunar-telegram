const {Pool} = require('pg')
require('dotenv').config({path: '../../../.env'})
const client = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    // Connection pool settings
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
    allowExitOnIdle: true // Allow the pool to close all connections and exit when there are no active connections

})

client.on('error', (err) => {
  console.error('Database shut down');
});

client.on('connect', () => {
    console.log('Database connected');
});

client.on('remove', () => {
    console.log('Database connection removed from pool');
});
module.exports = client;