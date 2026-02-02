const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth } = require('./login.js');

router.get('/', auth, async (req, res) => {
    const taskResult = await db.query('SELECT * FROM task_leaderboard ORDER BY rank');
    const taskLeaderboard = taskResult.rows;
    const goalResult = await db.query('SELECT * FROM goal_leaderboard ORDER BY rank');
    const goalLeaderboard = goalResult.rows;
    const username = req.cookies.user.username;
    res.render('leaderboard', {taskLeaderboard: taskLeaderboard, goalLeaderboard: goalLeaderboard, username: username});
});

module.exports = router;