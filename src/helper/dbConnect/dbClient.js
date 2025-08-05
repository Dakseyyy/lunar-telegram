const {Pool, Client} = require('pg')
require('dotenv').config({path: '../../../.env'});
const fs = require('fs');
console.log(process.env.DATABASE_URL)
const client = new Client({
    connectionString: process.env.DATABASE_URL,
   
    keepAlive: true,
    keepAliveInitialDelayMillis: 0,
    connectionTimeoutMillis: 2000

})

client.on('error', (err) => {
  console.error(err);
});

client.on('connect', () => {
    console.log('Database connected');
});

client.on('remove', () => {
    console.log('Database connection removed from pool');
});

client.connect().catch(err => {
    console.error('Failed to connect:', err);
});
module.exports = client;