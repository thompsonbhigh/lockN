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

module.exports = router;