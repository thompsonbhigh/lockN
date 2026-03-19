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
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
}

router.get('/', auth, async (req, res) => {
    const result = await db.query('SELECT * FROM goals WHERE user_id = $1', [req.cookies.user.id]);
    const result2 = await db.query('SELECT * FROM goals WHERE user_id = $1 AND status = false AND type = $2', [req.cookies.user.id, 'weekly']);
    const result3 = await db.query('SELECT * FROM goals WHERE user_id = $1 AND status = false AND type = $2', [req.cookies.user.id, 'monthly']);
    const result4 = await db.query('SELECT * FROM goals WHERE user_id = $1 AND status = false AND type = $2', [req.cookies.user.id, 'yearly']);

    const emptyInfoWeekly = await db.query('SELECT * FROM goals WHERE user_id = $1 AND type = $2', [req.cookies.user.id, 'weekly']);
    const emptyInfoMonthly = await db.query('SELECT * FROM goals WHERE user_id = $1 AND type = $2', [req.cookies.user.id, 'monthly']);
    const emptyInfoYearly = await db.query('SELECT * FROM goals WHERE user_id = $1 AND type = $2', [req.cookies.user.id, 'yearly']);

    const emptyWeekly = emptyInfoWeekly.rows.length == 0;
    const emptyMonthly = emptyInfoMonthly.rows.length == 0;
    const emptyYearly = emptyInfoYearly.rows.length == 0;

    const isEmpty = {
        weekly: emptyWeekly,
        monthly: emptyMonthly,
        yearly: emptyYearly
    };

    const goalInfo= await db.query('SELECT rank, goals_completed FROM goal_leaderboard WHERE username = $1', [req.cookies.user.username]);
    const goalRank = goalInfo.rows.at(0).rank;
    const goalsCompleted = goalInfo.rows.at(0).goals_completed;

    const incompleteWeeklyGoals = result2.rows.length;
    const incompleteMonthlyGoals = result3.rows.length;
    const incompleteYearlyGoals = result4.rows.length;

    const date = new Date();
    const today = date.toLocaleDateString('en-CA').slice(0, 10);

    const year = date.toLocaleDateString('en-CA').slice(0, 4);
    const goalsYearInfo = await db.query('SELECT COUNT(*) FROM goals WHERE status = TRUE AND user_id = $1 AND EXTRACT(YEAR FROM date_completed) = $2', [req.cookies.user.id, year]);
    const goalsYear = goalsYearInfo.rows.at(0).count;

    const weekDate = addDays(date, -7);
    const week = weekDate.toLocaleDateString('en-CA').slice(0, 10);
    const goalsWeekInfo = await db.query('SELECT COUNT(*) FROM goals WHERE status = TRUE AND user_id = $1 AND date_completed BETWEEN $2 AND $3', [req.cookies.user.id, week, today]);
    const goalsWeek = goalsWeekInfo.rows.at(0).count;

    const monthDate = addMonths(date, -1);
    const month = monthDate.toLocaleDateString('en-CA').slice(0, 10);
    const goalsMonthInfo = await db.query('SELECT COUNT(*) FROM goals WHERE status = TRUE AND user_id = $1 AND date_completed BETWEEN $2 AND $3', [req.cookies.user.id, month, today]);
    const goalsMonth = goalsMonthInfo.rows.at(0).count;

    res.render('goals', {
        goals: result.rows, 
        incompleteWeeklyGoals: incompleteWeeklyGoals, 
        incompleteMonthlyGoals: incompleteMonthlyGoals, 
        incompleteYearlyGoals: incompleteYearlyGoals, 
        isEmpty: isEmpty,
        goalsWeek: goalsWeek,
        goalsMonth: goalsMonth,
        goalsYear: goalsYear,
        userGoalRank: goalRank,
        userGoalCompleted: goalsCompleted
    });
});

router.post('/add', async (req, res) => {
    const { goal, goaltype } = req.body;
    await db.query('INSERT INTO goals (user_id, goal, type) VALUES ($1, $2, $3)', [req.cookies.user.id, goal, goaltype]);
    res.redirect('/goals');
});

router.post('/complete', async (req, res) => {
    const goalId = req.body.goalid;
    await db.query('UPDATE goals SET status = true, date_completed = $3 WHERE user_id = $1 AND id = $2', [req.cookies.user.id, goalId, new Date().toLocaleDateString().slice(0, 10)]);
    await db.query('UPDATE users SET goals_completed = goals_completed + 1 WHERE id = $1', [req.cookies.user.id]);
    res.redirect('/goals');
});

router.post('/delete', async (req, res) => {
    await db.query('DELETE FROM goals WHERE id = $1 AND user_id = $2', [req.body.goalid, req.cookies.user.id]);
    res.redirect('/goals');
})

module.exports = router;