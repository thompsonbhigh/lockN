const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth } = require('./login');

function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

function addMonths(date, months) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getMonth() + months);
    return newDate;
}

router.get('/', auth, async (req, res) => {
    const result = await db.query('SELECT * FROM tasks WHERE user_id = $1', [req.cookies.user.id]);
    const result2 = await db.query('SELECT * FROM tasks WHERE user_id = $1 AND status = false', [req.cookies.user.id]);
    const incompleteTasks = result2.rows.length;
    const emptyInfo = await db.query('SELECT * FROM tasks WHERE user_id = $1', [req.cookies.user.id]);
    const isEmpty = emptyInfo.rows.length == 0;

    const taskInfo= await db.query('SELECT rank, tasks_completed FROM task_leaderboard WHERE username = $1', [req.cookies.user.username]);
    const taskRank = taskInfo.rows.at(0).rank;
    const tasksCompleted = taskInfo.rows.at(0).tasks_completed;

    const date = new Date();
    const today = date.toISOString().slice(0, 10);
    const tasksTodayInfo = await db.query('SELECT COUNT(*) FROM tasks WHERE status = TRUE AND user_id = $1 AND date_completed = $2', [req.cookies.user.id, today]);
    const tasksToday = tasksTodayInfo.rows.at(0).count;

    const weekDate = addDays(date, 7);
    const week = weekDate.toISOString().slice(0, 10);
    const tasksWeekInfo = await db.query('SELECT COUNT(*) FROM tasks WHERE status = TRUE AND user_id = $1 AND date_completed BETWEEN $2 AND $3', [req.cookies.user.id, today, week]);
    const tasksWeek = tasksWeekInfo.rows.at(0).count;

    res.render('tasks.ejs', {
        tasks: result.rows, 
        incompleteTasks: incompleteTasks, 
        isEmpty: isEmpty,
        userTaskRank: taskRank,
        userTasksCompleted: tasksCompleted,
        tasksToday: tasksToday,
        tasksWeek: tasksWeek
    });
});

router.post('/add', async (req, res) => {
    await db.query('INSERT INTO tasks (user_id, task) VALUES ($1, $2)', [req.cookies.user.id, req.body.task]);
    res.redirect('/tasks');
});

router.post('/complete', async (req, res) => {
    await db.query('UPDATE tasks SET status = true, date_completed = $3 WHERE user_id = $1 AND id = $2', [req.cookies.user.id, req.body.taskid, new Date()]);
    await db.query('UPDATE users SET tasks_completed = tasks_completed + 1 WHERE id = $1', [req.cookies.user.id]);
    res.redirect('/tasks');
});

router.post('/delete', async (req, res) => {
    await db.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [req.body.taskid, req.cookies.user.id]);
    res.redirect('/tasks');
})

module.exports = router;