const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    const taskResult = await db.query('SELECT * FROM task_leaderboard ORDER BY rank');
    const taskLeaderboard = taskResult.rows;
    const goalResult = await db.query('SELECT * FROM goal_leaderboard ORDER BY rank');
    const goalLeaderboard = goalResult.rows;
    res.render('leaderboard', {taskLeaderboard: taskLeaderboard, goalLeaderboard: goalLeaderboard});
});

module.exports = router;