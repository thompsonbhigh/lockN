const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth } = require('./login');

router.get('/', auth, async (req, res) => {
    const result = await db.query('SELECT * FROM goals WHERE user_id = $1', [req.cookies.user.id]);
    const result2 = await db.query('SELECT * FROM goals WHERE user_id = $1 AND status = false AND type = $2', [req.cookies.user.id, 'weekly']);
    const result3 = await db.query('SELECT * FROM goals WHERE user_id = $1 AND status = false AND type = $2', [req.cookies.user.id, 'monthly']);
    const result4 = await db.query('SELECT * FROM goals WHERE user_id = $1 AND status = false AND type = $2', [req.cookies.user.id, 'yearly']);
    const incompleteWeeklyGoals = result2.rows.length;
    const incompleteMonthlyGoals = result3.rows.length;
    const incompleteYearlyGoals = result4.rows.length;
    res.render('goals', {goals: result.rows, incompleteWeeklyGoals: incompleteWeeklyGoals, incompleteMonthlyGoals: incompleteMonthlyGoals, incompleteYearlyGoals: incompleteYearlyGoals});
});

router.post('/add', async (req, res) => {
    const { goal, goaltype } = req.body;
    await db.query('INSERT INTO goals (user_id, goal, type) VALUES ($1, $2, $3)', [req.cookies.user.id, goal, goaltype]);
    res.redirect('/goals');
});

router.post('/complete', async (req, res) => {
    const goalId = req.body.goalid;
    await db.query('UPDATE goals SET status = true WHERE user_id = $1 AND id = $2', [req.cookies.user.id, goalId]);
    await db.query('UPDATE users SET goals_completed = goals_completed + 1 WHERE id = $1', [req.cookies.user.id]);
    res.redirect('/goals');
});

router.post('/delete', async (req, res) => {
    await db.query('DELETE FROM goals WHERE id = $1 AND user_id = $2', [req.body.goalid, req.cookies.user.id]);
    res.redirect('/goals');
})

module.exports = router;