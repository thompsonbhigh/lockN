const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async function(req, res){
    const { rows } = await db.query('SELECT * FROM exercises');
    const exercises = { exercises: rows };
    res.render('addExercise', exercises);
});

router.get('/search', async (req, res) => {
    const query = req.query.query;
    const { rows } = await db.query('SELECT * FROM exercises WHERE name ILIKE $1 OR muscle ILIKE $1', [`%${query}%`]);
    const exercises = { exercises: rows };
    res.render('addExercise', exercises);
});

router.post('/', async (req, res) => {
    const exerciseId = Object.keys(req.body)[0];
    const userId = req.cookies.user.id;
    const day = req.session.day;
    await db.query('INSERT INTO workouts (user_id, exercise_id, day) VALUES ($1, $2, $3)', [userId, exerciseId, day]);
    res.redirect('../plan');
});

module.exports = router;