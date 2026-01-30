const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth } = require('./login');

router.get('/', auth, async (req, res) => {
    const result = await db.query('SELECT * FROM tasks WHERE user_id = $1', [req.cookies.user.id]);
    const result2 = await db.query('SELECT * FROM tasks WHERE user_id = $1 AND status = false', [req.cookies.user.id]);
    const incompleteTasks = result2.rows.length;
    const emptyInfo = await db.query('SELECT * FROM tasks WHERE user_id = $1', [req.cookies.user.id]);
    const isEmpty = emptyInfo.rows.length == 0;
    res.render('tasks.ejs', {tasks: result.rows, incompleteTasks: incompleteTasks, isEmpty: isEmpty});
});

router.post('/add', async (req, res) => {
    await db.query('INSERT INTO tasks (user_id, task) VALUES ($1, $2)', [req.cookies.user.id, req.body.task]);
    res.redirect('/tasks');
});

router.post('/complete', async (req, res) => {
    await db.query('UPDATE tasks SET status = true WHERE user_id = $1 AND id = $2', [req.cookies.user.id, req.body.taskid]);
    await db.query('UPDATE users SET tasks_completed = tasks_completed + 1 WHERE id = $1', [req.cookies.user.id]);
    res.redirect('/tasks');
});

router.post('/delete', async (req, res) => {
    await db.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [req.body.taskid, req.cookies.user.id]);
    res.redirect('/tasks');
})

module.exports = router;