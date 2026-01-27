const dotenv = require('dotenv');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://thompsonhigh:1OumXjcPaqbvQwwkQPpux9aAUnwcNwwr@dpg-d460a8f5r7bs73as4mg0-a.oregon-postgres.render.com/lockndb_lafs',
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