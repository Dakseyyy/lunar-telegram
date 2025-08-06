const {Pool, Client} = require('pg')
require('dotenv').config({path: '../../../.env'});
const fs = require('fs');
const dbClient = new Client({
    connectionString: process.env.DATABASE_URL,
   
    keepAlive: true,
    keepAliveInitialDelayMillis: 0,
    connectionTimeoutMillis: 2000

})

dbClient.on('error', (err) => {
  console.error(err);
});

dbClient.on('connect', () => {
    console.log('Database connected');
});

dbClient.on('remove', () => {
    console.log('Database connection removed from pool');
});

dbClient.connect().catch(err => {
    console.error('Failed to connect:', err);
});
module.exports = dbClient;