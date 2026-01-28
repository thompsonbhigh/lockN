require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres.qqnxipfoiahghtptzpba',
    host: 'aws-0-us-west-2.pooler.supabase.com',
    database: 'postgres',
    password: process.env.PASSWORD,
    port: 5432,
    pool_mode: 'session',
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(client => {
        console.log('Connected to PostgreSQL database');
        client.release();
    })
    .catch(err => console.error('Connection error', err.stack));

process.on('SIGINT', async () => {
    await pool.end();
    console.log('Database connection closed');
    process.exit(0);
});

module.exports = pool;