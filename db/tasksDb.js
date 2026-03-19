const db = require('../db.js');

async function createTask(userId, { name }) {
    const query = 'INSERT INTO tasks (user_id, task) VALUES ($1, $2) RETURNING id, task';

    const values = [
        userId,
        name
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
}

module.exports = {
    createTask
};